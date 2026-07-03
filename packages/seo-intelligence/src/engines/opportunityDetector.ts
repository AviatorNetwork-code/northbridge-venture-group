import { classifySearchIntent } from "./searchIntentClassifier.js";
import type { SearchOpportunity } from "../types/opportunity.js";
import type { ContentFormatRecommendation } from "../types/opportunity.js";
import { recommendContentFormat } from "./contentRecommender.js";
import type { ProductMappingResult } from "../types/product.js";

const HIGH_VALUE_KEYWORDS = [
  "how to start a flight school",
  "best pilot logbook app",
  "faa medical guide",
  "cfi scheduling software",
  "flight school marketing",
  "pilot instructor marketplace",
  "aviation website design",
  "ai automation for small business",
  "quadrix education use",
];

export function detectOpportunity(
  keyword: string,
  product: ProductMappingResult,
): SearchOpportunity {
  const intent = classifySearchIntent(keyword);
  const format = recommendContentFormat(keyword, intent, product);

  const estimatedMonthlyDemand = HIGH_VALUE_KEYWORDS.includes(keyword.toLowerCase())
    ? "high"
    : /best |how to|software|app|guide/.test(keyword.toLowerCase())
      ? "medium"
      : "low";

  const competitionLevel = /best |top |software|app/.test(keyword.toLowerCase())
    ? "high"
    : "medium";

  return {
    opportunityId: `opp-${slug(keyword)}`,
    keyword,
    keywordCluster: [keyword],
    intent,
    estimatedMonthlyDemand,
    competitionLevel,
    unansweredQuestion: intent.primaryIntent === "informational" || intent.primaryIntent === "commercial",
    suggestedFormat: format,
    rationale: buildRationale(keyword, intent, product, format),
  };
}

function slug(text: string): string {
  return text.toLowerCase().replace(/\s+/g, "-").slice(0, 60);
}

function buildRationale(
  keyword: string,
  intent: ReturnType<typeof classifySearchIntent>,
  product: ProductMappingResult,
  format: ContentFormatRecommendation,
): string {
  const parts = [
    `Intent: ${intent.primaryIntent} (${intent.buyerIntentLevel} buyer intent).`,
    `Recommended format: ${format.replace(/_/g, " ")}.`,
  ];
  if (product.honestNoFit) {
    parts.push("No strong product fit — recommend educational content without forced product placement.");
  } else {
    parts.push(`Product alignment: ${product.recommendedProductName} (${Math.round(product.fitScore * 100)}% fit).`);
  }
  if (HIGH_VALUE_KEYWORDS.includes(keyword.toLowerCase())) {
    parts.push("Flagged as high-value seed opportunity.");
  }
  return parts.join(" ");
}

export function getSeedOpportunities(): string[] {
  return [...HIGH_VALUE_KEYWORDS];
}
