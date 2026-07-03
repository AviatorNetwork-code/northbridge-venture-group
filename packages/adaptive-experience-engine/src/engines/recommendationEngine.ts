import type { AnalyzedExperienceContext, AEEInputBundle } from "../types/inputs.js";
import type {
  EvidenceItem,
  ExperienceRecommendation,
  RecommendationArea,
} from "../types/recommendations.js";
import type { AdaptiveExperienceAdapter } from "../types/adapter.js";

interface RecommendationRule {
  id: string;
  area: RecommendationArea;
  intentMatch: string[];
  maturity?: AnalyzedExperienceContext["customerMaturity"][];
  title: string;
  recommendation: string;
  reasonTemplate: string;
  experienceWeight: number;
  businessWeight: number;
  customerWeight: number;
  effort: ExperienceRecommendation["engineeringEffort"];
  baseConfidence: number;
}

const CORE_RULES: RecommendationRule[] = [
  {
    id: "ai-overview-before-services",
    area: "content_ordering",
    intentMatch: ["evaluate_ai_capabilities", "learn_about_ai", "ai"],
    title: "Prioritize AI product overview",
    recommendation: "Show AI product overview before consulting services.",
    reasonTemplate:
      "Highest predicted engagement based on visitor intent and previous journeys.",
    experienceWeight: 0.85,
    businessWeight: 0.7,
    customerWeight: 0.9,
    effort: "low",
    baseConfidence: 0.82,
  },
  {
    id: "logbook-before-marketplace",
    area: "feature_discovery",
    intentMatch: ["flight_training", "find_instructor", "commercial"],
    title: "Promote Logbook Scanner first",
    recommendation: "Promote Logbook Scanner before Marketplace.",
    reasonTemplate: "Improves activation probability for training-focused users.",
    experienceWeight: 0.88,
    businessWeight: 0.85,
    customerWeight: 0.87,
    effort: "medium",
    baseConfidence: 0.84,
  },
  {
    id: "resume-progression",
    area: "onboarding",
    intentMatch: ["returning", "progression", "resume"],
    maturity: ["returning", "engaged"],
    title: "Resume progression immediately",
    recommendation: "Resume progression immediately instead of tutorial.",
    reasonTemplate: "Higher retention probability for returning users.",
    experienceWeight: 0.9,
    businessWeight: 0.8,
    customerWeight: 0.92,
    effort: "low",
    baseConfidence: 0.86,
  },
  {
    id: "reduce-friction-navigation",
    area: "navigation",
    intentMatch: ["unknown_intent", "explore_products", "general_research"],
    title: "Simplify high-friction navigation path",
    recommendation: "Reorder navigation to surface the most relevant product area first.",
    reasonTemplate: "Journey friction detected; simplified paths improve completion.",
    experienceWeight: 0.75,
    businessWeight: 0.65,
    customerWeight: 0.8,
    effort: "medium",
    baseConfidence: 0.7,
  },
  {
    id: "cat-conversation-strategy",
    area: "conversation_strategy",
    intentMatch: ["compare_services", "become_customer", "request_software_development"],
    title: "Shorten CAT to next-best-action",
    recommendation: "Guide conversation toward a single next-best-action within two exchanges.",
    reasonTemplate: "Conversation health degraded; concise guidance improves conversion.",
    experienceWeight: 0.8,
    businessWeight: 0.75,
    customerWeight: 0.78,
    effort: "low",
    baseConfidence: 0.76,
  },
  {
    id: "cta-contact-placement",
    area: "cta_placement",
    intentMatch: ["become_customer", "become_partner", "request_software_development"],
    title: "Elevate contact CTA",
    recommendation: "Place primary contact CTA above secondary content on high-intent pages.",
    reasonTemplate: "High purchase/partnership intent with incomplete objective.",
    experienceWeight: 0.78,
    businessWeight: 0.88,
    customerWeight: 0.72,
    effort: "low",
    baseConfidence: 0.8,
  },
];

export function generateRecommendations(
  context: AnalyzedExperienceContext,
  inputs: AEEInputBundle,
  adapter: AdaptiveExperienceAdapter,
): ExperienceRecommendation[] {
  const intent = context.visitorIntent.toLowerCase();
  const recommendations: ExperienceRecommendation[] = [];

  for (const rule of CORE_RULES) {
    const intentMatched = rule.intentMatch.some((key) => intent.includes(key));
    const maturityMatched =
      !rule.maturity || rule.maturity.includes(context.customerMaturity);

    const returningMatch =
      rule.id === "resume-progression" &&
      context.repeatVisit &&
      (inputs.journeyIntelligence?.daysSinceLastVisit ?? 0) >= 7;

    if ((intentMatched || returningMatch) && maturityMatched) {
      recommendations.push(
        buildRecommendation(rule, context, inputs, adapter.productId),
      );
    }
  }

  const adapterTemplates = adapter.getRecommendationTemplates?.(context, inputs) ?? [];
  for (const [index, template] of adapterTemplates.entries()) {
    const evidence =
      template.evidence && template.evidence.length > 0
        ? template.evidence
        : buildEvidence(context, inputs, `adapter-${index}`);

    recommendations.push({
      id: `${adapter.productId}.adapter.${index}`,
      area: template.area ?? "next_best_action",
      title: template.title ?? "Product-specific recommendation",
      recommendation: template.recommendation ?? "",
      reason: template.reason ?? "Product adapter recommendation.",
      experienceScore: template.experienceScore ?? 0.75,
      businessImpactScore: template.businessImpactScore ?? 0.7,
      customerValueScore: template.customerValueScore ?? 0.8,
      engineeringEffort: template.engineeringEffort ?? "medium",
      confidence: template.confidence ?? 0.75,
      evidence,
      expectedRoi: template.expectedRoi ?? 1.2,
      opportunityCost: template.opportunityCost ?? "Deferred alternative experience path.",
      strategicAlignment: template.strategicAlignment ?? context.executiveAlignment,
      requiresFounderApproval: true,
    });
  }

  if (
    context.journeyFrictionLevel !== "low" &&
    !recommendations.some((r) => r.area === "navigation")
  ) {
    recommendations.push(
      buildRecommendation(
        CORE_RULES.find((r) => r.id === "reduce-friction-navigation")!,
        context,
        inputs,
        adapter.productId,
      ),
    );
  }

  if (
    context.conversationHealth === "degraded" &&
    !recommendations.some((r) => r.area === "conversation_strategy")
  ) {
    recommendations.push(
      buildRecommendation(
        CORE_RULES.find((r) => r.id === "cat-conversation-strategy")!,
        context,
        inputs,
        adapter.productId,
      ),
    );
  }

  return dedupeById(recommendations)
    .sort((a, b) => compositeScore(b) - compositeScore(a))
    .slice(0, 8);
}

function buildRecommendation(
  rule: RecommendationRule,
  context: AnalyzedExperienceContext,
  inputs: AEEInputBundle,
  productId: string,
): ExperienceRecommendation {
  const evidence = buildEvidence(context, inputs, rule.id);
  const confidence = adjustConfidence(rule.baseConfidence, evidence.length, context);

  return {
    id: `${productId}.${rule.id}`,
    area: rule.area,
    title: rule.title,
    recommendation: rule.recommendation,
    reason: rule.reasonTemplate,
    experienceScore: rule.experienceWeight,
    businessImpactScore: rule.businessWeight * context.businessGoalAlignment,
    customerValueScore: rule.customerWeight * context.customerGoalAlignment,
    engineeringEffort: rule.effort,
    confidence,
    evidence,
    expectedRoi: computeExpectedRoi(rule.businessWeight, rule.customerWeight, confidence),
    opportunityCost: "Alternative experience ordering or messaging path deferred.",
    strategicAlignment: context.executiveAlignment,
    requiresFounderApproval: true,
  };
}

function buildEvidence(
  context: AnalyzedExperienceContext,
  inputs: AEEInputBundle,
  ruleId: string,
): EvidenceItem[] {
  const evidence: EvidenceItem[] = [
    {
      source: "visitor_intent_intelligence",
      signal: context.visitorIntent,
      weight: inputs.visitorIntent?.confidence ?? 0.5,
    },
    {
      source: "experience_analysis",
      signal: `maturity:${context.customerMaturity}`,
      weight: 0.6,
    },
  ];

  if (inputs.customerExperience?.painPoints?.length) {
    evidence.push({
      source: "customer_experience_intelligence",
      signal: inputs.customerExperience.painPoints.join("; "),
      weight: 0.7,
    });
  }

  if (inputs.experimentOutcomes?.length) {
    const best = inputs.experimentOutcomes.sort(
      (a, b) => (b.uplift ?? 0) - (a.uplift ?? 0),
    )[0];
    if (best) {
      evidence.push({
        source: "experiment_outcome",
        signal: `${best.experimentId}:${best.variant}`,
        weight: best.confidence ?? 0.5,
      });
    }
  }

  if (ruleId === "resume-progression" && inputs.journeyIntelligence?.daysSinceLastVisit) {
    evidence.push({
      source: "journey_intelligence",
      signal: `days_since_visit:${inputs.journeyIntelligence.daysSinceLastVisit}`,
      weight: 0.85,
    });
  }

  return evidence;
}

function adjustConfidence(
  base: number,
  evidenceCount: number,
  context: AnalyzedExperienceContext,
): number {
  let confidence = base + evidenceCount * 0.02;
  if (context.journeyFrictionLevel === "high") confidence -= 0.05;
  if (context.conversationHealth === "healthy") confidence += 0.03;
  return Math.min(0.98, Math.max(0.4, confidence));
}

function computeExpectedRoi(
  businessWeight: number,
  customerWeight: number,
  confidence: number,
): number {
  return Number(((businessWeight + customerWeight) * confidence * 1.5).toFixed(2));
}

function compositeScore(rec: ExperienceRecommendation): number {
  return (
    rec.experienceScore * 0.35 +
    rec.businessImpactScore * 0.3 +
    rec.customerValueScore * 0.25 +
    rec.confidence * 0.1
  );
}

function dedupeById(recs: ExperienceRecommendation[]): ExperienceRecommendation[] {
  const seen = new Set<string>();
  return recs.filter((rec) => {
    if (seen.has(rec.id)) return false;
    seen.add(rec.id);
    return true;
  });
}
