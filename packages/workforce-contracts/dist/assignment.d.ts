import { z } from "zod";
export declare const assignmentScopeTypeSchema: z.ZodEnum<["team", "department", "organization"]>;
export type AssignmentScopeType = z.infer<typeof assignmentScopeTypeSchema>;
/**
 * Links a workforce role instance to an organizational scope.
 * Used for hierarchy construction and permission inheritance.
 */
export declare const workforceAssignmentSchema: z.ZodObject<{
    id: z.ZodString;
    orgId: z.ZodString;
    assigneeRole: z.ZodEnum<["team_lead", "specialist", "manager", "director", "vice_president"]>;
    assigneeId: z.ZodString;
    scopeType: z.ZodEnum<["team", "department", "organization"]>;
    scopeId: z.ZodString;
    effectiveFrom: z.ZodString;
    effectiveTo: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    id: string;
    orgId: string;
    assigneeRole: "team_lead" | "specialist" | "manager" | "director" | "vice_president";
    assigneeId: string;
    scopeType: "team" | "department" | "organization";
    scopeId: string;
    effectiveFrom: string;
    effectiveTo?: string | undefined;
}, {
    id: string;
    orgId: string;
    assigneeRole: "team_lead" | "specialist" | "manager" | "director" | "vice_president";
    assigneeId: string;
    scopeType: "team" | "department" | "organization";
    scopeId: string;
    effectiveFrom: string;
    effectiveTo?: string | undefined;
}>;
export type WorkforceAssignment = z.infer<typeof workforceAssignmentSchema>;
export declare function parseWorkforceAssignment(input: unknown): WorkforceAssignment;
export declare function safeParseWorkforceAssignment(input: unknown): z.SafeParseReturnType<{
    id: string;
    orgId: string;
    assigneeRole: "team_lead" | "specialist" | "manager" | "director" | "vice_president";
    assigneeId: string;
    scopeType: "team" | "department" | "organization";
    scopeId: string;
    effectiveFrom: string;
    effectiveTo?: string | undefined;
}, {
    id: string;
    orgId: string;
    assigneeRole: "team_lead" | "specialist" | "manager" | "director" | "vice_president";
    assigneeId: string;
    scopeType: "team" | "department" | "organization";
    scopeId: string;
    effectiveFrom: string;
    effectiveTo?: string | undefined;
}>;
