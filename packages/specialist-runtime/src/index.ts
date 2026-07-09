export type {
  CapabilityDefinition,
  CapabilityRegistry,
  CapabilityValidationResult,
} from "./types/capabilities.js";

export type { ConfidenceLevel, ConfidenceScore } from "./types/confidence.js";
export { meetsMinimumConfidence } from "./types/confidence.js";

export type { SpecialistConversationAdapter } from "./types/conversation.js";

export type {
  CreateSessionInput,
  SpecialistContext,
  SpecialistSession,
} from "./types/context.js";

export type {
  ProgressEvent,
  ProgressPhase,
  ProgressReporter,
  TaskExecutionInput,
  TaskExecutionOutput,
  TaskExecutor,
  ExecutionEnvironment,
} from "./types/execution.js";
export { InMemoryProgressReporter } from "./types/execution.js";

export type {
  LifecycleEvent,
  LifecycleEventName,
  LifecycleEvents,
  LifecycleTransitionEvent,
  RuntimeLifecycleState,
} from "./types/lifecycle.js";
export { RUNTIME_LIFECYCLE_STATES } from "./types/lifecycle.js";

export type {
  EscalationRequest,
  MemoryScope,
  SpecialistMemoryAdapter,
  SpecialistMemoryReference,
  SpecialistMemorySnapshot,
} from "./types/memory.js";

export type { ExecutionHooks, RuntimePolicy } from "./types/policy.js";
export { DEFAULT_RUNTIME_POLICY } from "./types/policy.js";

export {
  InMemoryCapabilityRegistry,
  validateCapability,
} from "./registry/in-memory-capability-registry.js";

export {
  SpecialistRuntimeError,
  type SpecialistRuntimeErrorCode,
} from "./runtime/errors.js";
export {
  assertTransition,
  canTransition,
  isTerminalState,
} from "./runtime/state-machine.js";
export {
  createSpecialistRuntime,
  DefaultSpecialistRuntime,
  type SpecialistRuntimeDependencies,
} from "./runtime/specialist-runtime.js";
export type {
  RunTaskEscalated,
  RunTaskFailed,
  RunTaskInput,
  RunTaskResult,
  RunTaskSuccess,
  SpecialistRuntime,
} from "./runtime/types.js";

export {
  validateConfidenceAgainstPolicy,
  validateExecutionOutput,
} from "./validation/results.js";

export type { CapabilityToolRouter } from "./connectors/capability-tool-router.js";
export {
  ConnectorCapabilityToolRouter,
  createCapabilityToolRouter,
} from "./connectors/capability-tool-router.js";

export {
  createCapabilityRoutedTaskExecutor,
  type CapabilityRoutedExecutorOptions,
} from "./connectors/capability-routed-executor.js";

export {
  createObservabilityExecutionHooks,
  type ObservabilityExecutionHooksOptions,
} from "./observability/hooks.js";
