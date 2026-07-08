import type { AnalyzedExperienceContext, AEEInputBundle } from "../types/inputs.js";
import type { ExperienceRecommendation, RiskAssessment } from "../types/recommendations.js";

export function evaluateRisk(
  context: AnalyzedExperienceContext,
  recommendations: ExperienceRecommendation[],
  inputs: AEEInputBundle,
): RiskAssessment {
  const factors: RiskAssessment["factors"] = [];

  if (context.journeyFrictionLevel === "high") {
    factors.push({
      factor: "High journey friction may reduce recommendation effectiveness",
      severity: "medium",
      mitigation: "Validate recommendation with A/B experiment before rollout.",
    });
  }

  if ((inputs.visitorIntent?.confidence ?? 0) < 0.5) {
    factors.push({
      factor: "Low intent confidence increases personalization risk",
      severity: "high",
      mitigation: "Use conservative default experience until intent confidence rises.",
    });
  }

  const highEffort = recommendations.filter((r) => r.engineeringEffort === "high").length;
  if (highEffort >= 2) {
    factors.push({
      factor: "Multiple high-effort recommendations increase delivery risk",
      severity: "medium",
      mitigation: "Prioritize lowest-effort, highest-confidence recommendations first.",
    });
  }

  if (context.conversationHealth === "degraded") {
    factors.push({
      factor: "Degraded conversation health may amplify poor recommendations",
      severity: "medium",
      mitigation: "Pair experience changes with CAT conversation strategy updates.",
    });
  }

  const rejected = inputs.founderDecisionLearning?.rejectedRecommendationAreas ?? [];
  const conflicting = recommendations.filter((r) => rejected.includes(r.area));
  if (conflicting.length > 0) {
    factors.push({
      factor: "Recommendations overlap with previously rejected areas",
      severity: "high",
      mitigation: "Review Founder Decision Learning history before approval.",
    });
  }

  const overallRisk: RiskAssessment["overallRisk"] =
    factors.some((f) => f.severity === "high")
      ? "high"
      : factors.length >= 2
        ? "medium"
        : "low";

  return { overallRisk, factors };
}
