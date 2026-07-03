import type { AdaptiveExperiencePlan } from "../types/recommendations.js";
import type { AEEOutputEnvelope, AEEOutputTarget } from "../types/integration.js";

/** Governance policy — AEE is read-only and recommendation-only. */
export const AEE_GOVERNANCE = {
  readOnly: true as const,
  allowsAutomaticUiUpdates: false as const,
  allowsAutomaticPromptUpdates: false as const,
  allowsAutomaticPersonalization: false as const,
  allowsCommits: false as const,
  allowsTaskCreation: false as const,
  allowsExecution: false as const,
  requiresFounderApproval: true as const,
};

export function assertReadOnlyOperation(operation: string): void {
  const forbidden = [
    "write_ui",
    "modify_prompt",
    "apply_personalization",
    "commit",
    "create_task",
    "execute",
    "deploy",
  ];

  if (forbidden.includes(operation)) {
    throw new Error(
      `AEE governance violation: operation "${operation}" is forbidden. Founder approval required before any product changes.`,
    );
  }
}

export function wrapRecommendationOutput(
  target: AEEOutputTarget,
  payload: unknown,
): AEEOutputEnvelope {
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

export function validateExperiencePlan(plan: AdaptiveExperiencePlan): AdaptiveExperiencePlan {
  return {
    ...plan,
    requiredFounderApproval: true,
    recommendations: plan.recommendations.map((rec) => ({
      ...rec,
      requiresFounderApproval: true,
    })),
  };
}
