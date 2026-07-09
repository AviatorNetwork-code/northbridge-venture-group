import { z } from "zod";
import { assignmentIdSchema, isoDateTimeSchema, organizationIdSchema, } from "./primitives.js";
import { workforceRoleSchema } from "./roles.js";
export const assignmentScopeTypeSchema = z.enum([
    "team",
    "department",
    "organization",
]);
/**
 * Links a workforce role instance to an organizational scope.
 * Used for hierarchy construction and permission inheritance.
 */
export const workforceAssignmentSchema = z
    .object({
    id: assignmentIdSchema,
    orgId: organizationIdSchema,
    assigneeRole: workforceRoleSchema,
    assigneeId: z.string().min(1).max(128),
    scopeType: assignmentScopeTypeSchema,
    scopeId: z.string().min(1).max(128),
    effectiveFrom: isoDateTimeSchema,
    effectiveTo: isoDateTimeSchema.optional(),
})
    .strict();
export function parseWorkforceAssignment(input) {
    return workforceAssignmentSchema.parse(input);
}
export function safeParseWorkforceAssignment(input) {
    return workforceAssignmentSchema.safeParse(input);
}
