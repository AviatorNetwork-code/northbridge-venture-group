import type { SearchIntentClassification } from "../types/intent.js";
import type { ContentAuditResult } from "../types/opportunity.js";
import type { ProductMappingResult } from "../types/product.js";
import type { SEOBusinessScore, BusinessImpactFactors } from "../types/scoring.js";

function demandScore(keyword: string): number {
  const highDemand = [/flight school|logbook|cfi|scheduling|how to start|best .* app/i];
  const mediumDemand = [/guide|software|platform|automation|website|tax/i];
  if (highDemand.some((p) => p.test(keyword))) return 0.85;
  if (mediumDemand.some((p) => p.test(keyword))) return 0.6;
  return 0.35;
}

function clamp(n: number): number {
  return Math.min(100, Math.max(0, Math.round(n)));
}

export function scoreBusinessImpact(
  keyword: string,
  intent: SearchIntentClassification,
  audit: ContentAuditResult,
  product: ProductMappingResult,
): SEOBusinessScore {
  const searchDemand = demandScore(keyword) * 100;
  const buyerIntent =
    intent.buyerIntentLevel === "high" ? 85 : intent.buyerIntentLevel === "medium" ? 60 : 35;
  const revenuePotential = product.honestNoFit
    ? 20
    : product.fitScore * 100 * (intent.buyerIntentLevel === "high" ? 1 : 0.75);
  const customerValue = product.honestNoFit ? 30 : product.fitScore * 90;
  const strategicAlignment = product.honestNoFit ? 25 : product.fitScore * 95;
  const competition =
    /best |top |software|app|platform/.test(keyword.toLowerCase()) ? 70 : 45;
  const maintenanceCost = intent.primaryIntent === "informational" ? 55 : 40;

  const factors: BusinessImpactFactors = {
    searchDemand,
    buyerIntent,
    revenuePotential,
    customerValue,
    strategicAlignment,
    competition: 100 - competition,
    maintenanceCost: 100 - maintenanceCost,
  };

  const auditPenalty =
    audit.recommendation === "skip_duplicate"
      ? 40
      : audit.recommendation === "improve_existing"
        ? 10
        : 0;

  const overall = clamp(
    searchDemand * 0.2 +
      buyerIntent * 0.15 +
      revenuePotential * 0.2 +
      customerValue * 0.15 +
      strategicAlignment * 0.15 +
      factors.competition * 0.1 +
      factors.maintenanceCost * 0.05 -
      auditPenalty,
  );

  const trafficValueEstimate =
    searchDemand >= 70 ? "high" : searchDemand >= 45 ? "medium" : "low";
  const conversionImpactEstimate =
    buyerIntent >= 70 && !product.honestNoFit
      ? "high"
      : buyerIntent >= 45
        ? "medium"
        : "low";
  const contentComplexity =
    intent.primaryIntent === "comparison" || intent.primaryIntent === "commercial"
      ? "high"
      : intent.primaryIntent === "informational"
        ? "medium"
        : "low";

  return {
    overall,
    factors,
    trafficValueEstimate,
    conversionImpactEstimate,
    contentComplexity,
  };
}
