import { z } from "zod";
import { entityStatusSchema, organizationIdSchema, teamIdSchema, teamLeadIdSchema, teamProductIdSchema, } from "./primitives.js";
import { specialistIdSchema } from "./primitives.js";
/**
 * A hired team product instance within a customer organization.
 * Teams are customer-facing products; specialists are internal to the team.
 */
export const teamSchema = z
    .object({
    id: teamIdSchema,
    orgId: organizationIdSchema,
    teamProductId: teamProductIdSchema,
    name: z.string().min(1).max(256),
    status: entityStatusSchema,
    teamLeadId: teamLeadIdSchema,
    specialistIds: z.array(specialistIdSchema).default([]),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }),
})
    .strict();
export function parseTeam(input) {
    return teamSchema.parse(input);
}
export function safeParseTeam(input) {
    return teamSchema.safeParse(input);
}
