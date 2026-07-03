import type { AEEInputBundle, AnalyzedExperienceContext } from "../types/inputs.js";
import type { ExperienceRecommendation, ImpactSummary } from "../types/recommendations.js";

export function estimateBusinessImpact(
  recommendations: ExperienceRecommendation[],
  inputs: AEEInputBundle,
  context: AnalyzedExperienceContext,
): ImpactSummary {
  if (recommendations.length === 0) {
    return {
      score: 0,
      summary: "Insufficient evidence to estimate business impact.",
      primaryDrivers: [],
    };
  }

  const avgBusiness =
    recommendations.reduce((sum, r) => sum + r.businessImpactScore, 0) /
    recommendations.length;

  const conversionBoost = inputs.businessImpact?.conversionProbability ?? 0;
  const score = clamp100((avgBusiness + conversionBoost) * 50);

  const primaryDrivers = [
    `Intent: ${context.visitorIntent}`,
    `Business alignment: ${Math.round(context.businessGoalAlignment * 100)}%`,
  ];

  if (inputs.businessImpact?.leadGenerated) {
    primaryDrivers.push("Existing lead signal in session");
  }

  return {
    score,
    summary: `Expected organizational value uplift across ${recommendations.length} recommended experience adaptations.`,
    primaryDrivers,
  };
}

export function estimateCustomerImpact(
  recommendations: ExperienceRecommendation[],
  context: AnalyzedExperienceContext,
): ImpactSummary {
  if (recommendations.length === 0) {
    return {
      score: 0,
      summary: "Insufficient evidence to estimate customer impact.",
      primaryDrivers: [],
    };
  }

  const avgCustomer =
    recommendations.reduce((sum, r) => sum + r.customerValueScore, 0) /
    recommendations.length;

  const frictionPenalty =
    context.journeyFrictionLevel === "high"
      ? 0.15
      : context.journeyFrictionLevel === "medium"
        ? 0.07
        : 0;

  const score = clamp100((avgCustomer - frictionPenalty) * 100);

  return {
    score,
    summary: "Expected improvement in customer goal completion and engagement.",
    primaryDrivers: [
      `Customer maturity: ${context.customerMaturity}`,
      `Navigation pattern: ${context.navigationPattern}`,
      `Conversation health: ${context.conversationHealth}`,
    ],
  };
}

function clamp100(value: number): number {
  return Math.min(100, Math.max(0, Math.round(value)));
}
