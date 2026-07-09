import { z } from "zod";
import {
  assignmentIdSchema,
  isoDateTimeSchema,
  organizationIdSchema,
} from "./primitives.js";
import { workforceRoleSchema } from "./roles.js";

export const assignmentScopeTypeSchema = z.enum([
  "team",
  "department",
  "organization",
]);

export type AssignmentScopeType = z.infer<typeof assignmentScopeTypeSchema>;

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

export type WorkforceAssignment = z.infer<typeof workforceAssignmentSchema>;

export function parseWorkforceAssignment(input: unknown): WorkforceAssignment {
  return workforceAssignmentSchema.parse(input);
}

export function safeParseWorkforceAssignment(input: unknown) {
  return workforceAssignmentSchema.safeParse(input);
}
