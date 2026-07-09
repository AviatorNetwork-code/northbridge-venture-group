import type { WorkforceEvent } from "@northbridge/workforce-observability";
import type { WorkforceTelemetryEmitter } from "@northbridge/workforce-observability";

/**
 * Never throws — telemetry failures must not block customer responses.
 */
export async function safeEmitTelemetry(
  emitter: WorkforceTelemetryEmitter,
  event: WorkforceEvent,
): Promise<void> {
  try {
    await emitter.emit(event);
  } catch {
    // Swallow telemetry errors by design.
  }
}
