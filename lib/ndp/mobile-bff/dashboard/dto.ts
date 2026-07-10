export type DashboardCardStatusDto = "healthy" | "warning" | "critical" | "info";

export type DashboardSectionIdDto =
  | "organization_overview"
  | "active_digital_teams"
  | "recent_activity"
  | "alerts"
  | "marketing"
  | "sales"
  | "customer_service"
  | "financial"
  | "cross_team"
  | "manager"
  | "director"
  | "executive"
  | "ai_insights";

export interface DashboardCardDto {
  id: string;
  title: string;
  sectionId: DashboardSectionIdDto;
  sourceTeamId?: string;
  status: DashboardCardStatusDto;
  payload: Record<string, unknown>;
  updatedAt: string;
}

export interface DashboardSectionDto {
  id: DashboardSectionIdDto;
  title: string;
  available: boolean;
  placeholder?: boolean;
  cards: DashboardCardDto[];
}

export interface DashboardAlertDto {
  id: string;
  severity: "info" | "warning" | "critical";
  sourceTeamId: string;
  category: string;
  message: string;
  timestamp: string;
}

export interface DashboardRecommendationDto {
  id: string;
  recommendation: string;
  sourceTeamId: string;
  confidence: "high" | "medium" | "low" | "unknown";
  approvalRequired: boolean;
  evidenceAvailable: boolean;
  category: string;
  priority: "high" | "medium" | "low";
}

export interface ReportFreshnessDto {
  teamId: string;
  generatedAt?: string;
  status: "fresh" | "stale" | "missing";
}

export interface ConfidenceSummaryDto {
  organizationLevel: "high" | "medium" | "low" | "unknown";
  byTeam: Array<{ teamId: string; level: "high" | "medium" | "low" | "unknown" }>;
}

export interface TeamSummaryDto {
  teamId: string;
  teamName: string;
  status: "healthy" | "warning" | "critical" | "unknown" | "info";
  summary: string;
  pendingCount: number;
  escalationCount: number;
  reportFreshness: "fresh" | "stale" | "missing";
}

export type SupportedActionType =
  | "approve_recommendation"
  | "view_recommendation_evidence"
  | "acknowledge_alert"
  | "view_team_section"
  | "refresh_dashboard";

export interface SupportedActionDto {
  id: string;
  type: SupportedActionType;
  label: string;
  sourceTeamId?: string;
  targetId?: string;
  requiresApproval?: boolean;
}

export interface FutureExpansionPlaceholder {
  enabled: false;
  reserved: true;
}

export interface DashboardMetadataDto {
  organizationId: string;
  customerId: string;
  dashboardVersion: string;
  apiVersion: string;
  generatedAt: string;
  locale?: string;
  timezone?: string;
  availableTeams: string[];
  activeSections: DashboardSectionIdDto[];
  missingSections: DashboardSectionIdDto[];
  organizationPublicName?: string;
}

export interface DashboardResponse {
  schemaVersion: string;
  apiVersion: string;
  metadata: DashboardMetadataDto;
  sections: DashboardSectionDto[];
  alerts: DashboardAlertDto[];
  recommendations: DashboardRecommendationDto[];
  freshness: ReportFreshnessDto[];
  confidence: ConfidenceSummaryDto;
  supportedActions: SupportedActionDto[];
  teamSummaries: TeamSummaryDto[];
  offlineSync: FutureExpansionPlaceholder;
  pagination: FutureExpansionPlaceholder;
  widgetRefresh: FutureExpansionPlaceholder;
  deltaUpdates: FutureExpansionPlaceholder;
  liveSubscriptions: FutureExpansionPlaceholder;
  debug?: Record<string, unknown>;
}
