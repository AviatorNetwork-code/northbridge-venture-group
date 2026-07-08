import type { ConnectorsSnapshot } from "@/lib/neo/snapshots";

export function adaptConnectorsSnapshot(payload: unknown): ConnectorsSnapshot | null {
  if (!payload || typeof payload !== "object") return null;

  const data = payload as Record<string, unknown>;

  if (typeof data.total !== "number" || typeof data.connected !== "number") {
    return null;
  }

  return {
    total: data.total,
    connected: data.connected,
    syncing: typeof data.syncing === "number" ? data.syncing : 0,
    needsAttention: typeof data.needsAttention === "number" ? data.needsAttention : 0,
    avgHealth: typeof data.avgHealth === "number" ? data.avgHealth : 0,
    lastSyncLabel: typeof data.lastSyncLabel === "string" ? data.lastSyncLabel : "—",
    readyToLaunch: Boolean(data.readyToLaunch),
  };
}
