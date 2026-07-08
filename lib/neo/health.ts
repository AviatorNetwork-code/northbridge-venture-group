import type { NeoProviderMode } from "@/lib/neo/config";

export type NeoHealthStatus = "connected" | "mock" | "degraded" | "unavailable";

export type NeoHealth = {
  status: NeoHealthStatus;
  configuredProvider: NeoProviderMode;
  activeProvider: NeoProviderMode;
  baseUrl?: string;
  lastChecked: string;
  latencyMs?: number;
  message?: string;
};

export const NEO_HEALTH_LABELS: Record<NeoHealthStatus, string> = {
  connected: "Connected",
  mock: "Mock",
  degraded: "Degraded",
  unavailable: "Unavailable",
};

export const NEO_HEALTH_COLORS: Record<NeoHealthStatus, string> = {
  connected: "text-emerald-400",
  mock: "text-amber-400",
  degraded: "text-orange-400",
  unavailable: "text-red",
};

export function createHealthSnapshot(
  partial: Omit<NeoHealth, "lastChecked"> & { lastChecked?: string },
): NeoHealth {
  return {
    ...partial,
    lastChecked: partial.lastChecked ?? new Date().toISOString(),
  };
}
