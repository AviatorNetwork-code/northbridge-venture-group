import type { AEEInputBundle } from "../types/inputs.js";
import type {
  AdaptiveExperiencePlan,
  ExperienceRecommendation,
  ImpactSummary,
  RiskAssessment,
} from "../types/recommendations.js";
import type { PersonalizationScore } from "../types/integration.js";

export function buildAdaptiveExperiencePlan(params: {
  productId: string;
  recommendations: ExperienceRecommendation[];
  personalization: PersonalizationScore;
  expectedBusinessImpact: ImpactSummary;
  expectedCustomerImpact: ImpactSummary;
  riskAssessment: RiskAssessment;
  evidenceQuality: number;
  dependencies: string[];
}): AdaptiveExperiencePlan {
  const {
    productId,
    recommendations,
    personalization,
    expectedBusinessImpact,
    expectedCustomerImpact,
    riskAssessment,
    evidenceQuality,
    dependencies,
  } = params;

  const executiveSummary = buildExecutiveSummary(
    recommendations,
    personalization,
    expectedBusinessImpact,
    expectedCustomerImpact,
    riskAssessment,
  );

  return {
    schemaVersion: "1.0.0",
    productId,
    generatedAt: Date.now(),
    recommendations,
    personalizationConfidence: personalization.overall,
    expectedBusinessImpact,
    expectedCustomerImpact,
    executiveSummary,
    riskAssessment,
    evidenceQuality,
    dependencies,
    requiredFounderApproval: true,
  };
}

export function resolveDependencies(inputs: AEEInputBundle): string[] {
  const deps: string[] = [];

  if (!inputs.visitorIntent) deps.push("visitor_intent_intelligence");
  if (!inputs.customerExperience) deps.push("customer_experience_intelligence");
  if (!inputs.businessImpact) deps.push("business_impact_engine");
  if (!inputs.executivePriorities?.length) deps.push("executive_intelligence");
  if (!inputs.journeyIntelligence) deps.push("customer_journey_intelligence");

  return deps;
}

function buildExecutiveSummary(
  recommendations: ExperienceRecommendation[],
  personalization: PersonalizationScore,
  business: ImpactSummary,
  customer: ImpactSummary,
  risk: RiskAssessment,
): string {
  const top = recommendations[0];
  const topLine = top
    ? `Primary recommendation: ${top.title} — ${top.recommendation}`
    : "No high-confidence recommendations generated.";

  return [
    topLine,
    `Personalization confidence: ${Math.round(personalization.overall * 100)}%.`,
    `Expected business impact score: ${business.score}. Customer impact score: ${customer.score}.`,
    `Risk level: ${risk.overallRisk}. Founder approval required before any product changes.`,
  ].join(" ");
}
