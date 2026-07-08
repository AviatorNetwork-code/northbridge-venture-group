import type { ConnectorRuntimeState } from "@/lib/connectors/connector-types";
import { getConnectorById } from "@/lib/connectors/connector-catalog";
import { createConnectionSyncEvent } from "@/lib/connectors/connector-health";
import {
  disconnectConnector,
  loadConnectorState,
  saveConnectorState,
  updateConnectorRuntime,
} from "@/lib/connectors/connector-storage";

export type ConnectorAuthResult = {
  success: boolean;
  connectorId: string;
  state: ConnectorRuntimeState;
  message: string;
};

export type ConnectorHealthCheckResult = {
  connectorId: string;
  health: number;
  status: ConnectorRuntimeState["status"];
  lastSync: string;
};

export interface NeoConnectorApi {
  authorize(connectorId: string): Promise<{ authUrl: string; permissions: string[] }>;
  completeAuthorization(connectorId: string): Promise<ConnectorAuthResult>;
  runHealthCheck(connectorId: string): Promise<ConnectorHealthCheckResult>;
  disconnect(connectorId: string): Promise<void>;
  getState(): Promise<Record<string, ConnectorRuntimeState>>;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class MockNeoConnectorApi implements NeoConnectorApi {
  async authorize(connectorId: string) {
    const connector = getConnectorById(connectorId);
    if (!connector) {
      throw new Error(`Unknown connector: ${connectorId}`);
    }

    updateConnectorRuntime(connectorId, {
      status: "authorization_required",
      permissionStatus: "pending",
    });

    return {
      authUrl: `mock://authorize/${connectorId}`,
      permissions: connector.permissions,
    };
  }

  async completeAuthorization(connectorId: string): Promise<ConnectorAuthResult> {
    await delay(600);

    const connector = getConnectorById(connectorId);
    if (!connector) {
      return {
        success: false,
        connectorId,
        state: loadConnectorState()[connectorId],
        message: "Connector not found",
      };
    }

    const syncingState: ConnectorRuntimeState = {
      status: "syncing",
      health: 85,
      lastSync: "Syncing now",
      connectedWorkforce: connector.usedBySpecialists.slice(0, 2),
      permissionStatus: "granted",
      syncHistory: [
        createConnectionSyncEvent("Authorization approved — running health check", "success"),
      ],
      connectedAt: new Date().toISOString(),
    };

    updateConnectorRuntime(connectorId, syncingState);

    const health = await this.runHealthCheck(connectorId);

    const connectedState: ConnectorRuntimeState = {
      status: health.status,
      health: health.health,
      lastSync: health.lastSync,
      connectedWorkforce: connector.usedBySpecialists.slice(0, 2),
      permissionStatus: "granted",
      syncHistory: [
        createConnectionSyncEvent("Health check passed — connector ready", "success"),
        ...(loadConnectorState()[connectorId]?.syncHistory ?? []).slice(0, 4),
      ],
      connectedAt: new Date().toISOString(),
    };

    const next = updateConnectorRuntime(connectorId, connectedState);

    return {
      success: true,
      connectorId,
      state: next[connectorId],
      message: `${connector.name} is connected.`,
    };
  }

  async runHealthCheck(connectorId: string): Promise<ConnectorHealthCheckResult> {
    await delay(500);

    const health = 94 + Math.floor(Math.random() * 6);

    return {
      connectorId,
      health,
      status: "connected",
      lastSync: "Just now",
    };
  }

  async disconnect(connectorId: string) {
    disconnectConnector(connectorId);
  }

  async getState() {
    return loadConnectorState();
  }
}

export const mockNeoConnectorApi = new MockNeoConnectorApi();

export function subscribeToConnectorChanges(callback: () => void) {
  if (typeof window === "undefined") return () => undefined;

  const handler = (event: StorageEvent) => {
    if (event.key === "northbridge-connector-state") {
      callback();
    }
  };

  window.addEventListener("storage", handler);
  return () => window.removeEventListener("storage", handler);
}
