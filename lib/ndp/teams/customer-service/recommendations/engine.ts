export type CustomerServiceRecommendationCategory =
  | "inquiry_response"
  | "triage_prioritization"
  | "appointment_scheduling"
  | "reminder_cadence"
  | "satisfaction_improvement"
  | "complaint_resolution"
  | "service_recovery"
  | "reduce_activity"
  | "wait"
  | "strategy_change";

export interface CustomerServiceRecommendation {
  id: string;
  category: CustomerServiceRecommendationCategory;
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

export function generateCustomerServiceRecommendations(
  input: RecommendationEngineInput,
): CustomerServiceRecommendation[] {
  const recommendations: CustomerServiceRecommendation[] = [];
  const evidenceText = input.evidence.join(" ").toLowerCase();
  const message = input.message.toLowerCase();

  if (evidenceText.includes("open inquiry") || evidenceText.includes("response time")) {
    recommendations.push({
      id: "rec-response-time",
      category: "inquiry_response",
      summary:
        "Prioritize high-priority open inquiries to reduce first-response time before accepting new volume.",
      evidence: input.evidence.filter((entry) =>
        entry.toLowerCase().includes("inquiry") || entry.toLowerCase().includes("response"),
      ),
      priority: "high",
      customerSuccessFirst: true,
    });
  }

  if (evidenceText.includes("triage") || evidenceText.includes("routed")) {
    recommendations.push({
      id: "rec-triage",
      category: "triage_prioritization",
      summary: "Improve inbound triage so urgent requests reach the right specialist faster.",
      evidence: input.evidence.filter((entry) =>
        entry.toLowerCase().includes("routed") || entry.toLowerCase().includes("triage"),
      ),
      priority: "high",
      customerSuccessFirst: true,
    });
  }

  if (evidenceText.includes("appointment") || message.includes("schedule") || message.includes("book")) {
    recommendations.push({
      id: "rec-scheduling",
      category: "appointment_scheduling",
      summary: "Confirm pending appointment requests with available slots to reduce scheduling friction.",
      evidence: input.evidence.filter((entry) =>
        entry.toLowerCase().includes("appointment") || entry.toLowerCase().includes("slot"),
      ),
      priority: "high",
      customerSuccessFirst: true,
    });
  }

  if (evidenceText.includes("reminder") || evidenceText.includes("due")) {
    recommendations.push({
      id: "rec-reminders",
      category: "reminder_cadence",
      summary: "Send due reminders on preferred channels to reduce no-shows and missed follow-ups.",
      evidence: input.evidence.filter((entry) =>
        entry.toLowerCase().includes("reminder"),
      ),
      priority: "medium",
      customerSuccessFirst: true,
    });
  }

  if (evidenceText.includes("satisfaction") || evidenceText.includes("at-risk")) {
    recommendations.push({
      id: "rec-satisfaction",
      category: "satisfaction_improvement",
      summary: "Proactively reach out to at-risk accounts before satisfaction declines further.",
      evidence: input.evidence.filter((entry) =>
        entry.toLowerCase().includes("satisfaction") || entry.toLowerCase().includes("at-risk"),
      ),
      priority: "high",
      customerSuccessFirst: true,
    });
  }

  if (evidenceText.includes("complaint") || evidenceText.includes("escalat")) {
    recommendations.push({
      id: "rec-complaint",
      category: "complaint_resolution",
      summary: "Resolve escalated complaints with service recovery steps and supervisor follow-up when needed.",
      evidence: input.evidence.filter((entry) =>
        entry.toLowerCase().includes("complaint") || entry.toLowerCase().includes("escalat"),
      ),
      priority: "high",
      customerSuccessFirst: true,
    });
  }

  if (evidenceText.includes("recovery") || message.includes("unhappy")) {
    recommendations.push({
      id: "rec-recovery",
      category: "service_recovery",
      summary: "Apply service recovery: acknowledge, fix, confirm satisfaction, and document prevention steps.",
      evidence: input.evidence.filter((entry) =>
        entry.toLowerCase().includes("recovery") || entry.toLowerCase().includes("escalat"),
      ),
      priority: "high",
      customerSuccessFirst: true,
    });
  }

  if (
    message.includes("inquiry") ||
    message.includes("customer") ||
    message.includes("service")
  ) {
    recommendations.push({
      id: "rec-inquiry-first",
      category: "inquiry_response",
      summary: "Clear the open inquiry queue before expanding intake channels.",
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
        "Review response times, triage discipline, and reminder cadence before adding service volume.",
      evidence: [CUSTOMER_SUCCESS_POLICY],
      priority: "medium",
      customerSuccessFirst: true,
    });
  }

  return recommendations;
}
