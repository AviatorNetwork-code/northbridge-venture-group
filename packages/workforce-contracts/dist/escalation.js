import { z } from "zod";
import { escalationIdSchema, organizationIdSchema } from "./primitives.js";
import { workforceRoleSchema } from "./roles.js";
export const escalationStatusSchema = z.enum([
    "open",
    "acknowledged",
    "resolved",
    "closed",
]);
/**
 * Structured escalation between workforce roles.
 */
export const escalationSchema = z
    .object({
    id: escalationIdSchema,
    orgId: organizationIdSchema,
    sourceRole: workforceRoleSchema,
    sourceId: z.string().min(1).max(128),
    targetRole: workforceRoleSchema,
    targetId: z.string().min(1).max(128),
    reason: z.string().min(1).max(2048),
    status: escalationStatusSchema.default("open"),
    createdAt: z.string().datetime({ offset: true }),
    resolvedAt: z.string().datetime({ offset: true }).optional(),
})
    .strict();
export function parseEscalation(input) {
    return escalationSchema.parse(input);
}
export function safeParseEscalation(input) {
    return escalationSchema.safeParse(input);
}
