import type { OrganizationIntelligenceContext } from "@northbridge/operations-intelligence";
import { resolveOrganizationContextRef } from "@/lib/ndp/operations-context";
import {
  buildMultiTeamOperationsView,
  type MultiTeamOperationsView,
} from "@/lib/ndp/operations-view";
import { aggregateAlerts, presentRecommendations } from "./alerts.js";
import {
  buildAlwaysAvailableSections,
  buildCrossTeamSection,
  buildFuturePlaceholderSections,
  buildTeamSection,
  resolveTeamSection,
  TEAM_SECTION_TITLES,
} from "./sections.js";
import type {
  BuildDashboardModelInput,
  ConfidenceSummary,
  DashboardMetadata,
  DashboardModel,
  DashboardSection,
  DashboardSectionId,
  ReportFreshnessEntry,
} from "./types.js";
import { DASHBOARD_MODEL_VERSION } from "./types.js";

const ALL_POSSIBLE_TEAM_SECTIONS: DashboardSectionId[] = [
  "marketing",
  "sales",
  "customer_service",
  "financial",
];

function buildConfidenceSummary(
  operationsView: MultiTeamOperationsView,
): ConfidenceSummary {
  const byTeam = operationsView.teamReports.map((report) => ({
    teamId: report.teamId,
    level: report.confidence.averageLevel,
  }));

  const weights = { high: 3, medium: 2, low: 1, unknown: 0 };
  const total = byTeam.reduce((sum, entry) => sum + weights[entry.level], 0);
  const avg = byTeam.length > 0 ? total / byTeam.length : 0;
  const organizationLevel: ConfidenceSummary["organizationLevel"] =
    avg >= 2.5 ? "high" : avg >= 1.5 ? "medium" : avg > 0 ? "low" : "unknown";

  return { organizationLevel, byTeam };
}

function buildMetadata(input: {
  organizationId: string;
  activeTeamIds: string[];
  operationsView: MultiTeamOperationsView;
  operationsIntelligence?: OrganizationIntelligenceContext;
  sections: DashboardSection[];
  now: string;
}): DashboardMetadata {
  const activeSections = input.sections
    .filter((section) => section.available && !section.placeholder)
    .map((section) => section.id);

  const missingSections = ALL_POSSIBLE_TEAM_SECTIONS.filter(
    (sectionId) => !activeSections.includes(sectionId),
  );

  const reportFreshness: ReportFreshnessEntry[] =
    input.operationsView.snapshot.reportFreshness;

  return {
    organizationId: input.organizationId,
    dashboardVersion: DASHBOARD_MODEL_VERSION,
    generatedAt: input.now,
    availableTeams: input.activeTeamIds,
    activeSections,
    missingSections,
    reportFreshness,
    confidenceSummary: buildConfidenceSummary(input.operationsView),
    organizationPublicName: input.operationsIntelligence?.profile.publicName,
    operationsContextRef: input.operationsIntelligence
      ? resolveOrganizationContextRef({
          organizationId: input.operationsIntelligence.organizationId,
          contextVersion: input.operationsIntelligence.contextVersion,
        })
      : input.operationsView.teamReports[0]?.organizationContextRef,
  };
}

function buildAlertsSection(alerts: ReturnType<typeof aggregateAlerts>, now: string): DashboardSection {
  return {
    id: "alerts",
    title: "Alerts",
    available: true,
    cards: alerts.map((alert) => ({
      id: alert.id,
      title: alert.category,
      sectionId: "alerts",
      sourceTeamId: alert.sourceTeamId,
      status: alert.severity === "critical" ? "critical" : alert.severity === "warning" ? "warning" : "info",
      data: {
        message: alert.message,
        category: alert.category,
        severity: alert.severity,
        timestamp: alert.timestamp,
      },
      updatedAt: alert.timestamp ?? now,
    })),
  };
}

export function buildDashboardModel(input: BuildDashboardModelInput): DashboardModel {
  const now = input.now ?? new Date().toISOString();

  const operationsView: MultiTeamOperationsView =
    input.operationsView ??
    buildMultiTeamOperationsView({
      organizationId: input.organizationId,
      hiredTeamIds: input.activeTeamIds,
      teamReports: input.teamReports,
      now,
    });

  const reports = operationsView.teamReports;
  const recommendations = presentRecommendations(reports);
  const alerts = aggregateAlerts(reports, now);

  const sections: DashboardSection[] = [
    ...buildAlwaysAvailableSections({
      activeTeamIds: input.activeTeamIds,
      reports,
      operationsView,
      organizationPublicName: input.operationsIntelligence?.profile.publicName,
      now,
    }),
  ];

  for (const teamId of input.activeTeamIds) {
    const sectionId = resolveTeamSection(teamId);
    if (!sectionId) continue;
    const teamSection = buildTeamSection(
      teamId,
      sectionId,
      TEAM_SECTION_TITLES[teamId] ?? teamId,
      now,
    );
    if (teamSection) {
      sections.push(teamSection);
    }
  }

  const crossTeamSection = buildCrossTeamSection(operationsView, now);
  if (crossTeamSection) {
    sections.push(crossTeamSection);
  }

  sections.push(buildAlertsSection(alerts, now));
  sections.push(...buildFuturePlaceholderSections());

  const metadata = buildMetadata({
    organizationId: input.organizationId,
    activeTeamIds: input.activeTeamIds,
    operationsView,
    operationsIntelligence: input.operationsIntelligence,
    sections,
    now,
  });

  return {
    organizationId: input.organizationId,
    dashboardVersion: DASHBOARD_MODEL_VERSION,
    generatedAt: now,
    metadata,
    sections,
    alerts,
    recommendations,
  };
}
