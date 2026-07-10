import type { DashboardModel } from "@/lib/ndp/dashboard";
import type { DashboardRequest } from "./request.js";
import {
  type DashboardAlertDto,
  type DashboardCardDto,
  type DashboardMetadataDto,
  type DashboardRecommendationDto,
  type DashboardResponse,
  type DashboardSectionDto,
  type FutureExpansionPlaceholder,
  type SupportedActionDto,
  type TeamSummaryDto,
} from "./dto.js";
import { sanitizePublicRecord } from "./sanitize.js";
import {
  DASHBOARD_BFF_API_VERSION,
  DASHBOARD_BFF_SCHEMA_VERSION,
  isSupportedDashboardVersion,
} from "./version.js";

const FUTURE_EXPANSION_PLACEHOLDER: FutureExpansionPlaceholder = {
  enabled: false,
  reserved: true,
};

export interface MapDashboardModelOptions {
  request: DashboardRequest;
  apiVersion?: string;
  schemaVersion?: string;
}

function mapCard(card: DashboardModel["sections"][number]["cards"][number]): DashboardCardDto {
  return {
    id: card.id,
    title: card.title,
    sectionId: card.sectionId,
    sourceTeamId: card.sourceTeamId,
    status: card.status,
    payload: sanitizePublicRecord(card.data),
    updatedAt: card.updatedAt,
  };
}

function mapSection(
  section: DashboardModel["sections"][number],
  includePlaceholders: boolean,
): DashboardSectionDto | null {
  if (section.placeholder && !includePlaceholders) {
    return null;
  }

  return {
    id: section.id,
    title: section.title,
    available: section.available,
    placeholder: section.placeholder,
    cards: section.cards.map(mapCard),
  };
}

function mapTeamSummaries(sections: DashboardSectionDto[]): TeamSummaryDto[] {
  const activeTeams = sections.find((section) => section.id === "active_digital_teams");
  if (!activeTeams) return [];

  return activeTeams.cards.map((card) => ({
    teamId: card.sourceTeamId ?? card.id,
    teamName: card.title,
    status: card.status,
    summary: String(card.payload.summary ?? ""),
    pendingCount: Number(card.payload.pendingCount ?? 0),
    escalationCount: Number(card.payload.escalationCount ?? 0),
    reportFreshness:
      (card.payload.reportFreshness as TeamSummaryDto["reportFreshness"]) ?? "missing",
  }));
}

function buildSupportedActions(
  alerts: DashboardAlertDto[],
  recommendations: DashboardRecommendationDto[],
  sections: DashboardSectionDto[],
): SupportedActionDto[] {
  const actions: SupportedActionDto[] = [
    {
      id: "refresh-dashboard",
      type: "refresh_dashboard",
      label: "Refresh dashboard",
    },
  ];

  for (const recommendation of recommendations) {
    if (recommendation.approvalRequired) {
      actions.push({
        id: `approve-${recommendation.id}`,
        type: "approve_recommendation",
        label: "Approve recommendation",
        sourceTeamId: recommendation.sourceTeamId,
        targetId: recommendation.id,
        requiresApproval: true,
      });
    }

    if (recommendation.evidenceAvailable) {
      actions.push({
        id: `evidence-${recommendation.id}`,
        type: "view_recommendation_evidence",
        label: "View recommendation evidence",
        sourceTeamId: recommendation.sourceTeamId,
        targetId: recommendation.id,
      });
    }
  }

  for (const alert of alerts) {
    actions.push({
      id: `ack-${alert.id}`,
      type: "acknowledge_alert",
      label: "Acknowledge alert",
      sourceTeamId: alert.sourceTeamId,
      targetId: alert.id,
    });
  }

  for (const section of sections) {
    if (section.available && !section.placeholder && section.id !== "alerts") {
      actions.push({
        id: `view-section-${section.id}`,
        type: "view_team_section",
        label: `View ${section.title}`,
        targetId: section.id,
      });
    }
  }

  return actions;
}

function resolveDashboardVersion(request: DashboardRequest, model: DashboardModel): string {
  if (
    request.dashboardVersionRequested &&
    isSupportedDashboardVersion(request.dashboardVersionRequested)
  ) {
    return request.dashboardVersionRequested;
  }
  return model.dashboardVersion;
}

export function mapDashboardModelToResponse(
  model: DashboardModel,
  options: MapDashboardModelOptions,
): DashboardResponse {
  const includePlaceholders = options.request.includePlaceholders ?? false;
  const apiVersion = options.apiVersion ?? DASHBOARD_BFF_API_VERSION;
  const schemaVersion = options.schemaVersion ?? DASHBOARD_BFF_SCHEMA_VERSION;

  const sections = model.sections
    .map((section) => mapSection(section, includePlaceholders))
    .filter((section): section is DashboardSectionDto => section !== null);

  const alerts: DashboardAlertDto[] = model.alerts.map((alert) => ({
    id: alert.id,
    severity: alert.severity,
    sourceTeamId: alert.sourceTeamId,
    category: alert.category,
    message: alert.message,
    timestamp: alert.timestamp,
  }));

  const recommendations: DashboardRecommendationDto[] = model.recommendations.map((entry) => ({
    id: entry.id,
    recommendation: entry.recommendation,
    sourceTeamId: entry.sourceTeamId,
    confidence: entry.confidence,
    approvalRequired: entry.approvalRequired,
    evidenceAvailable: entry.evidenceAvailable,
    category: entry.category,
    priority: entry.priority,
  }));

  const metadata: DashboardMetadataDto = {
    organizationId: model.metadata.organizationId,
    customerId: options.request.customerId,
    dashboardVersion: resolveDashboardVersion(options.request, model),
    apiVersion,
    generatedAt: model.metadata.generatedAt,
    locale: options.request.locale,
    timezone: options.request.timezone,
    availableTeams: model.metadata.availableTeams,
    activeSections: sections.filter((section) => section.available && !section.placeholder).map(
      (section) => section.id,
    ),
    missingSections: model.metadata.missingSections,
    organizationPublicName: model.metadata.organizationPublicName,
  };

  const teamSummaries = mapTeamSummaries(sections);

  const response: DashboardResponse = {
    schemaVersion,
    apiVersion,
    metadata,
    sections,
    alerts,
    recommendations,
    freshness: model.metadata.reportFreshness.map((entry) => ({
      teamId: entry.teamId,
      generatedAt: entry.generatedAt,
      status: entry.status,
    })),
    confidence: {
      organizationLevel: model.metadata.confidenceSummary.organizationLevel,
      byTeam: model.metadata.confidenceSummary.byTeam.map((entry) => ({
        teamId: entry.teamId,
        level: entry.level,
      })),
    },
    supportedActions: buildSupportedActions(alerts, recommendations, sections),
    teamSummaries,
    offlineSync: FUTURE_EXPANSION_PLACEHOLDER,
    pagination: FUTURE_EXPANSION_PLACEHOLDER,
    widgetRefresh: FUTURE_EXPANSION_PLACEHOLDER,
    deltaUpdates: FUTURE_EXPANSION_PLACEHOLDER,
    liveSubscriptions: FUTURE_EXPANSION_PLACEHOLDER,
  };

  if (options.request.includeDebugMetadata) {
    response.debug = {
      operationsContextRef: model.metadata.operationsContextRef,
      featureFlags: options.request.featureFlags ?? {},
      appVersion: options.request.appVersion,
    };
  }

  return response;
}
