import type { TeamOrchestratorDependencies } from "@northbridge/team-orchestrator";
import type { TeamOrchestratorHooks } from "@northbridge/team-orchestrator";
import {
  createObservabilityExecutionHooks,
  type SpecialistRuntimeDependencies,
} from "@northbridge/specialist-runtime";
import type { ExecutionHooks } from "@northbridge/specialist-runtime";
import type { WorkforceTelemetryEmitter } from "@northbridge/workforce-observability";

export interface OrchestratorTelemetryOptions {
  emitter: WorkforceTelemetryEmitter;
  correlationId: string;
  orgId: string;
  teamId: string;
  now?: () => string;
}

export function createOrchestratorTelemetryHooks(
  _options: OrchestratorTelemetryOptions,
): TeamOrchestratorHooks {
  return {};
}

function mergeExecutionHooks(
  base: ExecutionHooks | undefined,
  overlay: ExecutionHooks,
): ExecutionHooks {
  return {
    onBeforeExecute: async (session) => {
      await base?.onBeforeExecute?.(session);
      await overlay.onBeforeExecute?.(session);
    },
    onAfterExecute: async (session, output) => {
      await base?.onAfterExecute?.(session, output);
      await overlay.onAfterExecute?.(session, output);
    },
    onEscalation: async (request) => {
      await base?.onEscalation?.(request);
      await overlay.onEscalation?.(request);
    },
  };
}

export function withObservabilityRuntimeDeps(
  deps: SpecialistRuntimeDependencies,
  options: OrchestratorTelemetryOptions,
): SpecialistRuntimeDependencies {
  const observabilityHooks = createObservabilityExecutionHooks({
    emitter: options.emitter,
    correlationId: options.correlationId,
    now: options.now,
  });

  return {
    ...deps,
    hooks: mergeExecutionHooks(deps.hooks, observabilityHooks),
  };
}

export function applyOrchestratorObservability(
  deps: TeamOrchestratorDependencies,
  options: OrchestratorTelemetryOptions,
): TeamOrchestratorDependencies {
  const telemetryHooks = createOrchestratorTelemetryHooks(options);

  return {
    ...deps,
    hooks: mergeOrchestratorHooks(deps.hooks, telemetryHooks),
  };
}

function mergeOrchestratorHooks(
  base: TeamOrchestratorHooks | undefined,
  overlay: TeamOrchestratorHooks,
): TeamOrchestratorHooks {
  return {
    onBeforeDelegation: async (input) => {
      await base?.onBeforeDelegation?.(input);
      await overlay.onBeforeDelegation?.(input);
    },
    onAfterDelegation: async (result) => {
      await base?.onAfterDelegation?.(result);
      await overlay.onAfterDelegation?.(result);
    },
    onEscalation: async (escalation) => {
      await base?.onEscalation?.(escalation);
      await overlay.onEscalation?.(escalation);
    },
  };
}
