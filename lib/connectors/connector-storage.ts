import type { ConnectorRuntimeState } from "@/lib/connectors/connector-types";
import { CONNECTOR_STORAGE_KEY } from "@/lib/connectors/connector-types";
import { buildDefaultConnectorState } from "@/lib/connectors/connector-health";

export function loadConnectorState(): Record<string, ConnectorRuntimeState> {
  if (typeof window === "undefined") {
    return buildDefaultConnectorState();
  }

  try {
    const raw = window.localStorage.getItem(CONNECTOR_STORAGE_KEY);
    if (!raw) return buildDefaultConnectorState();

    const parsed = JSON.parse(raw) as Record<string, ConnectorRuntimeState>;
    return { ...buildDefaultConnectorState(), ...parsed };
  } catch {
    return buildDefaultConnectorState();
  }
}

export function saveConnectorState(state: Record<string, ConnectorRuntimeState>) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(CONNECTOR_STORAGE_KEY, JSON.stringify(state));
  }
}

export function updateConnectorRuntime(
  connectorId: string,
  updates: Partial<ConnectorRuntimeState>,
): Record<string, ConnectorRuntimeState> {
  const current = loadConnectorState();
  const next = {
    ...current,
    [connectorId]: {
      ...current[connectorId],
      ...updates,
    },
  };
  saveConnectorState(next);
  return next;
}

export function disconnectConnector(connectorId: string): Record<string, ConnectorRuntimeState> {
  return updateConnectorRuntime(connectorId, {
    status: "disconnected",
    health: 0,
    lastSync: null,
    connectedWorkforce: [],
    permissionStatus: "revoked",
    connectedAt: null,
  });
}
