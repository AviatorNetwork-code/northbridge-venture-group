import type { MarketingOperationalReport } from "@/lib/ndp/teams/marketing";
import type { SalesOperationalReport } from "@/lib/ndp/teams/sales";
import type { CustomerServiceOperationalReport } from "@/lib/ndp/teams/customer-service";
import type { FinancialOperationalReport } from "@/lib/ndp/teams/financial";
import {
  OPERATIONS_VIEW_REPORT_VERSION,
  type NormalizedTeamRecommendation,
  type NormalizedTeamReport,
  type TeamConfidenceSummary,
} from "./types.js";

type TeamRecommendationSource = {
  id: string;
  category: string;
  summary: string;
  evidence: string[];
  priority: "high" | "medium" | "low";
  customerSuccessFirst: true;
};

type OperationalReportSource =
  | MarketingOperationalReport
  | SalesOperationalReport
  | CustomerServiceOperationalReport
  | FinancialOperationalReport;

function averageConfidence(
  levels: Array<{ specialistId: string; level: string }>,
): TeamConfidenceSummary {
  if (levels.length === 0) {
    return { averageLevel: "unknown", specialistLevels: [] };
  }

  const weights: Record<string, number> = { high: 3, medium: 2, low: 1, unknown: 0 };
  const total = levels.reduce((sum, entry) => sum + (weights[entry.level] ?? 0), 0);
  const avg = total / levels.length;

  const averageLevel: TeamConfidenceSummary["averageLevel"] =
    avg >= 2.5 ? "high" : avg >= 1.5 ? "medium" : avg > 0 ? "low" : "unknown";

  return { averageLevel, specialistLevels: levels };
}

function normalizeRecommendations(
  teamId: string,
  recommendations: TeamRecommendationSource[],
  confidence: TeamConfidenceSummary,
): NormalizedTeamRecommendation[] {
  return recommendations.map((entry) => ({
    id: entry.id,
    sourceTeamId: teamId,
    category: entry.category,
    summary: entry.summary,
    evidence: entry.evidence,
    priority: entry.priority,
    customerSuccessFirst: entry.customerSuccessFirst,
    recommendationType: entry.category,
    expectedBenefit: entry.summary,
    risks: entry.priority === "high" ? ["Requires customer review when cross-team conflicts exist"] : [],
    requiredApproval:
      entry.category.includes("budget") ||
      entry.category.includes("expense") ||
      entry.category.includes("strategy") ||
      entry.priority === "high",
    confidence: confidence.averageLevel,
  }));
}

function extractPendingWork(report: OperationalReportSource): string[] {
  if ("pendingWork" in report && Array.isArray(report.pendingWork)) {
    return report.pendingWork;
  }
  if ("pendingFollowUps" in report && Array.isArray(report.pendingFollowUps)) {
    return report.pendingFollowUps;
  }
  if ("pendingReminders" in report && Array.isArray(report.pendingReminders)) {
    return report.pendingReminders;
  }
  if ("pendingPaymentFollowUps" in report && Array.isArray(report.pendingPaymentFollowUps)) {
    return report.pendingPaymentFollowUps;
  }
  return [];
}

function extractAlerts(report: OperationalReportSource): string[] {
  const alerts: string[] = [];
  if (report.escalations.length > 0) {
    alerts.push(...report.escalations.map((entry) => `Escalation: ${entry}`));
  }
  if (report.summary.toLowerCase().includes("bottleneck")) {
    alerts.push(report.summary);
  }
  if (report.summary.toLowerCase().includes("overdue")) {
    alerts.push(report.summary);
  }
  return alerts;
}

export function isKnownOperationalReport(value: unknown): value is OperationalReportSource {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.teamId === "string" &&
    typeof record.orgId === "string" &&
    typeof record.summary === "string" &&
    Array.isArray(record.recommendations)
  );
}

export function normalizeTeamOperationalReport(report: OperationalReportSource): NormalizedTeamReport {
  const confidence = averageConfidence(report.confidenceLevels ?? []);

  return {
    teamId: report.teamId,
    organizationId: report.orgId,
    teamLeadId: report.teamLeadId,
    reportId: report.id,
    reportVersion: OPERATIONS_VIEW_REPORT_VERSION,
    periodStart: report.periodStart,
    periodEnd: report.periodEnd,
    operationalSummary: report.summary,
    kpis: report.kpis ?? report.metrics ?? [],
    workCompleted: report.workCompleted ?? [],
    pendingWork: extractPendingWork(report),
    alerts: extractAlerts(report),
    escalations: report.escalations ?? [],
    recommendations: normalizeRecommendations(
      report.teamId,
      report.recommendations as TeamRecommendationSource[],
      confidence,
    ),
    confidence,
    organizationContextRef: report.organizationContextRef,
    organizationPublicName: report.organizationPublicName,
    operationsContextVersion: report.operationsContextVersion,
    generatedAt: report.generatedAt,
  };
}

export function normalizeTeamOperationalReports(
  reports: unknown[],
): NormalizedTeamReport[] {
  return reports.filter(isKnownOperationalReport).map(normalizeTeamOperationalReport);
}
