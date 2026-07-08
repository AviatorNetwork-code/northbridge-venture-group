import type { NeoResponse } from "@/lib/neo/types";
import type { NeoCapabilities } from "@/lib/neo/snapshots";

export function adaptNeoResponse(payload: unknown): NeoResponse | null {
  if (!payload || typeof payload !== "object") return null;

  const data = payload as Record<string, unknown>;
  if (typeof data.reply !== "string") return null;

  return {
    reply: data.reply,
    quickReplies: Array.isArray(data.quickReplies)
      ? data.quickReplies.filter((item): item is string => typeof item === "string")
      : undefined,
    actions: Array.isArray(data.actions) ? (data.actions as NeoResponse["actions"]) : undefined,
    recommendations: Array.isArray(data.recommendations)
      ? (data.recommendations as NeoResponse["recommendations"])
      : undefined,
    profileUpdates:
      data.profileUpdates && typeof data.profileUpdates === "object"
        ? (data.profileUpdates as Record<string, unknown>)
        : undefined,
    metadata:
      data.metadata && typeof data.metadata === "object"
        ? (data.metadata as Record<string, unknown>)
        : undefined,
  };
}

export function adaptCapabilities(payload: unknown): NeoCapabilities | null {
  if (!payload || typeof payload !== "object") return null;

  const data = payload as Record<string, unknown>;

  return {
    workforce: Boolean(data.workforce),
    connectors: Boolean(data.connectors),
    launch: Boolean(data.launch),
    cat: Boolean(data.cat),
    billing: Boolean(data.billing ?? false),
    oauth: Boolean(data.oauth ?? false),
    operationsSnapshot: Boolean(data.operationsSnapshot ?? true),
  };
}
