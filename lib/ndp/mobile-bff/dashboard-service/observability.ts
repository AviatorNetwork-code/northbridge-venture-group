import { safeEmitTelemetry } from "@/lib/ndp/conversation-router/observability/safe-emit";
import {
  buildWorkforceEvent,
  createEventId,
  type WorkforceTelemetryEmitter,
} from "@northbridge/workforce-observability";
import type {
  MobileDashboardTelemetryEmitter,
  MobileDashboardTelemetryEvent,
} from "./types.js";

export class WorkforceMobileDashboardTelemetryEmitter implements MobileDashboardTelemetryEmitter {
  constructor(
    private readonly emitter: WorkforceTelemetryEmitter,
    private readonly now: () => string = () => new Date().toISOString(),
  ) {}

  async emit(event: MobileDashboardTelemetryEvent): Promise<void> {
    await safeEmitTelemetry(
      this.emitter,
      buildWorkforceEvent({
        eventId: createEventId(),
        eventType: "customer_response",
        timestamp: this.now(),
        correlationId: event.correlationId,
        orgId: event.organizationId,
        status: event.status === "completed" ? "completed" : "failed",
        metadata: {
          phase: event.phase,
          customerId: event.customerId,
          durationMs: event.durationMs,
          ...event.metadata,
        },
      }),
    );
  }
}

export class InMemoryMobileDashboardTelemetryEmitter implements MobileDashboardTelemetryEmitter {
  readonly events: MobileDashboardTelemetryEvent[] = [];

  async emit(event: MobileDashboardTelemetryEvent): Promise<void> {
    this.events.push(event);
  }
}

export async function emitMobileDashboardTelemetry(
  emitter: MobileDashboardTelemetryEmitter | undefined,
  event: MobileDashboardTelemetryEvent,
): Promise<void> {
  if (!emitter) return;

  try {
    await emitter.emit(event);
  } catch {
    // Telemetry must never block dashboard responses.
  }
}
