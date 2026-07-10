import type {
  ManagerObservationHistory,
  ManagerRecommendationEvidence,
  NormalizedTeamReport,
  RecommendationConflict,
  CrossTeamDependency,
} from "./types.js";

export const DEFAULT_MANAGER_EVIDENCE_THRESHOLD = 3;
export const DEFAULT_MIN_OBSERVATION_DAYS = 30;

export interface BuildManagerEvidenceInput {
  hiredTeamIds: string[];
  reports: NormalizedTeamReport[];
  conflicts: RecommendationConflict[];
  dependencies: CrossTeamDependency[];
  observationHistory?: ManagerObservationHistory;
  minimumEvidenceThreshold?: number;
}

export function buildManagerRecommendationEvidence(
  input: BuildManagerEvidenceInput,
): ManagerRecommendationEvidence {
  const threshold = input.minimumEvidenceThreshold ?? DEFAULT_MANAGER_EVIDENCE_THRESHOLD;
  const observationPeriodDays = input.observationHistory?.observationPeriodDays ?? 0;

  const crossTeamDependencyFrequency =
    (input.observationHistory?.priorCrossTeamDependencyCount ?? 0) + input.dependencies.length;
  const unresolvedConflictFrequency =
    (input.observationHistory?.priorUnresolvedConflictCount ?? 0) + input.conflicts.length;
  const duplicateWorkRate = input.observationHistory?.priorDuplicateWorkCount ?? 0;
  const customerApprovalBurden =
    (input.observationHistory?.priorCustomerApprovalCount ?? 0) +
    input.reports.reduce(
      (count, report) =>
        count + report.recommendations.filter((entry) => entry.requiredApproval).length,
      0,
    );
  const crossTeamEscalationCount = input.reports.reduce(
    (count, report) => count + report.escalations.length,
    0,
  );
  const reportingFragmentationScore = input.reports.length;

  const evidenceScore =
    unresolvedConflictFrequency +
    crossTeamDependencyFrequency +
    Math.floor(customerApprovalBurden / 2) +
    crossTeamEscalationCount;

  const meetsObservationPeriod = observationPeriodDays >= DEFAULT_MIN_OBSERVATION_DAYS;
  const meetsEvidenceThreshold = evidenceScore >= threshold;
  const hasCrossTeamFriction =
    unresolvedConflictFrequency >= 2 || crossTeamDependencyFrequency >= 2;

  const eligible =
    meetsObservationPeriod && meetsEvidenceThreshold && hasCrossTeamFriction;

  const rationale: string[] = [];
  if (!meetsObservationPeriod) {
    rationale.push(
      `Observation period ${observationPeriodDays} days is below minimum ${DEFAULT_MIN_OBSERVATION_DAYS}.`,
    );
  }
  if (!meetsEvidenceThreshold) {
    rationale.push(`Evidence score ${evidenceScore} is below threshold ${threshold}.`);
  }
  if (!hasCrossTeamFriction) {
    rationale.push("Insufficient cross-team friction signals for manager consideration.");
  }
  if (eligible) {
    rationale.push(
      "Evidence threshold met with sustained cross-team friction — manager recommendation may be reviewed in future phases.",
    );
  }

  return {
    status: eligible ? "eligible" : "inactive",
    activeTeamCount: input.hiredTeamIds.length,
    crossTeamDependencyFrequency,
    unresolvedConflictFrequency,
    duplicateWorkRate,
    customerApprovalBurden,
    crossTeamEscalationCount,
    reportingFragmentationScore,
    observationPeriodDays,
    minimumEvidenceThreshold: threshold,
    eligible,
    rationale,
  };
}
