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
import { getNeoClient, type NeoClientApi } from "@/lib/neo/client";
import type { NeoHealth } from "@/lib/neo/health";
import { createHealthSnapshot } from "@/lib/neo/health";

type NeoContextValue = {
  client: NeoClientApi;
  health: NeoHealth | null;
  isCheckingHealth: boolean;
  refreshHealth: () => Promise<NeoHealth>;
};

const NeoContext = createContext<NeoContextValue | null>(null);

const initialHealth = createHealthSnapshot({
  status: "mock",
  configuredProvider: "mock",
  activeProvider: "mock",
  message: "Checking NEO status…",
});

export function NeoProvider({ children }: { children: ReactNode }) {
  const client = useMemo(() => getNeoClient(), []);
  const [health, setHealth] = useState<NeoHealth | null>(null);
  const [isCheckingHealth, setIsCheckingHealth] = useState(true);

  const refreshHealth = useCallback(async () => {
    setIsCheckingHealth(true);
    try {
      const next = await client.refreshHealth();
      setHealth(next);
      return next;
    } catch {
      const fallback = createHealthSnapshot({
        status: "unavailable",
        configuredProvider: "mock",
        activeProvider: "mock",
        message: "NEO health check failed",
      });
      setHealth(fallback);
      return fallback;
    } finally {
      setIsCheckingHealth(false);
    }
  }, [client]);

  useEffect(() => {
    refreshHealth();
  }, [refreshHealth]);

  const value = useMemo<NeoContextValue>(
    () => ({
      client,
      health: health ?? initialHealth,
      isCheckingHealth,
      refreshHealth,
    }),
    [client, health, isCheckingHealth, refreshHealth],
  );

  return <NeoContext.Provider value={value}>{children}</NeoContext.Provider>;
}

export function useNeo() {
  const context = useContext(NeoContext);
  if (!context) {
    throw new Error("useNeo must be used within NeoProvider");
  }

  return context;
}

export function useNeoOptional() {
  return useContext(NeoContext);
}
