import type { LaunchStatusSnapshot } from "@/lib/neo/snapshots";
import { adaptLaunchStatus } from "@/lib/neo/adapters/workforce-adapter";

export function adaptLaunchStatusSnapshot(payload: unknown): LaunchStatusSnapshot | null {
  if (!payload || typeof payload !== "object") return null;

  const data = payload as Record<string, unknown>;
  const status = adaptLaunchStatus(data);

  if (!status || typeof data.score !== "number") {
    return null;
  }

  return {
    status,
    score: data.score,
    launched: Boolean(data.launched),
    blockerCount: typeof data.blockerCount === "number" ? data.blockerCount : 0,
    estimatedGoLive:
      typeof data.estimatedGoLive === "string" ? data.estimatedGoLive : "Not estimated",
  };
}
