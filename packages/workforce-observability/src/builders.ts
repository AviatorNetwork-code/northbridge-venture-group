import type {
  WorkforceEvent,
  WorkforceEventStatus,
  WorkforceEventType,
  WorkforceEventConfidence,
} from "./types/event.js";

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

export function buildWorkforceEvent(
  input: BuildWorkforceEventInput,
): WorkforceEvent {
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

export function createCorrelationId(prefix = "corr"): string {
  return `${prefix}-${crypto.randomUUID()}`;
}

export function createEventId(prefix = "evt"): string {
  return `${prefix}-${crypto.randomUUID()}`;
}
