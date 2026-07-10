export type FinancialRecommendationCategory =
  | "revenue_review"
  | "billing_improvement"
  | "receivables_collection"
  | "cash_flow_management"
  | "payment_followup"
  | "expense_control"
  | "reporting_clarity"
  | "reduce_activity"
  | "wait"
  | "strategy_change";

export interface FinancialRecommendation {
  id: string;
  category: FinancialRecommendationCategory;
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

export function generateFinancialRecommendations(
  input: RecommendationEngineInput,
): FinancialRecommendation[] {
  const recommendations: FinancialRecommendation[] = [];
  const evidenceText = input.evidence.join(" ").toLowerCase();
  const message = input.message.toLowerCase();

  if (evidenceText.includes("revenue") || evidenceText.includes("margin")) {
    recommendations.push({
      id: "rec-revenue-review",
      category: "revenue_review",
      summary: "Review revenue trends and margin stability before increasing operating spend.",
      evidence: input.evidence.filter((entry) =>
        entry.toLowerCase().includes("revenue") || entry.toLowerCase().includes("margin"),
      ),
      priority: "high",
      customerSuccessFirst: true,
    });
  }

  if (evidenceText.includes("invoice") || evidenceText.includes("billing")) {
    recommendations.push({
      id: "rec-billing",
      category: "billing_improvement",
      summary: "Clear pending invoices and verify billing accuracy to reduce payment delays.",
      evidence: input.evidence.filter((entry) =>
        entry.toLowerCase().includes("invoice") || entry.toLowerCase().includes("billing"),
      ),
      priority: "high",
      customerSuccessFirst: true,
    });
  }

  if (evidenceText.includes("receivable") || evidenceText.includes("outstanding") || evidenceText.includes("overdue")) {
    recommendations.push({
      id: "rec-receivables",
      category: "receivables_collection",
      summary: "Prioritize overdue receivables follow-up to improve cash collection without damaging relationships.",
      evidence: input.evidence.filter((entry) =>
        entry.toLowerCase().includes("receivable") ||
        entry.toLowerCase().includes("outstanding") ||
        entry.toLowerCase().includes("overdue"),
      ),
      priority: "high",
      customerSuccessFirst: true,
    });
  }

  if (evidenceText.includes("cash flow") || evidenceText.includes("operating trend")) {
    recommendations.push({
      id: "rec-cash-flow",
      category: "cash_flow_management",
      summary: "Monitor cash flow signals and align expenses with collection timing.",
      evidence: input.evidence.filter((entry) =>
        entry.toLowerCase().includes("cash"),
      ),
      priority: "medium",
      customerSuccessFirst: true,
    });
  }

  if (evidenceText.includes("follow-up") || evidenceText.includes("past 60")) {
    recommendations.push({
      id: "rec-payment-followup",
      category: "payment_followup",
      summary: "Execute payment follow-up on overdue accounts with professional escalation where needed.",
      evidence: input.evidence.filter((entry) =>
        entry.toLowerCase().includes("follow"),
      ),
      priority: "high",
      customerSuccessFirst: true,
    });
  }

  if (evidenceText.includes("expense") || message.includes("expense")) {
    recommendations.push({
      id: "rec-expense",
      category: "expense_control",
      summary: "Review flagged expense categories before pursuing additional revenue initiatives.",
      evidence: input.evidence.filter((entry) =>
        entry.toLowerCase().includes("expense"),
      ),
      priority: "medium",
      customerSuccessFirst: true,
    });
  }

  if (evidenceText.includes("report") || evidenceText.includes("p&l")) {
    recommendations.push({
      id: "rec-reporting",
      category: "reporting_clarity",
      summary: "Use current financial reports to identify variances requiring owner attention this week.",
      evidence: input.evidence.filter((entry) =>
        entry.toLowerCase().includes("report") || entry.toLowerCase().includes("p&l"),
      ),
      priority: "medium",
      customerSuccessFirst: true,
    });
  }

  if (
    message.includes("financ") ||
    message.includes("cash") ||
    message.includes("invoice")
  ) {
    recommendations.push({
      id: "rec-financial-discipline",
      category: "cash_flow_management",
      summary: "Strengthen billing and receivables discipline before expanding financial commitments.",
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
        "Review revenue, receivables, and expense trends before making major financial decisions.",
      evidence: [CUSTOMER_SUCCESS_POLICY],
      priority: "medium",
      customerSuccessFirst: true,
    });
  }

  return recommendations;
}
