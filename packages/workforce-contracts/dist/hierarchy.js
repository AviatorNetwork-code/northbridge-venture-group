import { z } from "zod";
import { directorIdSchema, managerIdSchema, organizationIdSchema, teamIdSchema, vicePresidentIdSchema, } from "./primitives.js";
export const teamHierarchyNodeSchema = z
    .object({
    teamId: teamIdSchema,
    teamLeadId: z.string().min(1).max(128),
    specialistIds: z.array(z.string().min(1).max(128)).default([]),
})
    .strict();
export const managerHierarchyNodeSchema = z
    .object({
    managerId: managerIdSchema,
    supervisedTeamIds: z.array(teamIdSchema).default([]),
})
    .strict();
export const directorHierarchyNodeSchema = z
    .object({
    directorId: directorIdSchema,
    supervisedManagerIds: z.array(managerIdSchema).default([]),
})
    .strict();
export const vicePresidentHierarchyNodeSchema = z
    .object({
    vicePresidentId: vicePresidentIdSchema,
    supervisedDirectorIds: z.array(directorIdSchema).default([]),
})
    .strict();
/**
 * Customer organizational hierarchy snapshot.
 * Excludes Nordi (Level 0 external representative).
 */
export const organizationHierarchySchema = z
    .object({
    orgId: organizationIdSchema,
    version: z.number().int().min(1),
    teams: z.array(teamHierarchyNodeSchema).default([]),
    managers: z.array(managerHierarchyNodeSchema).optional(),
    directors: z.array(directorHierarchyNodeSchema).optional(),
    vicePresidents: z.array(vicePresidentHierarchyNodeSchema).optional(),
    generatedAt: z.string().datetime({ offset: true }),
})
    .strict();
export function parseOrganizationHierarchy(input) {
    return organizationHierarchySchema.parse(input);
}
export function safeParseOrganizationHierarchy(input) {
    return organizationHierarchySchema.safeParse(input);
}
