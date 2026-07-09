import { z } from "zod";
import { organizationIdSchema, specialistIdSchema, taskIdSchema, teamIdSchema, teamLeadIdSchema, } from "./primitives.js";
import { specialistPermissionsSchema } from "./roles.js";
export const taskStatusSchema = z.enum([
    "pending",
    "accepted",
    "in_progress",
    "completed",
    "rejected",
    "escalated",
]);
/**
 * Internal work unit delegated from Team Lead to Specialist.
 * @see docs/northbridge-digital-workforce-communication-protocol-v1.md Layer 3
 */
export const taskSchema = z
    .object({
    id: taskIdSchema,
    orgId: organizationIdSchema,
    teamId: teamIdSchema,
    specialistId: specialistIdSchema.optional(),
    assignedByTeamLeadId: teamLeadIdSchema,
    status: taskStatusSchema,
    permissions: specialistPermissionsSchema,
    context: z.record(z.unknown()).default({}),
    deadline: z.string().datetime({ offset: true }).optional(),
    customerThreadRef: z.string().min(1).max(128).optional(),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }),
})
    .strict();
export const taskArtifactSchema = z
    .object({
    id: z.string().min(1).max(128),
    type: z.string().min(1).max(64),
    uri: z.string().min(1).max(2048).optional(),
    label: z.string().min(1).max(256).optional(),
})
    .strict();
export const taskResultSchema = z
    .object({
    taskId: taskIdSchema,
    summary: z.string().min(1).max(8192),
    evidence: z.array(z.string().min(1).max(128)).default([]),
    artifacts: z.array(taskArtifactSchema).default([]),
    escalationId: z.string().min(1).max(128).optional(),
    completedAt: z.string().datetime({ offset: true }),
})
    .strict();
export function parseTask(input) {
    return taskSchema.parse(input);
}
export function parseTaskResult(input) {
    return taskResultSchema.parse(input);
}
export function safeParseTask(input) {
    return taskSchema.safeParse(input);
}
