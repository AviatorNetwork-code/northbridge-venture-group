export type MarketingRecommendationCategory =
  | "budget_reallocation"
  | "campaign_optimization"
  | "content_opportunity"
  | "posting_frequency"
  | "seasonal_campaign"
  | "audience_refinement"
  | "reduce_activity"
  | "wait"
  | "strategy_change";

export interface MarketingRecommendation {
  id: string;
  category: MarketingRecommendationCategory;
  summary: string;
  evidence: string[];
  priority: "high" | "medium" | "low";
  customerSuccessFirst: true;
}

export interface RecommendationEngineInput {
  evidence: string[];
  message: string;
  metrics?: Record<string, number>;
}

const CUSTOMER_SUCCESS_POLICY =
  "Recommendations prioritize customer success. Never driven by revenue or subscription expansion.";

/**
 * Generates evidence-based marketing recommendations.
 * Customer success always takes precedence over spend increases.
 */
export function generateMarketingRecommendations(
  input: RecommendationEngineInput,
): MarketingRecommendation[] {
  const recommendations: MarketingRecommendation[] = [];
  const evidenceText = input.evidence.join(" ").toLowerCase();
  const message = input.message.toLowerCase();

  if (
    evidenceText.includes("underperform") ||
    evidenceText.includes("below target") ||
    evidenceText.includes("roi below")
  ) {
    recommendations.push({
      id: "rec-budget-reallocate",
      category: "budget_reallocation",
      summary:
        "Shift budget from underperforming channels toward proven performers rather than increasing total spend.",
      evidence: input.evidence.filter(
        (entry) =>
          entry.toLowerCase().includes("roi") ||
          entry.toLowerCase().includes("underperform"),
      ),
      priority: "high",
      customerSuccessFirst: true,
    });
  }

  if (evidenceText.includes("engagement") || evidenceText.includes("ctr")) {
    recommendations.push({
      id: "rec-campaign-optimize",
      category: "campaign_optimization",
      summary:
        "Optimize top-performing campaigns with refined messaging and audience segments before launching new spend.",
      evidence: input.evidence.filter(
        (entry) =>
          entry.toLowerCase().includes("ctr") ||
          entry.toLowerCase().includes("engagement"),
      ),
      priority: "medium",
      customerSuccessFirst: true,
    });
  }

  if (evidenceText.includes("content") || evidenceText.includes("post")) {
    recommendations.push({
      id: "rec-content-opportunity",
      category: "content_opportunity",
      summary:
        "Expand educational and social-proof content on channels showing rising engagement.",
      evidence: input.evidence.filter((entry) =>
        entry.toLowerCase().includes("content"),
      ),
      priority: "medium",
      customerSuccessFirst: true,
    });
  }

  if (evidenceText.includes("cadence") || evidenceText.includes("scheduled")) {
    recommendations.push({
      id: "rec-posting-frequency",
      category: "posting_frequency",
      summary:
        "Maintain consistent posting cadence — consistency outperforms sporadic volume spikes.",
      evidence: input.evidence,
      priority: "low",
      customerSuccessFirst: true,
    });
  }

  if (evidenceText.includes("seasonal")) {
    recommendations.push({
      id: "rec-seasonal",
      category: "seasonal_campaign",
      summary:
        "Plan a seasonal campaign aligned to upcoming demand patterns identified in the calendar.",
      evidence: input.evidence.filter((entry) =>
        entry.toLowerCase().includes("seasonal"),
      ),
      priority: "medium",
      customerSuccessFirst: true,
    });
  }

  if (
    message.includes("customer") ||
    message.includes("lead") ||
    evidenceText.includes("audience")
  ) {
    recommendations.push({
      id: "rec-audience",
      category: "audience_refinement",
      summary:
        "Refine audience targeting based on existing customer patterns and geographic fit.",
      evidence: input.evidence.filter((entry) =>
        entry.toLowerCase().includes("audience"),
      ),
      priority: "high",
      customerSuccessFirst: true,
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      id: "rec-strategy-review",
      category: "strategy_change",
      summary:
        "Review current marketing mix and validate channel-audience fit before increasing activity.",
      evidence: [CUSTOMER_SUCCESS_POLICY],
      priority: "medium",
      customerSuccessFirst: true,
    });
  }

  return recommendations;
}

export { CUSTOMER_SUCCESS_POLICY };
