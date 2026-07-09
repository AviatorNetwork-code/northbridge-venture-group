export { safeEmitTelemetry } from "./safe-emit.js";

export {
  createRequestTelemetryContext,
  emitCustomerRequestEvent,
  emitCustomerResponseEvent,
  emitEscalationEvent,
  emitRoutingDecisionEvent,
  emitTeamExecutionEvent,
  emitTeamSynthesisEvent,
  type RequestTelemetryContext,
} from "./request-telemetry.js";

export {
  applyOrchestratorObservability,
  createOrchestratorTelemetryHooks,
  withObservabilityRuntimeDeps,
  type OrchestratorTelemetryOptions,
} from "./orchestrator-telemetry.js";
