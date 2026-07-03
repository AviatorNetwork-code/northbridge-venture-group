import type { SEOContentRecommendation, SEOExecutiveReport } from "../types/report.js";
import type { SearchOpportunity } from "../types/opportunity.js";
import type { ProductMappingResult } from "../types/product.js";
import type { SEOBusinessScore } from "../types/scoring.js";
import type { ContentAuditResult } from "../types/opportunity.js";

export function buildContentRecommendation(
  opportunity: SearchOpportunity,
  audit: ContentAuditResult,
  product: ProductMappingResult,
  businessScore: SEOBusinessScore,
  draft: import("../types/draft.js").ContentDraft | undefined,
): SEOContentRecommendation {
  const opportunityScore = businessScore.overall;

  return {
    recommendationId: `rec-${opportunity.opportunityId}`,
    opportunity,
    audit,
    productMapping: product,
    businessScore,
    contentFormat: opportunity.suggestedFormat,
    draft,
    opportunityScore,
    estimatedBusinessImpact: describeBusinessImpact(businessScore),
    estimatedTrafficValue: `${businessScore.trafficValueEstimate} — driven by search demand and competition`,
    expectedConversionImpact: `${businessScore.conversionImpactEstimate} — based on buyer intent and product fit`,
    recommendedProduct: product.honestNoFit ? "None (honest no-fit)" : product.recommendedProductName,
    whyNow: buildWhyNow(opportunity, audit, businessScore),
    opportunityCostIfDelayed: buildOpportunityCost(opportunity, businessScore),
    requiresFounderApproval: true,
  };
}

export function generateExecutiveReport(
  analysisId: string,
  productScope: string,
  recommendations: SEOContentRecommendation[],
  skippedDuplicates: string[],
  skippedLowValue: string[],
): SEOExecutiveReport {
  const sorted = [...recommendations].sort(
    (a, b) => b.opportunityScore - a.opportunityScore,
  );

  const top = sorted[0];
  const executiveSummary = [
    `SEO Intelligence analysis for ${productScope}: ${sorted.length} content recommendation(s) with measurable business justification.`,
    skippedDuplicates.length > 0
      ? `${skippedDuplicates.length} keyword(s) skipped to avoid duplicate content.`
      : "",
    skippedLowValue.length > 0
      ? `${skippedLowValue.length} keyword(s) skipped due to low business value.`
      : "",
    top
      ? `Highest-value opportunity: "${top.opportunity.keyword}" (score ${top.opportunityScore}/100).`
      : "No new page recommendations met the business value threshold.",
    "All recommendations are read-only and require Founder approval before content creation or publishing.",
  ]
    .filter(Boolean)
    .join(" ");

  return {
    reportId: `sie-${analysisId}`,
    generatedAt: Date.now(),
    productScope,
    executiveSummary,
    recommendations: sorted,
    skippedDuplicates,
    skippedLowValue,
    governance: {
      readOnly: true,
      requiresFounderApproval: true,
    },
  };
}

function describeBusinessImpact(score: SEOBusinessScore): string {
  if (score.overall >= 70) return "High — strong search demand, intent, and product alignment";
  if (score.overall >= 50) return "Moderate — worthwhile with clear positioning and maintenance plan";
  return "Low — limited strategic justification for new content";
}

function buildWhyNow(
  opportunity: SearchOpportunity,
  audit: ContentAuditResult,
  score: SEOBusinessScore,
): string {
  if (audit.recommendation === "improve_existing") {
    return "Existing page underperforms — improving may capture demand faster than creating duplicate content.";
  }
  if (opportunity.estimatedMonthlyDemand === "high") {
    return "High-demand topic with clear customer questions — early authoritative content builds compound traffic value.";
  }
  if (score.conversionImpactEstimate === "high") {
    return "Commercial/transactional intent makes timely content valuable for qualified lead capture.";
  }
  return "Topic fills a content gap with acceptable maintenance cost and strategic alignment.";
}

function buildOpportunityCost(
  opportunity: SearchOpportunity,
  score: SEOBusinessScore,
): string {
  if (score.overall >= 70) {
    return `Delaying "${opportunity.keyword}" may forfeit high-intent traffic and allow competitors to own the topic.`;
  }
  if (opportunity.competitionLevel === "high") {
    return "Competitive keyword — delay increases difficulty of ranking without differentiated content.";
  }
  return "Moderate opportunity cost — lower urgency but content gap remains for customer self-education.";
}
