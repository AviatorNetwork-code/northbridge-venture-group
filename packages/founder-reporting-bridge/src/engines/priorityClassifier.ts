import type { ReportPriority, ReportSourceInput, ReportType } from "../types/report.js";

const CRITICAL_PATTERNS = [
  /broken build/i,
  /failed deployment/i,
  /build failed/i,
  /deploy failed/i,
  /security concern/i,
  /governance concern/i,
  /ai cost spike/i,
  /blocked high-priority/i,
  /missing conversion path/i,
  /high-impact customer friction/i,
];

const HIGH_PATTERNS = [
  /pending decision/i,
  /qualified lead/i,
  /product fit detected/i,
  /escalation required/i,
  /critical ux/i,
  /seo opportunity/i,
];

export function classifyPriority(
  reportType: ReportType,
  sources: ReportSourceInput[],
  alertMessage?: string,
): ReportPriority {
  if (reportType === "weekly_northbridge_report") {
    const combined = [
      alertMessage ?? "",
      ...sources.flatMap((s) => [...(s.risks ?? []), ...s.highlights, s.summary]),
    ].join(" ");
    if (CRITICAL_PATTERNS.some((p) => p.test(combined))) return "critical";
    return "low";
  }

  const combined = [
    alertMessage ?? "",
    ...sources.flatMap((s) => [...(s.risks ?? []), ...s.highlights, s.summary]),
  ].join(" ");

  if (reportType === "critical_alert" || CRITICAL_PATTERNS.some((p) => p.test(combined))) {
    return "critical";
  }

  if (reportType === "pending_founder_decisions" ||
    HIGH_PATTERNS.some((p) => p.test(combined)) ||
    sources.some((s) => (s.pendingDecisions?.length ?? 0) > 0)
  ) {
    return "high";
  }

  return "normal";
}

export function deliveryCadence(priority: ReportPriority): string {
  switch (priority) {
    case "critical":
      return "send immediately";
    case "high":
      return "same-day report";
    case "normal":
      return "daily digest";
    case "low":
      return "weekly digest";
  }
}

export function shouldSendImmediately(priority: ReportPriority): boolean {
  return priority === "critical";
}
