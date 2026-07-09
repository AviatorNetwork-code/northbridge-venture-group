import type {
  BuildWorkforceEventInput,
  WorkforceTelemetryEmitter,
} from "@northbridge/workforce-observability";
import {
  buildWorkforceEvent,
  createEventId,
} from "@northbridge/workforce-observability";
import type { ExecutionHooks } from "../types/policy.js";
import type { SpecialistSession } from "../types/context.js";
import type { TaskExecutionOutput } from "../types/execution.js";
import type { EscalationRequest } from "../types/memory.js";

export interface ObservabilityExecutionHooksOptions {
  emitter: WorkforceTelemetryEmitter;
  correlationId: string;
  now?: () => string;
}

export function createObservabilityExecutionHooks(
  options: ObservabilityExecutionHooksOptions,
): ExecutionHooks {
  const now = options.now ?? (() => new Date().toISOString());

  const base = (session: SpecialistSession): Omit<BuildWorkforceEventInput, "eventType" | "status"> => ({
    eventId: createEventId(),
    timestamp: now(),
    correlationId: options.correlationId,
    orgId: session.task.orgId,
    teamId: session.task.teamId,
    specialistId: session.specialist.id,
  });

  return {
    onBeforeExecute: async (session) => {
      await options.emitter.emit(
        buildWorkforceEvent({
          ...base(session),
          eventType: "specialist_execution",
          status: "started",
          metadata: { taskId: session.task.id, phase: "execution" },
        }),
      );
    },
    onAfterExecute: async (session, output: TaskExecutionOutput) => {
      await options.emitter.emit(
        buildWorkforceEvent({
          ...base(session),
          eventType: "specialist_execution",
          status: "completed",
          confidence: output.confidence,
          metadata: { taskId: session.task.id },
        }),
      );
    },
    onEscalation: async (request: EscalationRequest) => {
      await options.emitter.emit(
        buildWorkforceEvent({
          eventId: createEventId(),
          eventType: "escalation",
          timestamp: now(),
          correlationId: options.correlationId,
          orgId: request.orgId,
          specialistId: request.specialistId,
          status: "escalated",
          metadata: {
            taskId: request.taskId,
            targetRole: request.targetRole,
            reason: request.reason,
          },
        }),
      );
    },
  };
}
