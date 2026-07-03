import type { AEEInputBundle, AnalyzedExperienceContext } from "../types/inputs.js";

export function analyzeExperienceContext(
  inputs: AEEInputBundle,
): AnalyzedExperienceContext {
  const intent = inputs.visitorIntent?.primaryIntent ?? "unknown_intent";
  const frictionCount =
    (inputs.customerExperience?.frictionEvents?.length ?? 0) +
    (inputs.journeyIntelligence?.abandonedPages?.length ?? 0);

  const journeyFrictionLevel: AnalyzedExperienceContext["journeyFrictionLevel"] =
    frictionCount >= 3 ? "high" : frictionCount >= 1 ? "medium" : "low";

  const catScore = inputs.conversationAnalytics?.catGuidanceScore ?? 0.5;
  const conversationHealth: AnalyzedExperienceContext["conversationHealth"] =
    catScore >= 0.7 ? "healthy" : catScore >= 0.4 ? "neutral" : "degraded";

  const adoption = inputs.sessionAnalytics?.featureAdoption?.length ?? 0;
  const featureAdoptionLevel: AnalyzedExperienceContext["featureAdoptionLevel"] =
    adoption >= 3 ? "strong" : adoption >= 1 ? "partial" : "none";

  const repeatVisit =
    inputs.journeyIntelligence?.repeatVisit ??
    (inputs.journeyIntelligence?.daysSinceLastVisit ?? 0) > 0;

  let customerMaturity: AnalyzedExperienceContext["customerMaturity"] = "new";
  if (repeatVisit && adoption >= 2) customerMaturity = "engaged";
  else if (repeatVisit) customerMaturity = "returning";
  else if (journeyFrictionLevel === "high") customerMaturity = "at_risk";

  const pageViews = inputs.sessionAnalytics?.pageViews ?? inputs.telemetry?.length ?? 0;
  const completed = inputs.journeyIntelligence?.completedObjectives?.length ?? 0;
  const navigationPattern: AnalyzedExperienceContext["navigationPattern"] =
    completed > 0 ? "goal_directed" : pageViews >= 5 ? "stalled" : "exploratory";

  const businessGoalAlignment = clamp01(
    (inputs.businessImpact?.estimatedValueScore ?? 40) / 100,
  );

  const customerGoalAlignment = clamp01(
    (inputs.visitorIntent?.confidence ?? 0.5) *
      (conversationHealth === "healthy" ? 1 : 0.7),
  );

  const executiveAlignment = computeExecutiveAlignment(inputs);

  return {
    visitorIntent: intent,
    customerMaturity,
    journeyFrictionLevel,
    conversationHealth,
    featureAdoptionLevel,
    navigationPattern,
    repeatVisit,
    businessGoalAlignment,
    customerGoalAlignment,
    executiveAlignment,
  };
}

function computeExecutiveAlignment(inputs: AEEInputBundle): number {
  const priorities = inputs.executivePriorities ?? [];
  if (priorities.length === 0) return 0.5;

  const totalWeight = priorities.reduce((sum, p) => sum + p.weight, 0);
  return clamp01(totalWeight / Math.max(priorities.length, 1));
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}
