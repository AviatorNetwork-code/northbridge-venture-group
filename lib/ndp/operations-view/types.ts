import type { OperationalMetric } from "@northbridge/workforce-contracts";

export const OPERATIONS_VIEW_REPORT_VERSION = "1.0.0";

export const LAUNCH_OPERATIONS_TEAM_IDS = [
  "team-marketing",
  "team-sales",
  "team-customer-service",
  "team-financial",
] as const;

export type LaunchOperationsTeamId = (typeof LAUNCH_OPERATIONS_TEAM_IDS)[number];

export interface TeamConfidenceSummary {
  averageLevel: "high" | "medium" | "low" | "unknown";
  specialistLevels: Array<{ specialistId: string; level: string }>;
}

export interface NormalizedTeamRecommendation {
  id: string;
  sourceTeamId: string;
  category: string;
  summary: string;
  evidence: string[];
  priority: "high" | "medium" | "low";
  customerSuccessFirst: true;
  recommendationType: string;
  expectedBenefit?: string;
  risks?: string[];
  requiredApproval: boolean;
  confidence: TeamConfidenceSummary["averageLevel"];
}

export interface NormalizedTeamReport {
  teamId: string;
  organizationId: string;
  teamLeadId: string;
  reportId: string;
  reportVersion: string;
  periodStart: string;
  periodEnd: string;
  operationalSummary: string;
  kpis: OperationalMetric[];
  workCompleted: string[];
  pendingWork: string[];
  alerts: string[];
  escalations: string[];
  recommendations: NormalizedTeamRecommendation[];
  confidence: TeamConfidenceSummary;
  organizationContextRef?: string;
  organizationPublicName?: string;
  operationsContextVersion?: string;
  generatedAt: string;
}

export type CrossTeamSignalType =
  | "lead_volume_exceeds_sales_capacity"
  | "sales_outpaces_customer_service"
  | "service_demand_with_payment_delays"
  | "spend_increase_vs_cost_reduction"
  | "missing_shared_organizational_fact"
  | "incompatible_team_actions";

export type CrossTeamSignalSeverity = "info" | "warning" | "critical";

export interface CrossTeamSignal {
  id: string;
  type: CrossTeamSignalType;
  severity: CrossTeamSignalSeverity;
  summary: string;
  involvedTeamIds: string[];
  evidence: string[];
  requiresCustomerReview: true;
}

export interface RecommendationConflict {
  id: string;
  summary: string;
  involvedTeamIds: string[];
  recommendationIds: string[];
  evidence: string[];
  requiresCustomerReview: true;
}

export interface CrossTeamDependency {
  id: string;
  summary: string;
  fromTeamId: string;
  toTeamId: string;
  evidence: string[];
}

export interface CrossTeamOpportunity {
  id: string;
  summary: string;
  involvedTeamIds: string[];
  evidence: string[];
}

export interface TeamHealthSummary {
  teamId: string;
  teamName: string;
  status: "healthy" | "warning" | "critical" | "unknown";
  summary: string;
  pendingCount: number;
  escalationCount: number;
  alertCount: number;
  reportFreshness: "fresh" | "stale" | "missing";
}

export interface PendingApprovalItem {
  id: string;
  sourceTeamId: string;
  label: string;
  priority: "high" | "medium" | "low";
}

export interface OperationalTrend {
  id: string;
  label: string;
  direction: "up" | "down" | "stable";
  involvedTeamIds: string[];
  evidence: string[];
}

export interface OperationsSnapshot {
  organizationId: string;
  activeTeamIds: string[];
  teamHealthSummaries: TeamHealthSummary[];
  teamKpis: Array<{ teamId: string; kpis: OperationalMetric[] }>;
  pendingApprovals: PendingApprovalItem[];
  openEscalations: Array<{ teamId: string; label: string }>;
  businessWideAlerts: string[];
  crossTeamDependencies: CrossTeamDependency[];
  conflictingRecommendations: RecommendationConflict[];
  crossTeamOpportunities: CrossTeamOpportunity[];
  operationalTrends: OperationalTrend[];
  reportFreshness: Array<{ teamId: string; generatedAt?: string; status: "fresh" | "stale" | "missing" }>;
  generatedAt: string;
}

export interface ManagerRecommendationEvidence {
  status: "inactive" | "eligible";
  activeTeamCount: number;
  crossTeamDependencyFrequency: number;
  unresolvedConflictFrequency: number;
  duplicateWorkRate: number;
  customerApprovalBurden: number;
  crossTeamEscalationCount: number;
  reportingFragmentationScore: number;
  observationPeriodDays: number;
  minimumEvidenceThreshold: number;
  eligible: boolean;
  rationale: string[];
}

export interface OperationsDashboardSection<T = Record<string, unknown>> {
  id: string;
  title: string;
  data: T;
}

export interface OperationsDashboardModel {
  organizationId: string;
  hiredTeamIds: string[];
  sections: OperationsDashboardSection[];
  generatedAt: string;
}

export interface MultiTeamOperationsView {
  organizationId: string;
  hiredTeamIds: string[];
  viewVersion: string;
  teamReports: NormalizedTeamReport[];
  snapshot: OperationsSnapshot;
  aggregatedRecommendations: NormalizedTeamRecommendation[];
  crossTeamSignals: CrossTeamSignal[];
  managerEvidence: ManagerRecommendationEvidence;
  dashboard: OperationsDashboardModel;
  generatedAt: string;
}

export interface ManagerObservationHistory {
  observationPeriodDays: number;
  priorCrossTeamDependencyCount?: number;
  priorUnresolvedConflictCount?: number;
  priorDuplicateWorkCount?: number;
  priorCustomerApprovalCount?: number;
}

export interface BuildMultiTeamOperationsViewInput {
  organizationId: string;
  hiredTeamIds: string[];
  teamReports: unknown[];
  teamNames?: Record<string, string>;
  observationHistory?: ManagerObservationHistory;
  now?: string;
  staleReportThresholdMs?: number;
  managerEvidenceThreshold?: number;
}
