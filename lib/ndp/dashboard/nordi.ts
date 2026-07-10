import type { DashboardModel, NordiDashboardContext } from "./types.js";

export function buildNordiDashboardContext(dashboard: DashboardModel): NordiDashboardContext {
  return {
    role: "nordi_analyst",
    requestOwner: "nordi",
    dashboard,
    maySummarizeBusinessPerformance: true,
    mayIdentifyTeamsNeedingAttention: true,
    mayExplainChanges: true,
    maySurfaceApprovalItems: true,
    mustNotFabricateDashboardCards: true,
    mustNotInventKpis: true,
    mustNotChangeOwnership: true,
  };
}

export function summarizeDashboardForNordi(dashboard: DashboardModel): string {
  const activeTeams = dashboard.metadata.availableTeams.length;
  const attentionTeams = dashboard.sections
    .find((section) => section.id === "active_digital_teams")
    ?.cards.filter((card) => card.status === "warning" || card.status === "critical")
    .map((card) => card.sourceTeamId)
    .filter(Boolean);

  const approvalItems = dashboard.recommendations.filter((entry) => entry.approvalRequired);
  const staleReports = dashboard.metadata.reportFreshness.filter(
    (entry) => entry.status === "stale",
  );

  const lines = [
    `Dashboard covers ${activeTeams} active team${activeTeams === 1 ? "" : "s"}.`,
    `${dashboard.recommendations.length} team-owned recommendations available with source attribution preserved.`,
    `${dashboard.alerts.length} alerts aggregated across teams.`,
  ];

  if (attentionTeams && attentionTeams.length > 0) {
    lines.push(`Teams needing attention: ${[...new Set(attentionTeams)].join(", ")}.`);
  }

  if (approvalItems.length > 0) {
    lines.push(`${approvalItems.length} item${approvalItems.length === 1 ? "" : "s"} may require customer approval.`);
  }

  if (staleReports.length > 0) {
    lines.push(`${staleReports.length} team report${staleReports.length === 1 ? "" : "s"} marked stale.`);
  }

  return lines.join(" ");
}

export function answerNordiDashboardQuestion(
  dashboard: DashboardModel,
  question: string,
): string {
  const normalized = question.toLowerCase();

  if (normalized.includes("how is my business")) {
    return summarizeDashboardForNordi(dashboard);
  }

  if (normalized.includes("which team needs attention")) {
    const teams = dashboard.sections
      .find((section) => section.id === "active_digital_teams")
      ?.cards.filter((card) => card.status === "warning" || card.status === "critical")
      .map((card) => card.title);
    return teams && teams.length > 0
      ? `Teams needing attention: ${teams.join(", ")}.`
      : "No teams currently flagged for elevated attention.";
  }

  if (normalized.includes("what changed today") || normalized.includes("what changed")) {
    const activity = dashboard.sections.find((section) => section.id === "recent_activity");
    const count = activity?.cards.length ?? 0;
    return count > 0
      ? `${count} recent team activities recorded in the dashboard model.`
      : "No recent team activity recorded in the current dashboard model.";
  }

  if (normalized.includes("what should i approve") || normalized.includes("approve")) {
    const approvals = dashboard.recommendations.filter((entry) => entry.approvalRequired);
    if (approvals.length === 0) {
      return "No recommendations currently require explicit approval.";
    }
    return approvals
      .map((entry) => `[${entry.sourceTeamId}] ${entry.recommendation}`)
      .join(" ");
  }

  return summarizeDashboardForNordi(dashboard);
}
