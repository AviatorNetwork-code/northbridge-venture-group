import type { AnalyzedExperienceContext, AEEInputBundle } from "../types/inputs.js";
import type { ExperienceRecommendation } from "../types/recommendations.js";
import type { PersonalizationScore } from "../types/integration.js";

export function scorePersonalization(
  context: AnalyzedExperienceContext,
  inputs: AEEInputBundle,
  recommendations: ExperienceRecommendation[],
): PersonalizationScore {
  const intentFit = clamp01(inputs.visitorIntent?.confidence ?? 0.5);

  const journeyFit = clamp01(
    context.navigationPattern === "goal_directed"
      ? 0.9
      : context.journeyFrictionLevel === "high"
        ? 0.4
        : 0.65,
  );

  const businessFit = clamp01(context.businessGoalAlignment);

  const evidenceStrength = clamp01(
    recommendations.length > 0
      ? recommendations.reduce((sum, r) => sum + r.evidence.length, 0) /
          (recommendations.length * 4)
      : 0.3,
  );

  const overall = clamp01(
    intentFit * 0.3 + journeyFit * 0.25 + businessFit * 0.25 + evidenceStrength * 0.2,
  );

  return { overall, intentFit, journeyFit, businessFit, evidenceStrength };
}

export function computeEvidenceQuality(
  recommendations: ExperienceRecommendation[],
  inputs: AEEInputBundle,
): number {
  let quality = 0.4;

  if (inputs.visitorIntent) quality += 0.15;
  if (inputs.customerExperience) quality += 0.1;
  if (inputs.businessImpact) quality += 0.1;
  if (inputs.journeyIntelligence) quality += 0.1;
  if (inputs.experimentOutcomes?.length) quality += 0.1;

  const avgEvidence =
    recommendations.length > 0
      ? recommendations.reduce((sum, r) => sum + r.evidence.length, 0) /
        recommendations.length
      : 0;

  quality += Math.min(0.15, avgEvidence * 0.04);

  return clamp01(quality);
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}
