import type { NormalizedTeamReport } from "@/lib/ndp/operations-view";
import type { AggregatedAlert, PresentedRecommendation } from "./types.js";

export function presentRecommendations(
  reports: NormalizedTeamReport[],
): PresentedRecommendation[] {
  return reports.flatMap((report) =>
    report.recommendations.map((entry) => ({
      id: entry.id,
      recommendation: entry.summary,
      sourceTeamId: entry.sourceTeamId,
      confidence: entry.confidence,
      approvalRequired: entry.requiredApproval,
      evidenceAvailable: entry.evidence.length > 0,
      category: entry.category,
      priority: entry.priority,
      customerSuccessFirst: entry.customerSuccessFirst,
    })),
  );
}

export function aggregateAlerts(
  reports: NormalizedTeamReport[],
  generatedAt: string,
): AggregatedAlert[] {
  const alerts: AggregatedAlert[] = [];

  for (const report of reports) {
    for (const [index, message] of report.alerts.entries()) {
      alerts.push({
        id: `${report.teamId}-alert-${index + 1}`,
        severity: inferAlertSeverity(message, report.escalations.length > 0),
        sourceTeamId: report.teamId,
        category: categorizeAlert(message),
        message,
        timestamp: report.generatedAt ?? generatedAt,
      });
    }

    for (const [index, escalation] of report.escalations.entries()) {
      alerts.push({
        id: `${report.teamId}-escalation-${index + 1}`,
        severity: "critical",
        sourceTeamId: report.teamId,
        category: "escalation",
        message: escalation,
        timestamp: report.generatedAt ?? generatedAt,
      });
    }
  }

  return alerts;
}

function inferAlertSeverity(
  message: string,
  hasEscalations: boolean,
): AggregatedAlert["severity"] {
  const normalized = message.toLowerCase();
  if (hasEscalations || normalized.includes("critical") || normalized.includes("overdue")) {
    return "critical";
  }
  if (normalized.includes("warning") || normalized.includes("bottleneck") || normalized.includes("delayed")) {
    return "warning";
  }
  return "info";
}

function categorizeAlert(message: string): string {
  const normalized = message.toLowerCase();
  if (normalized.includes("escalat")) return "escalation";
  if (normalized.includes("follow-up") || normalized.includes("follow up")) return "follow_up";
  if (normalized.includes("invoice") || normalized.includes("billing")) return "billing";
  if (normalized.includes("inquir") || normalized.includes("customer")) return "customer_service";
  if (normalized.includes("campaign") || normalized.includes("lead")) return "marketing";
  if (normalized.includes("pipeline") || normalized.includes("sales")) return "sales";
  return "operational";
}
