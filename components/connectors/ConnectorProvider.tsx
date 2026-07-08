"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ConnectorInstance } from "@/lib/connectors/connector-types";
import { mergeConnectorInstances, summarizeConnectorHealth } from "@/lib/connectors/connector-health";
import { loadConnectorState } from "@/lib/connectors/connector-storage";
import { mockNeoConnectorApi } from "@/lib/neo/connector-api";

type ConnectorContextValue = {
  instances: ConnectorInstance[];
  health: ReturnType<typeof summarizeConnectorHealth>;
  refresh: () => void;
  connect: (connectorId: string) => Promise<void>;
  disconnect: (connectorId: string) => Promise<void>;
  activeConnectorId: string | null;
  setActiveConnectorId: (id: string | null) => void;
  authConnectorId: string | null;
  setAuthConnectorId: (id: string | null) => void;
};

const ConnectorContext = createContext<ConnectorContextValue | null>(null);

export function ConnectorProvider({ children }: { children: ReactNode }) {
  const [runtime, setRuntime] = useState<Record<string, import("@/lib/connectors/connector-types").ConnectorRuntimeState>>({});
  const [hydrated, setHydrated] = useState(false);
  const [activeConnectorId, setActiveConnectorId] = useState<string | null>(null);
  const [authConnectorId, setAuthConnectorId] = useState<string | null>(null);

  const refresh = useCallback(() => {
    setRuntime(loadConnectorState());
  }, []);

  useEffect(() => {
    refresh();
    setHydrated(true);
  }, [refresh]);

  const instances = useMemo(() => mergeConnectorInstances(runtime), [runtime]);
  const health = useMemo(() => summarizeConnectorHealth(instances), [instances]);

  const connect = useCallback(async (connectorId: string) => {
    setAuthConnectorId(connectorId);
    await mockNeoConnectorApi.authorize(connectorId);
    refresh();
  }, [refresh]);

  const disconnect = useCallback(async (connectorId: string) => {
    await mockNeoConnectorApi.disconnect(connectorId);
    refresh();
  }, [refresh]);

  const value = useMemo<ConnectorContextValue>(
    () => ({
      instances: hydrated ? instances : [],
      health: hydrated ? health : { total: 0, connected: 0, syncing: 0, needsAttention: 0, avgHealth: 0, lastSyncLabel: "—", readyToLaunch: false },
      refresh,
      connect,
      disconnect,
      activeConnectorId,
      setActiveConnectorId,
      authConnectorId,
      setAuthConnectorId,
    }),
    [
      hydrated,
      instances,
      health,
      refresh,
      connect,
      disconnect,
      activeConnectorId,
      authConnectorId,
    ],
  );

  return <ConnectorContext.Provider value={value}>{children}</ConnectorContext.Provider>;
}

export function useConnectors() {
  const context = useContext(ConnectorContext);
  if (!context) {
    throw new Error("useConnectors must be used within ConnectorProvider");
  }
  return context;
}

export function useConnectorsOptional() {
  return useContext(ConnectorContext);
}
