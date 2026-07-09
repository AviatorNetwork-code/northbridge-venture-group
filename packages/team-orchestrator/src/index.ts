export type {
  TeamRequestLifecycleState,
  TeamLifecycleEvent,
  TeamLifecycleEventName,
  TeamLifecycleEvents,
} from "./types/lifecycle.js";
export { TEAM_REQUEST_LIFECYCLE_STATES } from "./types/lifecycle.js";

export type {
  TeamRequest,
  TeamRequestSource,
  TeamSession,
  CreateTeamSessionInput,
} from "./types/request.js";

export type {
  SpecialistSelection,
  PlannedTask,
  TeamExecutionPlan,
  SpecialistSelectionInput,
  SpecialistSelector,
  ExecutionPlanBuildInput,
  ExecutionPlanBuilder,
} from "./types/plan.js";

export type {
  DelegatedTask,
  DelegationResult,
  DelegationStatus,
  DelegationOutcome,
} from "./types/delegation.js";

export type { TeamLeadPolicy, TeamOrchestratorHooks } from "./types/policy.js";
export { DEFAULT_TEAM_LEAD_POLICY } from "./types/policy.js";

export type {
  TeamProgressPhase,
  TeamProgressEvent,
  TeamProgressReporter,
} from "./types/progress.js";
export { InMemoryTeamProgressReporter } from "./types/progress.js";

export type {
  TeamSynthesisInput,
  TeamSynthesisResult,
  TeamSynthesizer,
} from "./types/synthesis.js";
export { DefaultTeamSynthesizer } from "./types/synthesis.js";

export type {
  ConflictPolarity,
  TeamConflict,
  TeamConflictPosition,
  ConflictDetectionInput,
  ConflictDetector,
} from "./types/conflict.js";

export type {
  TeamEscalation,
  TeamEscalationTarget,
} from "./types/escalation.js";

export type {
  TeamReportBuildInput,
  TeamReportBuilder,
} from "./types/report.js";
export { DefaultTeamReportBuilder } from "./types/report.js";

export type { CrossTeamCollaborationAdapter } from "./types/collaboration.js";

export {
  TeamOrchestratorError,
  type TeamOrchestratorErrorCode,
} from "./runtime/errors.js";
export {
  assertTeamTransition,
  canTeamTransition,
  isTeamTerminalState,
} from "./runtime/state-machine.js";
export {
  assignTeamRequestOwner,
  assertSingleOwner,
  formatOwner,
} from "./runtime/owner.js";

export type {
  OrchestrateTeamInput,
  OrchestrateTeamResult,
  OrchestrateTeamSuccess,
  OrchestrateTeamEscalated,
  OrchestrateTeamFailed,
  SpecialistRoster,
  SpecialistRuntimeFactory,
  TeamOrchestrator,
} from "./runtime/types.js";

export {
  createTeamOrchestrator,
  DefaultTeamOrchestrator,
  InMemorySpecialistRoster,
  SharedSpecialistRuntimeFactory,
  type TeamOrchestratorDependencies,
} from "./runtime/team-orchestrator.js";

export {
  DefaultExecutionPlanBuilder,
  PassthroughSpecialistSelector,
} from "./planning/defaults.js";

export { DefaultConflictDetector } from "./conflicts/default-detector.js";
export { buildDelegatedTask } from "./delegation/build-task.js";
