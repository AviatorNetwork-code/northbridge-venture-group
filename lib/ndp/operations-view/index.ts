export {
  OPERATIONS_VIEW_REPORT_VERSION,
  OPERATIONS_VIEW_VERSION,
  LAUNCH_OPERATIONS_TEAM_IDS,
  DEFAULT_STALE_REPORT_THRESHOLD_MS,
  type LaunchOperationsTeamId,
  type NormalizedTeamReport,
  type NormalizedTeamRecommendation,
  type CrossTeamSignal,
  type CrossTeamSignalType,
  type RecommendationConflict,
  type CrossTeamDependency,
  type CrossTeamOpportunity,
  type TeamHealthSummary,
  type PendingApprovalItem,
  type OperationalTrend,
  type OperationsSnapshot,
  type ManagerRecommendationEvidence,
  type ManagerObservationHistory,
  type OperationsDashboardModel,
  type OperationsDashboardSection,
  type MultiTeamOperationsView,
  type BuildMultiTeamOperationsViewInput,
} from "./types.js";

export {
  isKnownOperationalReport,
  normalizeTeamOperationalReport,
  normalizeTeamOperationalReports,
} from "./adapters.js";

export {
  detectCrossTeamSignals,
  detectRecommendationConflicts,
  detectCrossTeamDependencies,
  detectCrossTeamOpportunities,
} from "./signals.js";

export {
  buildManagerRecommendationEvidence,
  DEFAULT_MANAGER_EVIDENCE_THRESHOLD,
  DEFAULT_MIN_OBSERVATION_DAYS,
} from "./manager-evidence.js";

export {
  buildOperationsDashboardModel,
  resolveTeamDisplayName,
  extractDashboardSummary,
} from "./dashboard.js";

export { buildMultiTeamOperationsView } from "./builder.js";

export {
  buildNordiOperationsAnalysisContext,
  buildNordiOperationsSummary,
  type NordiOperationsAnalysisContext,
} from "./nordi.js";

export {
  createOperationsViewTelemetryContext,
  emitOperationsViewBuiltEvent,
  emitCrossTeamSignalDetectedEvent,
  emitRecommendationConflictDetectedEvent,
  emitManagerEvidenceUpdatedEvent,
  emitOperationsViewTelemetry,
  type OperationsViewTelemetryContext,
} from "./observability.js";
