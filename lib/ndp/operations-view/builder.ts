import { normalizeTeamOperationalReports } from "./adapters.js";
import { buildOperationsDashboardModel, resolveTeamDisplayName } from "./dashboard.js";
import { buildManagerRecommendationEvidence } from "./manager-evidence.js";
import {
  detectCrossTeamDependencies,
  detectCrossTeamOpportunities,
  detectCrossTeamSignals,
  detectRecommendationConflicts,
  mapSignalsToIncompatibleActions,
} from "./signals.js";
import type {
  BuildMultiTeamOperationsViewInput,
  MultiTeamOperationsView,
  NormalizedTeamRecommendation,
  NormalizedTeamReport,
  OperationsSnapshot,
  OperationalTrend,
  PendingApprovalItem,
  TeamHealthSummary,
} from "./types.js";

export const OPERATIONS_VIEW_VERSION = "1.0.0";
export const DEFAULT_STALE_REPORT_THRESHOLD_MS = 24 * 60 * 60 * 1000;

function filterHiredReports(
  reports: NormalizedTeamReport[],
  hiredTeamIds: string[],
): NormalizedTeamReport[] {
  const hired = new Set(hiredTeamIds);
  return reports.filter((entry) => hired.has(entry.teamId));
}

function resolveReportFreshness(
  generatedAt: string | undefined,
  nowMs: number,
  staleThresholdMs: number,
): "fresh" | "stale" | "missing" {
  if (!generatedAt) return "missing";
  const age = nowMs - Date.parse(generatedAt);
  if (Number.isNaN(age)) return "missing";
  return age > staleThresholdMs ? "stale" : "fresh";
}

function buildTeamHealthSummaries(
  reports: NormalizedTeamReport[],
  hiredTeamIds: string[],
  teamNames: Record<string, string> | undefined,
  nowMs: number,
  staleThresholdMs: number,
): TeamHealthSummary[] {
  const reportByTeam = new Map(reports.map((entry) => [entry.teamId, entry]));

  return hiredTeamIds.map((teamId) => {
    const report = reportByTeam.get(teamId);
    if (!report) {
      return {
        teamId,
        teamName: resolveTeamDisplayName(teamId, teamNames),
        status: "unknown",
        summary: "No team report available.",
        pendingCount: 0,
        escalationCount: 0,
        alertCount: 0,
        reportFreshness: "missing",
      };
    }

    const freshness = resolveReportFreshness(report.generatedAt, nowMs, staleThresholdMs);
    const escalationCount = report.escalations.length;
    const pendingCount = report.pendingWork.length;
    const alertCount = report.alerts.length;

    const status: TeamHealthSummary["status"] =
      escalationCount > 0 || alertCount > 2
        ? "critical"
        : pendingCount > 2 || freshness === "stale"
          ? "warning"
          : "healthy";

    return {
      teamId,
      teamName: resolveTeamDisplayName(teamId, teamNames),
      status,
      summary: report.operationalSummary,
      pendingCount,
      escalationCount,
      alertCount,
      reportFreshness: freshness,
    };
  });
}

function aggregateRecommendations(
  reports: NormalizedTeamReport[],
): NormalizedTeamRecommendation[] {
  return reports.flatMap((report) => report.recommendations);
}

function buildPendingApprovals(reports: NormalizedTeamReport[]): PendingApprovalItem[] {
  const items: PendingApprovalItem[] = [];

  for (const report of reports) {
    for (const pending of report.pendingWork) {
      items.push({
        id: `${report.teamId}-pending-${items.length + 1}`,
        sourceTeamId: report.teamId,
        label: pending,
        priority: "medium",
      });
    }

    for (const recommendation of report.recommendations.filter((entry) => entry.requiredApproval)) {
      items.push({
        id: `${report.teamId}-approval-${recommendation.id}`,
        sourceTeamId: report.teamId,
        label: recommendation.summary,
        priority: recommendation.priority,
      });
    }
  }

  return items;
}

function buildOperationalTrends(reports: NormalizedTeamReport[]): OperationalTrend[] {
  const trends: OperationalTrend[] = [];

  for (const report of reports) {
    const summary = report.operationalSummary.toLowerCase();
    if (summary.includes("up") || summary.includes("improving") || summary.includes("trending up")) {
      trends.push({
        id: `trend-up-${report.teamId}`,
        label: `${report.teamId} activity trending up`,
        direction: "up",
        involvedTeamIds: [report.teamId],
        evidence: [report.operationalSummary],
      });
    }
    if (summary.includes("overdue") || summary.includes("delayed") || summary.includes("bottleneck")) {
      trends.push({
        id: `trend-pressure-${report.teamId}`,
        label: `${report.teamId} reporting operational pressure`,
        direction: "down",
        involvedTeamIds: [report.teamId],
        evidence: [report.operationalSummary],
      });
    }
  }

  return trends;
}

function buildOperationsSnapshot(input: {
  organizationId: string;
  hiredTeamIds: string[];
  reports: NormalizedTeamReport[];
  teamNames?: Record<string, string>;
  now: string;
  nowMs: number;
  staleThresholdMs: number;
  crossTeamDependencies: ReturnType<typeof detectCrossTeamDependencies>;
  conflictingRecommendations: ReturnType<typeof detectRecommendationConflicts>;
  crossTeamOpportunities: ReturnType<typeof detectCrossTeamOpportunities>;
}): OperationsSnapshot {
  const teamHealthSummaries = buildTeamHealthSummaries(
    input.reports,
    input.hiredTeamIds,
    input.teamNames,
    input.nowMs,
    input.staleThresholdMs,
  );

  return {
    organizationId: input.organizationId,
    activeTeamIds: input.hiredTeamIds,
    teamHealthSummaries,
    teamKpis: input.reports.map((report) => ({ teamId: report.teamId, kpis: report.kpis })),
    pendingApprovals: buildPendingApprovals(input.reports),
    openEscalations: input.reports.flatMap((report) =>
      report.escalations.map((label) => ({ teamId: report.teamId, label })),
    ),
    businessWideAlerts: input.reports.flatMap((report) => report.alerts),
    crossTeamDependencies: input.crossTeamDependencies,
    conflictingRecommendations: input.conflictingRecommendations,
    crossTeamOpportunities: input.crossTeamOpportunities,
    operationalTrends: buildOperationalTrends(input.reports),
    reportFreshness: input.hiredTeamIds.map((teamId) => {
      const report = input.reports.find((entry) => entry.teamId === teamId);
      return {
        teamId,
        generatedAt: report?.generatedAt,
        status: resolveReportFreshness(report?.generatedAt, input.nowMs, input.staleThresholdMs),
      };
    }),
    generatedAt: input.now,
  };
}

export function buildMultiTeamOperationsView(
  input: BuildMultiTeamOperationsViewInput,
): MultiTeamOperationsView {
  const now = input.now ?? new Date().toISOString();
  const nowMs = Date.parse(now);
  const staleThresholdMs = input.staleReportThresholdMs ?? DEFAULT_STALE_REPORT_THRESHOLD_MS;

  const normalizedReports = filterHiredReports(
    normalizeTeamOperationalReports(input.teamReports),
    input.hiredTeamIds,
  );

  const crossTeamDependencies = detectCrossTeamDependencies(normalizedReports);
  const conflictingRecommendations = detectRecommendationConflicts(normalizedReports);
  const baseSignals = detectCrossTeamSignals(normalizedReports);
  const crossTeamSignals = [
    ...baseSignals,
    ...mapSignalsToIncompatibleActions(baseSignals),
  ].filter(
    (signal, index, all) => all.findIndex((entry) => entry.id === signal.id) === index,
  );
  const crossTeamOpportunities = detectCrossTeamOpportunities(normalizedReports);
  const aggregatedRecommendations = aggregateRecommendations(normalizedReports);

  const snapshot = buildOperationsSnapshot({
    organizationId: input.organizationId,
    hiredTeamIds: input.hiredTeamIds,
    reports: normalizedReports,
    teamNames: input.teamNames,
    now,
    nowMs,
    staleThresholdMs,
    crossTeamDependencies,
    conflictingRecommendations,
    crossTeamOpportunities,
  });

  const managerEvidence = buildManagerRecommendationEvidence({
    hiredTeamIds: input.hiredTeamIds,
    reports: normalizedReports,
    conflicts: conflictingRecommendations,
    dependencies: crossTeamDependencies,
    observationHistory: input.observationHistory,
    minimumEvidenceThreshold: input.managerEvidenceThreshold,
  });

  const dashboard = buildOperationsDashboardModel({
    organizationId: input.organizationId,
    hiredTeamIds: input.hiredTeamIds,
    snapshot,
    reports: normalizedReports,
    aggregatedRecommendations,
    crossTeamSignals,
    conflicts: conflictingRecommendations,
    now,
  });

  return {
    organizationId: input.organizationId,
    hiredTeamIds: input.hiredTeamIds,
    viewVersion: OPERATIONS_VIEW_VERSION,
    teamReports: normalizedReports,
    snapshot,
    aggregatedRecommendations,
    crossTeamSignals,
    managerEvidence,
    dashboard,
    generatedAt: now,
  };
}
