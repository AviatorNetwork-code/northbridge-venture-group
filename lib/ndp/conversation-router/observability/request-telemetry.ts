import {
  buildWorkforceEvent,
  createEventId,
  type WorkforceTelemetryEmitter,
} from "@northbridge/workforce-observability";
import type { RequestOwner } from "@northbridge/workforce-contracts";
import type { CustomerRequest } from "../types/customer-request.js";
import type { ConversationOwnership } from "../types/ownership.js";
import { safeEmitTelemetry } from "./safe-emit.js";

export interface RequestTelemetryContext {
  correlationId: string;
  emitter: WorkforceTelemetryEmitter;
  now: () => string;
}

export function createRequestTelemetryContext(input: {
  request: CustomerRequest;
  emitter: WorkforceTelemetryEmitter;
  now?: () => string;
}): RequestTelemetryContext {
  return {
    correlationId: input.request.requestId,
    emitter: input.emitter,
    now: input.now ?? (() => new Date().toISOString()),
  };
}

export async function emitCustomerRequestEvent(
  ctx: RequestTelemetryContext,
  request: CustomerRequest,
): Promise<void> {
  await safeEmitTelemetry(
    ctx.emitter,
    buildWorkforceEvent({
      eventId: createEventId(),
      eventType: "customer_request",
      timestamp: ctx.now(),
      correlationId: ctx.correlationId,
      orgId: request.orgId,
      teamId: request.teamId,
      status: "started",
      metadata: {
        customerId: request.customerId,
        threadId: request.threadId,
        channel: request.channel,
      },
    }),
  );
}

export async function emitRoutingDecisionEvent(
  ctx: RequestTelemetryContext,
  request: CustomerRequest,
  ownership: ConversationOwnership,
): Promise<void> {
  await safeEmitTelemetry(
    ctx.emitter,
    buildWorkforceEvent({
      eventId: createEventId(),
      eventType: "routing_decision",
      timestamp: ctx.now(),
      correlationId: ctx.correlationId,
      orgId: request.orgId,
      teamId: ownership.owner.id ?? request.teamId,
      status: "completed",
      metadata: {
        ownerType: ownership.owner.type,
        ownerId: ownership.owner.id,
        ownershipSource: ownership.source,
        routingStatus: ownership.routingDecision?.status,
        auditId: ownership.routingDecision?.audit.auditId,
      },
    }),
  );
}

export async function emitTeamExecutionEvent(
  ctx: RequestTelemetryContext,
  input: {
    orgId: string;
    teamId: string;
    status: "started" | "completed" | "failed" | "escalated";
    metadata?: Record<string, unknown>;
  },
): Promise<void> {
  await safeEmitTelemetry(
    ctx.emitter,
    buildWorkforceEvent({
      eventId: createEventId(),
      eventType: "team_execution",
      timestamp: ctx.now(),
      correlationId: ctx.correlationId,
      orgId: input.orgId,
      teamId: input.teamId,
      status: input.status,
      metadata: input.metadata,
    }),
  );
}

export async function emitTeamSynthesisEvent(
  ctx: RequestTelemetryContext,
  input: {
    orgId: string;
    teamId: string;
    metadata?: Record<string, unknown>;
  },
): Promise<void> {
  await safeEmitTelemetry(
    ctx.emitter,
    buildWorkforceEvent({
      eventId: createEventId(),
      eventType: "team_synthesis",
      timestamp: ctx.now(),
      correlationId: ctx.correlationId,
      orgId: input.orgId,
      teamId: input.teamId,
      status: "completed",
      metadata: input.metadata,
    }),
  );
}

export async function emitEscalationEvent(
  ctx: RequestTelemetryContext,
  input: {
    orgId: string;
    teamId?: string;
    specialistId?: string;
    metadata?: Record<string, unknown>;
  },
): Promise<void> {
  await safeEmitTelemetry(
    ctx.emitter,
    buildWorkforceEvent({
      eventId: createEventId(),
      eventType: "escalation",
      timestamp: ctx.now(),
      correlationId: ctx.correlationId,
      orgId: input.orgId,
      teamId: input.teamId,
      specialistId: input.specialistId,
      status: "escalated",
      metadata: input.metadata,
    }),
  );
}

export async function emitCustomerResponseEvent(
  ctx: RequestTelemetryContext,
  input: {
    orgId: string;
    owner: RequestOwner;
    metadata?: Record<string, unknown>;
  },
): Promise<void> {
  await safeEmitTelemetry(
    ctx.emitter,
    buildWorkforceEvent({
      eventId: createEventId(),
      eventType: "customer_response",
      timestamp: ctx.now(),
      correlationId: ctx.correlationId,
      orgId: input.orgId,
      teamId: input.owner.type === "team" ? input.owner.id : undefined,
      status: "completed",
      metadata: {
        ownerType: input.owner.type,
        ownerId: input.owner.id,
        ...input.metadata,
      },
    }),
  );
}
