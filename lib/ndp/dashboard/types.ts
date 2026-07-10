import type { OrganizationIntelligenceContext } from "@northbridge/operations-intelligence";
import type { MultiTeamOperationsView } from "@/lib/ndp/operations-view";

export const DASHBOARD_MODEL_VERSION = "1.0.0";

export const LAUNCH_DASHBOARD_TEAM_IDS = [
  "team-marketing",
  "team-sales",
  "team-customer-service",
  "team-financial",
] as const;

export type LaunchDashboardTeamId = (typeof LAUNCH_DASHBOARD_TEAM_IDS)[number];

export type DashboardSectionId =
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

export type DashboardCardStatus = "healthy" | "warning" | "critical" | "info";

export interface DashboardCard {
  id: string;
  title: string;
  sectionId: DashboardSectionId;
  sourceTeamId?: string;
  status: DashboardCardStatus;
  data: Record<string, unknown>;
  updatedAt: string;
}

export interface DashboardSection {
  id: DashboardSectionId;
  title: string;
  available: boolean;
  placeholder?: boolean;
  cards: DashboardCard[];
}

export interface AggregatedAlert {
  id: string;
  severity: "info" | "warning" | "critical";
  sourceTeamId: string;
  category: string;
  message: string;
  timestamp: string;
}

export interface PresentedRecommendation {
  id: string;
  recommendation: string;
  sourceTeamId: string;
  confidence: "high" | "medium" | "low" | "unknown";
  approvalRequired: boolean;
  evidenceAvailable: boolean;
  category: string;
  priority: "high" | "medium" | "low";
  customerSuccessFirst: true;
}

export interface ReportFreshnessEntry {
  teamId: string;
  generatedAt?: string;
  status: "fresh" | "stale" | "missing";
}

export interface ConfidenceSummary {
  organizationLevel: "high" | "medium" | "low" | "unknown";
  byTeam: Array<{ teamId: string; level: "high" | "medium" | "low" | "unknown" }>;
}

export interface DashboardMetadata {
  organizationId: string;
  dashboardVersion: string;
  generatedAt: string;
  availableTeams: string[];
  activeSections: DashboardSectionId[];
  missingSections: DashboardSectionId[];
  reportFreshness: ReportFreshnessEntry[];
  confidenceSummary: ConfidenceSummary;
  organizationPublicName?: string;
  operationsContextRef?: string;
}

export interface DashboardModel {
  organizationId: string;
  dashboardVersion: string;
  generatedAt: string;
  metadata: DashboardMetadata;
  sections: DashboardSection[];
  alerts: AggregatedAlert[];
  recommendations: PresentedRecommendation[];
}

export interface BuildDashboardModelInput {
  organizationId: string;
  activeTeamIds: string[];
  teamReports: unknown[];
  operationsIntelligence?: OrganizationIntelligenceContext;
  operationsView?: MultiTeamOperationsView;
  now?: string;
}

export interface NordiDashboardContext {
  role: "nordi_analyst";
  requestOwner: "nordi";
  dashboard: DashboardModel;
  maySummarizeBusinessPerformance: true;
  mayIdentifyTeamsNeedingAttention: true;
  mayExplainChanges: true;
  maySurfaceApprovalItems: true;
  mustNotFabricateDashboardCards: true;
  mustNotInventKpis: true;
  mustNotChangeOwnership: true;
}
