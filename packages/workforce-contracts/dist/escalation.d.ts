import { z } from "zod";
export declare const escalationStatusSchema: z.ZodEnum<["open", "acknowledged", "resolved", "closed"]>;
export type EscalationStatus = z.infer<typeof escalationStatusSchema>;
/**
 * Structured escalation between workforce roles.
 */
export declare const escalationSchema: z.ZodObject<{
    id: z.ZodString;
    orgId: z.ZodString;
    sourceRole: z.ZodEnum<["team_lead", "specialist", "manager", "director", "vice_president"]>;
    sourceId: z.ZodString;
    targetRole: z.ZodEnum<["team_lead", "specialist", "manager", "director", "vice_president"]>;
    targetId: z.ZodString;
    reason: z.ZodString;
    status: z.ZodDefault<z.ZodEnum<["open", "acknowledged", "resolved", "closed"]>>;
    createdAt: z.ZodString;
    resolvedAt: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    status: "open" | "acknowledged" | "resolved" | "closed";
    createdAt: string;
    id: string;
    orgId: string;
    sourceRole: "team_lead" | "specialist" | "manager" | "director" | "vice_president";
    sourceId: string;
    targetRole: "team_lead" | "specialist" | "manager" | "director" | "vice_president";
    targetId: string;
    reason: string;
    resolvedAt?: string | undefined;
}, {
    createdAt: string;
    id: string;
    orgId: string;
    sourceRole: "team_lead" | "specialist" | "manager" | "director" | "vice_president";
    sourceId: string;
    targetRole: "team_lead" | "specialist" | "manager" | "director" | "vice_president";
    targetId: string;
    reason: string;
    status?: "open" | "acknowledged" | "resolved" | "closed" | undefined;
    resolvedAt?: string | undefined;
}>;
export type Escalation = z.infer<typeof escalationSchema>;
export declare function parseEscalation(input: unknown): Escalation;
export declare function safeParseEscalation(input: unknown): z.SafeParseReturnType<{
    createdAt: string;
    id: string;
    orgId: string;
    sourceRole: "team_lead" | "specialist" | "manager" | "director" | "vice_president";
    sourceId: string;
    targetRole: "team_lead" | "specialist" | "manager" | "director" | "vice_president";
    targetId: string;
    reason: string;
    status?: "open" | "acknowledged" | "resolved" | "closed" | undefined;
    resolvedAt?: string | undefined;
}, {
    status: "open" | "acknowledged" | "resolved" | "closed";
    createdAt: string;
    id: string;
    orgId: string;
    sourceRole: "team_lead" | "specialist" | "manager" | "director" | "vice_president";
    sourceId: string;
    targetRole: "team_lead" | "specialist" | "manager" | "director" | "vice_president";
    targetId: string;
    reason: string;
    resolvedAt?: string | undefined;
}>;
