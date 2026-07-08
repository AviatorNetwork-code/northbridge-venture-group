import type { LaunchStatus } from "@/lib/launch/launch-types";

export type LaunchScoreInput = {
  businessComplete: boolean;
  businessFieldsFilled: number;
  businessFieldsTotal: number;
  connectorsConnected: number;
  connectorsRecommended: number;
  workforceSpecialists: number;
  workforceRecommended: number;
  criticalBlockers: number;
};

export function calculateLaunchScores(input: LaunchScoreInput) {
  const business =
    input.businessFieldsTotal > 0
      ? Math.round((input.businessFieldsFilled / input.businessFieldsTotal) * 100)
      : input.businessComplete
        ? 100
        : 40;

  const connectors =
    input.connectorsRecommended > 0
      ? Math.round((input.connectorsConnected / input.connectorsRecommended) * 100)
      : 0;

  const workforce =
    input.workforceRecommended > 0
      ? Math.round((input.workforceSpecialists / input.workforceRecommended) * 100)
      : input.workforceSpecialists > 0
        ? 80
        : 0;

  const overall = Math.round(business * 0.2 + connectors * 0.4 + workforce * 0.4);

  return {
    business: Math.min(100, business),
    connectors: Math.min(100, connectors),
    workforce: Math.min(100, workforce),
    overall: Math.min(100, overall),
  };
}

export function resolveLaunchStatus(
  overall: number,
  criticalBlockers: number,
): LaunchStatus {
  if (criticalBlockers > 0) return "blocked";
  if (overall >= 85) return "ready";
  if (overall >= 70) return "nearly-ready";
  if (overall >= 50) return "needs-attention";
  return "blocked";
}

export function estimateGoLive(status: LaunchStatus, overall: number): string {
  if (status === "ready") return "Today";
  if (status === "nearly-ready") return overall >= 75 ? "1–2 days" : "3–5 days";
  if (status === "needs-attention") return "1–2 weeks";
  return "Setup required first";
}

export function statusColor(status: LaunchStatus): string {
  if (status === "ready") return "text-emerald-400";
  if (status === "nearly-ready") return "text-blue-300";
  if (status === "needs-attention") return "text-amber-300";
  return "text-red";
}
