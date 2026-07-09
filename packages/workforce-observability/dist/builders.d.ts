import type { WorkforceEvent, WorkforceEventStatus, WorkforceEventType, WorkforceEventConfidence } from "./types/event.js";
export interface BuildWorkforceEventInput {
    eventId: string;
    eventType: WorkforceEventType;
    timestamp: string;
    correlationId: string;
    orgId: string;
    status: WorkforceEventStatus;
    teamId?: string;
    specialistId?: string;
    durationMs?: number;
    confidence?: WorkforceEventConfidence;
    metadata?: Record<string, unknown>;
}
export declare function buildWorkforceEvent(input: BuildWorkforceEventInput): WorkforceEvent;
export declare function createCorrelationId(prefix?: string): string;
export declare function createEventId(prefix?: string): string;
