import { buildWorkforceEvent, createEventId, } from "@northbridge/workforce-observability";
export function createObservabilityExecutionHooks(options) {
    const now = options.now ?? (() => new Date().toISOString());
    const base = (session) => ({
        eventId: createEventId(),
        timestamp: now(),
        correlationId: options.correlationId,
        orgId: session.task.orgId,
        teamId: session.task.teamId,
        specialistId: session.specialist.id,
    });
    return {
        onBeforeExecute: async (session) => {
            await options.emitter.emit(buildWorkforceEvent({
                ...base(session),
                eventType: "specialist_execution",
                status: "started",
                metadata: { taskId: session.task.id, phase: "execution" },
            }));
        },
        onAfterExecute: async (session, output) => {
            await options.emitter.emit(buildWorkforceEvent({
                ...base(session),
                eventType: "specialist_execution",
                status: "completed",
                confidence: output.confidence,
                metadata: { taskId: session.task.id },
            }));
        },
        onEscalation: async (request) => {
            await options.emitter.emit(buildWorkforceEvent({
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
            }));
        },
    };
}
