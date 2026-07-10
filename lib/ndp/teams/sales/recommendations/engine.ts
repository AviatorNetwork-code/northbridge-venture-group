export type SalesRecommendationCategory =
  | "pipeline_prioritization"
  | "lead_qualification"
  | "follow_up_cadence"
  | "deal_acceleration"
  | "crm_hygiene"
  | "proposal_improvement"
  | "reduce_activity"
  | "wait"
  | "strategy_change";

export interface SalesRecommendation {
  id: string;
  category: SalesRecommendationCategory;
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

export const CUSTOMER_SUCCESS_POLICY =
  "Recommendations prioritize customer success. Never driven by Northbridge revenue or subscription expansion.";

export function generateSalesRecommendations(
  input: RecommendationEngineInput,
): SalesRecommendation[] {
  const recommendations: SalesRecommendation[] = [];
  const evidenceText = input.evidence.join(" ").toLowerCase();
  const message = input.message.toLowerCase();

  if (evidenceText.includes("high-intent") || evidenceText.includes("qualification")) {
    recommendations.push({
      id: "rec-prioritize-leads",
      category: "pipeline_prioritization",
      summary: "Prioritize high-intent leads for immediate outreach before expanding prospecting volume.",
      evidence: input.evidence.filter((entry) =>
        entry.toLowerCase().includes("intent"),
      ),
      priority: "high",
      customerSuccessFirst: true,
    });
  }

  if (evidenceText.includes("follow-up") || evidenceText.includes("due")) {
    recommendations.push({
      id: "rec-follow-up-cadence",
      category: "follow_up_cadence",
      summary: "Improve follow-up cadence on warm prospects — consistency closes more than volume.",
      evidence: input.evidence.filter((entry) =>
        entry.toLowerCase().includes("follow"),
      ),
      priority: "high",
      customerSuccessFirst: true,
    });
  }

  if (evidenceText.includes("proposal") || message.includes("price") || message.includes("quote")) {
    recommendations.push({
      id: "rec-proposal-simplify",
      category: "proposal_improvement",
      summary: "Simplify proposal structure and clarify pricing options to reduce decision friction.",
      evidence: input.evidence.filter((entry) =>
        entry.toLowerCase().includes("proposal"),
      ),
      priority: "medium",
      customerSuccessFirst: true,
    });
  }

  if (evidenceText.includes("crm") || evidenceText.includes("record") || evidenceText.includes("missing")) {
    recommendations.push({
      id: "rec-crm-hygiene",
      category: "crm_hygiene",
      summary: "Update CRM records and next-action dates before adding new outreach activity.",
      evidence: input.evidence.filter((entry) =>
        entry.toLowerCase().includes("crm") || entry.toLowerCase().includes("record"),
      ),
      priority: "medium",
      customerSuccessFirst: true,
    });
  }

  if (evidenceText.includes("bottleneck") || evidenceText.includes("proposal stage")) {
    recommendations.push({
      id: "rec-deal-acceleration",
      category: "deal_acceleration",
      summary: "Focus on deals stalled in proposal stage with targeted follow-up and scope clarification.",
      evidence: input.evidence.filter((entry) =>
        entry.toLowerCase().includes("bottleneck") ||
        entry.toLowerCase().includes("proposal"),
      ),
      priority: "high",
      customerSuccessFirst: true,
    });
  }

  if (evidenceText.includes("low-fit") || evidenceText.includes("low fit")) {
    recommendations.push({
      id: "rec-pause-source",
      category: "reduce_activity",
      summary: "Pause low-quality lead sources and reallocate effort to higher-fit inquiries.",
      evidence: input.evidence.filter((entry) =>
        entry.toLowerCase().includes("low"),
      ),
      priority: "medium",
      customerSuccessFirst: true,
    });
  }

  if (
    message.includes("convert") ||
    message.includes("close") ||
    message.includes("customer")
  ) {
    recommendations.push({
      id: "rec-qualify-first",
      category: "lead_qualification",
      summary: "Qualify inbound interest before sending proposals — fit improves close rates.",
      evidence: input.evidence,
      priority: "high",
      customerSuccessFirst: true,
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      id: "rec-strategy-review",
      category: "strategy_change",
      summary:
        "Review pipeline stages and follow-up discipline before increasing sales activity.",
      evidence: [CUSTOMER_SUCCESS_POLICY],
      priority: "medium",
      customerSuccessFirst: true,
    });
  }

  return recommendations;
}
