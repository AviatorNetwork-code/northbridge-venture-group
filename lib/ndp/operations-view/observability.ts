import {
  buildWorkforceEvent,
  createEventId,
  type WorkforceTelemetryEmitter,
} from "@northbridge/workforce-observability";
import { safeEmitTelemetry } from "@/lib/ndp/conversation-router/observability/safe-emit";
import type { CrossTeamSignal, ManagerRecommendationEvidence, RecommendationConflict } from "./types.js";

export interface OperationsViewTelemetryContext {
  correlationId: string;
  orgId: string;
  emitter: WorkforceTelemetryEmitter;
  now: () => string;
}

export function createOperationsViewTelemetryContext(input: {
  correlationId: string;
  orgId: string;
  emitter: WorkforceTelemetryEmitter;
  now?: () => string;
}): OperationsViewTelemetryContext {
  return {
    correlationId: input.correlationId,
    orgId: input.orgId,
    emitter: input.emitter,
    now: input.now ?? (() => new Date().toISOString()),
  };
}

export async function emitOperationsViewBuiltEvent(
  ctx: OperationsViewTelemetryContext,
  metadata: Record<string, unknown>,
): Promise<void> {
  await safeEmitTelemetry(
    ctx.emitter,
    buildWorkforceEvent({
      eventId: createEventId(),
      eventType: "team_execution",
      timestamp: ctx.now(),
      correlationId: ctx.correlationId,
      orgId: ctx.orgId,
      status: "completed",
      metadata: { phase: "operations_view_built", ...metadata },
    }),
  );
}

export async function emitCrossTeamSignalDetectedEvent(
  ctx: OperationsViewTelemetryContext,
  signal: CrossTeamSignal,
): Promise<void> {
  await safeEmitTelemetry(
    ctx.emitter,
    buildWorkforceEvent({
      eventId: createEventId(),
      eventType: "routing_decision",
      timestamp: ctx.now(),
      correlationId: ctx.correlationId,
      orgId: ctx.orgId,
      status: "completed",
      metadata: {
        phase: "cross_team_signal_detected",
        signalId: signal.id,
        signalType: signal.type,
        involvedTeamIds: signal.involvedTeamIds,
      },
    }),
  );
}

export async function emitRecommendationConflictDetectedEvent(
  ctx: OperationsViewTelemetryContext,
  conflict: RecommendationConflict,
): Promise<void> {
  await safeEmitTelemetry(
    ctx.emitter,
    buildWorkforceEvent({
      eventId: createEventId(),
      eventType: "escalation",
      timestamp: ctx.now(),
      correlationId: ctx.correlationId,
      orgId: ctx.orgId,
      status: "escalated",
      metadata: {
        phase: "recommendation_conflict_detected",
        conflictId: conflict.id,
        involvedTeamIds: conflict.involvedTeamIds,
        recommendationIds: conflict.recommendationIds,
      },
    }),
  );
}

export async function emitManagerEvidenceUpdatedEvent(
  ctx: OperationsViewTelemetryContext,
  evidence: ManagerRecommendationEvidence,
): Promise<void> {
  await safeEmitTelemetry(
    ctx.emitter,
    buildWorkforceEvent({
      eventId: createEventId(),
      eventType: "customer_response",
      timestamp: ctx.now(),
      correlationId: ctx.correlationId,
      orgId: ctx.orgId,
      status: "completed",
      metadata: {
        phase: "manager_evidence_updated",
        status: evidence.status,
        eligible: evidence.eligible,
        activeTeamCount: evidence.activeTeamCount,
        unresolvedConflictFrequency: evidence.unresolvedConflictFrequency,
      },
    }),
  );
}

export async function emitOperationsViewTelemetry(
  ctx: OperationsViewTelemetryContext,
  input: {
    hiredTeamIds: string[];
    crossTeamSignals: CrossTeamSignal[];
    conflicts: RecommendationConflict[];
    managerEvidence: ManagerRecommendationEvidence;
  },
): Promise<void> {
  await emitOperationsViewBuiltEvent(ctx, {
    hiredTeamIds: input.hiredTeamIds,
    signalCount: input.crossTeamSignals.length,
    conflictCount: input.conflicts.length,
  });

  for (const signal of input.crossTeamSignals) {
    await emitCrossTeamSignalDetectedEvent(ctx, signal);
  }

  for (const conflict of input.conflicts) {
    await emitRecommendationConflictDetectedEvent(ctx, conflict);
  }

  await emitManagerEvidenceUpdatedEvent(ctx, input.managerEvidence);
}
