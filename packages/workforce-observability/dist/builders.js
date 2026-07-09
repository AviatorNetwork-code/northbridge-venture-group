export function buildWorkforceEvent(input) {
    return {
        eventId: input.eventId,
        eventType: input.eventType,
        timestamp: input.timestamp,
        correlationId: input.correlationId,
        orgId: input.orgId,
        teamId: input.teamId,
        specialistId: input.specialistId,
        durationMs: input.durationMs,
        confidence: input.confidence,
        status: input.status,
        metadata: input.metadata,
    };
}
export function createCorrelationId(prefix = "corr") {
    return `${prefix}-${crypto.randomUUID()}`;
}
export function createEventId(prefix = "evt") {
    return `${prefix}-${crypto.randomUUID()}`;
}
