import { describe, expect, it } from "vitest";
import {
  buildWorkforceEvent,
  createCorrelationId,
  InMemoryWorkforceTelemetryEmitter,
  parseWorkforceEvent,
  workforceEventTypeSchema,
} from "../src/index.js";

const NOW = "2026-07-09T20:00:00.000Z";

describe("@northbridge/workforce-observability", () => {
  it("defines eight workforce event types", () => {
    expect(workforceEventTypeSchema.options).toHaveLength(8);
    expect(workforceEventTypeSchema.options).toContain("routing_decision");
    expect(workforceEventTypeSchema.options).toContain("tool_execution");
  });

  it("builds and validates telemetry events", () => {
    const correlationId = createCorrelationId();
    const event = buildWorkforceEvent({
      eventId: "evt-1",
      eventType: "specialist_execution",
      timestamp: NOW,
      correlationId,
      orgId: "org-1",
      teamId: "team-1",
      specialistId: "sp-1",
      durationMs: 42,
      confidence: { level: "high", score: 0.9 },
      status: "completed",
      metadata: { taskId: "task-1" },
    });

    const parsed = parseWorkforceEvent(event);
    expect(parsed.eventType).toBe("specialist_execution");
    expect(parsed.correlationId).toBe(correlationId);
  });

  it("records events in memory emitter", () => {
    const emitter = new InMemoryWorkforceTelemetryEmitter();
    const correlationId = createCorrelationId();

    emitter.emit(
      buildWorkforceEvent({
        eventId: "evt-1",
        eventType: "customer_request",
        timestamp: NOW,
        correlationId,
        orgId: "org-1",
        status: "started",
      }),
    );
    emitter.emit(
      buildWorkforceEvent({
        eventId: "evt-2",
        eventType: "routing_decision",
        timestamp: NOW,
        correlationId,
        orgId: "org-1",
        status: "completed",
        metadata: { ownerType: "team" },
      }),
    );

    expect(emitter.listByCorrelation(correlationId)).toHaveLength(2);
    expect(emitter.listByType("routing_decision")).toHaveLength(1);
  });
});
