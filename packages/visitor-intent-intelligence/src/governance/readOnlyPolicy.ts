import type { ImprovementRecommendation, SessionIntelligence } from "../types/reporting.js";
import type { VIIOutputEnvelope, VIIOutputTarget } from "../types/integration.js";

/** Governance policy — VII is read-only and recommendation-only. */
export const VII_GOVERNANCE = {
  readOnly: true as const,
  allowsAutomaticWebsiteChanges: false as const,
  allowsAutomaticCatPromptChanges: false as const,
  allowsCommits: false as const,
  allowsPullRequests: false as const,
  requiresFounderApproval: true as const,
};

export function assertReadOnlyOperation(operation: string): void {
  const forbidden = [
    "write_website",
    "modify_cat_prompt",
    "commit",
    "pull_request",
    "deploy",
  ];

  if (forbidden.includes(operation)) {
    throw new Error(
      `VII governance violation: operation "${operation}" is forbidden. Recommendations require Founder approval.`,
    );
  }
}

export function wrapRecommendationOutput(
  target: VIIOutputTarget,
  payload: unknown,
): VIIOutputEnvelope {
  assertReadOnlyOperation("emit_recommendation");

  return {
    target,
    generatedAt: Date.now(),
    payload,
    governance: {
      readOnly: true,
      requiresFounderApproval: true,
    },
  };
}

export function validateRecommendations(
  recommendations: ImprovementRecommendation[],
): ImprovementRecommendation[] {
  return recommendations.map((rec) => ({
    ...rec,
    requiresFounderApproval: true,
  }));
}

export function validateSessionIntelligence(
  session: SessionIntelligence,
): SessionIntelligence {
  return {
    ...session,
    catImprovementRecommendations: [...session.catImprovementRecommendations],
    productImprovementRecommendations: [...session.productImprovementRecommendations],
  };
}
