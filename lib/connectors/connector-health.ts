import type {
  ConnectorHealthSummary,
  ConnectorInstance,
  ConnectorRuntimeState,
  ConnectorSyncEvent,
} from "@/lib/connectors/connector-types";
import {
  connectorCatalog,
  DEFAULT_CONNECTED_IDS,
  DEFAULT_SYNCING_IDS,
  getConnectorById,
} from "@/lib/connectors/connector-catalog";

function createDefaultRuntime(connectorId: string): ConnectorRuntimeState {
  if (DEFAULT_CONNECTED_IDS.includes(connectorId)) {
    return {
      status: "connected",
      health: connectorId === "stripe" || connectorId === "vercel" ? 100 : 97,
      lastSync: "2 min ago",
      connectedWorkforce: getConnectorById(connectorId)?.usedBySpecialists.slice(0, 2) ?? [],
      permissionStatus: "granted",
      syncHistory: [
        {
          id: `${connectorId}-sync-1`,
          timestamp: "2 min ago",
          message: "Sync completed successfully",
          status: "success",
        },
      ],
      connectedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    };
  }

  if (DEFAULT_SYNCING_IDS.includes(connectorId)) {
    return {
      status: "syncing",
      health: 91,
      lastSync: "Syncing now",
      connectedWorkforce: getConnectorById(connectorId)?.usedBySpecialists.slice(0, 1) ?? [],
      permissionStatus: "granted",
      syncHistory: [
        {
          id: `${connectorId}-sync-1`,
          timestamp: "Just now",
          message: "Initial sync in progress",
          status: "warning",
        },
      ],
      connectedAt: new Date().toISOString(),
    };
  }

  return {
    status: "available",
    health: 0,
    lastSync: null,
    connectedWorkforce: [],
    permissionStatus: "none",
    syncHistory: [],
    connectedAt: null,
  };
}

export function buildDefaultConnectorState(): Record<string, ConnectorRuntimeState> {
  const state: Record<string, ConnectorRuntimeState> = {};
  for (const connector of connectorCatalog) {
    state[connector.id] = createDefaultRuntime(connector.id);
  }
  return state;
}

export function mergeConnectorInstances(
  runtime: Record<string, ConnectorRuntimeState>,
): ConnectorInstance[] {
  return connectorCatalog.map((catalog) => ({
    ...catalog,
    ...(runtime[catalog.id] ?? createDefaultRuntime(catalog.id)),
  }));
}

export function summarizeConnectorHealth(instances: ConnectorInstance[]): ConnectorHealthSummary {
  const connected = instances.filter((item) => item.status === "connected").length;
  const syncing = instances.filter((item) => item.status === "syncing").length;
  const needsAttention = instances.filter(
    (item) => item.status === "needs_attention" || item.status === "authorization_required",
  ).length;

  const activeInstances = instances.filter(
    (item) => item.status === "connected" || item.status === "syncing",
  );
  const avgHealth =
    activeInstances.length > 0
      ? Math.round(
          activeInstances.reduce((sum, item) => sum + item.health, 0) / activeInstances.length,
        )
      : 0;

  const lastSync = activeInstances
    .map((item) => item.lastSync)
    .filter(Boolean)
    .sort()[0];

  const coreConnected = ["gmail", "google-calendar", "stripe"].every((id) => {
    const instance = instances.find((item) => item.id === id);
    return instance?.status === "connected" || instance?.status === "syncing";
  });

  return {
    total: instances.length,
    connected,
    syncing,
    needsAttention,
    avgHealth,
    lastSyncLabel: lastSync ?? "Never",
    readyToLaunch: coreConnected && connected >= 3,
  };
}

export function createConnectionSyncEvent(message: string, status: ConnectorSyncEvent["status"] = "success"): ConnectorSyncEvent {
  return {
    id: `sync-${Date.now()}`,
    timestamp: "Just now",
    message,
    status,
  };
}
