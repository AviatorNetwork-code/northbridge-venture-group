import {
  buildWorkforceEvent,
  createEventId,
  type WorkforceTelemetryEmitter,
} from "@northbridge/workforce-observability";
import type { CapabilityResolutionResult } from "../types/resolution.js";

export interface EmitConnectorResolutionInput {
  emitter: WorkforceTelemetryEmitter;
  correlationId: string;
  orgId: string;
  result: CapabilityResolutionResult;
  now: () => string;
}

/**
 * Emits metadata-compatible tool_execution events for connector resolution only.
 * Does not emit provider execution telemetry.
 */
export async function emitConnectorResolutionEvent(
  input: EmitConnectorResolutionInput,
): Promise<void> {
  const { emitter, correlationId, orgId, result, now } = input;

  const status =
    result.status === "resolved" || result.status === "fallback"
      ? "completed"
      : result.status === "not_found"
        ? "denied"
        : "failed";

  try {
    await emitter.emit(
      buildWorkforceEvent({
        eventId: createEventId(),
        eventType: "tool_execution",
        timestamp: now(),
        correlationId,
        orgId,
        status,
        metadata: {
          phase: "connector_resolution",
          resolutionOnly: true,
          capabilityId: result.capabilityId,
          providerId: result.providerId,
          connectorId: result.connectorId,
          resolutionStatus: result.status,
          selectionReason: result.selectionReason,
          attemptedProviderIds: result.attemptedProviderIds,
          region: result.region,
        },
      }),
    );
  } catch {
    // Resolution telemetry must not block availability resolution.
  }
}
