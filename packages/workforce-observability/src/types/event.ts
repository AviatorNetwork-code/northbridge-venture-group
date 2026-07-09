import { z } from "zod";
import { isoDateTimeSchema, organizationIdSchema } from "@northbridge/workforce-contracts";

export const workforceEventTypeSchema = z.enum([
  "customer_request",
  "routing_decision",
  "team_execution",
  "specialist_execution",
  "tool_execution",
  "escalation",
  "team_synthesis",
  "customer_response",
]);

export type WorkforceEventType = z.infer<typeof workforceEventTypeSchema>;

export const workforceEventStatusSchema = z.enum([
  "started",
  "completed",
  "failed",
  "denied",
  "escalated",
]);

export type WorkforceEventStatus = z.infer<typeof workforceEventStatusSchema>;

export const workforceConfidenceSchema = z.object({
  level: z.enum(["high", "medium", "low"]),
  score: z.number().min(0).max(1).optional(),
});

export type WorkforceEventConfidence = z.infer<typeof workforceConfidenceSchema>;

export const workforceEventBaseSchema = z.object({
  eventId: z.string().min(1).max(128),
  eventType: workforceEventTypeSchema,
  timestamp: isoDateTimeSchema,
  correlationId: z.string().min(1).max(128),
  orgId: organizationIdSchema,
  teamId: z.string().min(1).max(128).optional(),
  specialistId: z.string().min(1).max(128).optional(),
  durationMs: z.number().nonnegative().optional(),
  confidence: workforceConfidenceSchema.optional(),
  status: workforceEventStatusSchema,
  metadata: z.record(z.unknown()).optional(),
});

export type WorkforceEventBase = z.infer<typeof workforceEventBaseSchema>;

export const workforceEventSchema = workforceEventBaseSchema;

export type WorkforceEvent = z.infer<typeof workforceEventSchema>;
