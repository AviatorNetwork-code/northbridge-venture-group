import type { MultiTeamOperationsView } from "./types.js";

export interface NordiOperationsAnalysisContext {
  role: "nordi_analyst";
  requestOwner: "nordi";
  operationsView: MultiTeamOperationsView;
  maySummarizeTeamPerformance: true;
  mayExplainCrossTeamIssues: true;
  mayIdentifyMissingInformation: true;
  mayAskCustomerForDecision: true;
  mayRecommendWaiting: true;
  mayRecommendReducingService: true;
  mayRecommendAddingTeam: true;
  mayRecommendManagerReviewInFuture: true;
  mustNotPresentAsCustomerManager: true;
  mustNotSilentlyOverrideTeamLeads: true;
  mustNotAutonomouslyResolveMaterialConflicts: true;
  mustNotRecommendManagerFromTeamCountAlone: true;
}

export function buildNordiOperationsAnalysisContext(
  operationsView: MultiTeamOperationsView,
): NordiOperationsAnalysisContext {
  return {
    role: "nordi_analyst",
    requestOwner: "nordi",
    operationsView,
    maySummarizeTeamPerformance: true,
    mayExplainCrossTeamIssues: true,
    mayIdentifyMissingInformation: true,
    mayAskCustomerForDecision: true,
    mayRecommendWaiting: true,
    mayRecommendReducingService: true,
    mayRecommendAddingTeam: true,
    mayRecommendManagerReviewInFuture: operationsView.managerEvidence.eligible,
    mustNotPresentAsCustomerManager: true,
    mustNotSilentlyOverrideTeamLeads: true,
    mustNotAutonomouslyResolveMaterialConflicts: true,
    mustNotRecommendManagerFromTeamCountAlone: true,
  };
}

export function buildNordiOperationsSummary(context: NordiOperationsAnalysisContext): string {
  const view = context.operationsView;
  const teamCount = view.hiredTeamIds.length;
  const conflictCount = view.snapshot.conflictingRecommendations.length;
  const signalCount = view.crossTeamSignals.length;

  const lines = [
    `Operations view covers ${teamCount} hired team${teamCount === 1 ? "" : "s"}.`,
    `${view.aggregatedRecommendations.length} team-owned recommendations aggregated without merging incompatible guidance.`,
  ];

  if (signalCount > 0) {
    lines.push(`${signalCount} cross-team signal${signalCount === 1 ? "" : "s"} flagged for customer review.`);
  }

  if (conflictCount > 0) {
    lines.push(`${conflictCount} recommendation conflict${conflictCount === 1 ? "" : "s"} require customer decision.`);
  }

  if (view.managerEvidence.status === "inactive") {
    lines.push("Manager recommendation evidence remains inactive — insufficient historical friction.");
  } else {
    lines.push("Manager recommendation evidence is eligible for future review, not automatic activation.");
  }

  return lines.join(" ");
}
