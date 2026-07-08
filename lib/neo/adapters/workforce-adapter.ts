import type { LaunchStatus } from "@/lib/launch/launch-types";
import type { WorkforceSnapshot } from "@/lib/neo/snapshots";

export function adaptWorkforceSnapshot(payload: unknown): WorkforceSnapshot | null {
  if (!payload || typeof payload !== "object") return null;

  const data = payload as Record<string, unknown>;

  if (
    typeof data.specialistCount !== "number" ||
    typeof data.teamCount !== "number" ||
    typeof data.managerCount !== "number"
  ) {
    return null;
  }

  return {
    specialistCount: data.specialistCount,
    teamCount: data.teamCount,
    managerCount: data.managerCount,
    avgWorkload: typeof data.avgWorkload === "number" ? data.avgWorkload : 0,
    deploymentStatus:
      data.deploymentStatus === "queued" || data.deploymentStatus === "ready"
        ? data.deploymentStatus
        : "none",
  };
}

export function adaptLaunchStatus(payload: unknown): LaunchStatus | null {
  if (!payload || typeof payload !== "object") return null;

  const status = (payload as Record<string, unknown>).status;
  if (
    status === "ready" ||
    status === "nearly-ready" ||
    status === "needs-attention" ||
    status === "blocked"
  ) {
    return status;
  }

  return null;
}
