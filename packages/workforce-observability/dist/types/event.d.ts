import { z } from "zod";
export declare const workforceEventTypeSchema: z.ZodEnum<["customer_request", "routing_decision", "team_execution", "specialist_execution", "tool_execution", "escalation", "team_synthesis", "customer_response"]>;
export type WorkforceEventType = z.infer<typeof workforceEventTypeSchema>;
export declare const workforceEventStatusSchema: z.ZodEnum<["started", "completed", "failed", "denied", "escalated"]>;
export type WorkforceEventStatus = z.infer<typeof workforceEventStatusSchema>;
export declare const workforceConfidenceSchema: z.ZodObject<{
    level: z.ZodEnum<["high", "medium", "low"]>;
    score: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    level: "high" | "medium" | "low";
    score?: number | undefined;
}, {
    level: "high" | "medium" | "low";
    score?: number | undefined;
}>;
export type WorkforceEventConfidence = z.infer<typeof workforceConfidenceSchema>;
export declare const workforceEventBaseSchema: z.ZodObject<{
    eventId: z.ZodString;
    eventType: z.ZodEnum<["customer_request", "routing_decision", "team_execution", "specialist_execution", "tool_execution", "escalation", "team_synthesis", "customer_response"]>;
    timestamp: z.ZodString;
    correlationId: z.ZodString;
    orgId: z.ZodString;
    teamId: z.ZodOptional<z.ZodString>;
    specialistId: z.ZodOptional<z.ZodString>;
    durationMs: z.ZodOptional<z.ZodNumber>;
    confidence: z.ZodOptional<z.ZodObject<{
        level: z.ZodEnum<["high", "medium", "low"]>;
        score: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        level: "high" | "medium" | "low";
        score?: number | undefined;
    }, {
        level: "high" | "medium" | "low";
        score?: number | undefined;
    }>>;
    status: z.ZodEnum<["started", "completed", "failed", "denied", "escalated"]>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    status: "completed" | "escalated" | "started" | "failed" | "denied";
    orgId: string;
    eventId: string;
    eventType: "customer_request" | "routing_decision" | "team_execution" | "specialist_execution" | "tool_execution" | "escalation" | "team_synthesis" | "customer_response";
    timestamp: string;
    correlationId: string;
    metadata?: Record<string, unknown> | undefined;
    teamId?: string | undefined;
    specialistId?: string | undefined;
    durationMs?: number | undefined;
    confidence?: {
        level: "high" | "medium" | "low";
        score?: number | undefined;
    } | undefined;
}, {
    status: "completed" | "escalated" | "started" | "failed" | "denied";
    orgId: string;
    eventId: string;
    eventType: "customer_request" | "routing_decision" | "team_execution" | "specialist_execution" | "tool_execution" | "escalation" | "team_synthesis" | "customer_response";
    timestamp: string;
    correlationId: string;
    metadata?: Record<string, unknown> | undefined;
    teamId?: string | undefined;
    specialistId?: string | undefined;
    durationMs?: number | undefined;
    confidence?: {
        level: "high" | "medium" | "low";
        score?: number | undefined;
    } | undefined;
}>;
export type WorkforceEventBase = z.infer<typeof workforceEventBaseSchema>;
export declare const workforceEventSchema: z.ZodObject<{
    eventId: z.ZodString;
    eventType: z.ZodEnum<["customer_request", "routing_decision", "team_execution", "specialist_execution", "tool_execution", "escalation", "team_synthesis", "customer_response"]>;
    timestamp: z.ZodString;
    correlationId: z.ZodString;
    orgId: z.ZodString;
    teamId: z.ZodOptional<z.ZodString>;
    specialistId: z.ZodOptional<z.ZodString>;
    durationMs: z.ZodOptional<z.ZodNumber>;
    confidence: z.ZodOptional<z.ZodObject<{
        level: z.ZodEnum<["high", "medium", "low"]>;
        score: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        level: "high" | "medium" | "low";
        score?: number | undefined;
    }, {
        level: "high" | "medium" | "low";
        score?: number | undefined;
    }>>;
    status: z.ZodEnum<["started", "completed", "failed", "denied", "escalated"]>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    status: "completed" | "escalated" | "started" | "failed" | "denied";
    orgId: string;
    eventId: string;
    eventType: "customer_request" | "routing_decision" | "team_execution" | "specialist_execution" | "tool_execution" | "escalation" | "team_synthesis" | "customer_response";
    timestamp: string;
    correlationId: string;
    metadata?: Record<string, unknown> | undefined;
    teamId?: string | undefined;
    specialistId?: string | undefined;
    durationMs?: number | undefined;
    confidence?: {
        level: "high" | "medium" | "low";
        score?: number | undefined;
    } | undefined;
}, {
    status: "completed" | "escalated" | "started" | "failed" | "denied";
    orgId: string;
    eventId: string;
    eventType: "customer_request" | "routing_decision" | "team_execution" | "specialist_execution" | "tool_execution" | "escalation" | "team_synthesis" | "customer_response";
    timestamp: string;
    correlationId: string;
    metadata?: Record<string, unknown> | undefined;
    teamId?: string | undefined;
    specialistId?: string | undefined;
    durationMs?: number | undefined;
    confidence?: {
        level: "high" | "medium" | "low";
        score?: number | undefined;
    } | undefined;
}>;
export type WorkforceEvent = z.infer<typeof workforceEventSchema>;
