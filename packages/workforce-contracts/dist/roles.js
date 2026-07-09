import { z } from "zod";
import { directorIdSchema, entityStatusSchema, managerIdSchema, organizationIdSchema, specialistDefinitionIdSchema, specialistIdSchema, teamIdSchema, teamLeadIdSchema, vicePresidentIdSchema, workforceTierSchema, } from "./primitives.js";
/**
 * Workforce roles within a customer organization.
 * Nordi is intentionally excluded — Nordi is outside the customer hierarchy.
 */
export const workforceRoleSchema = z.enum([
    "team_lead",
    "specialist",
    "manager",
    "director",
    "vice_president",
]);
export const specialistPermissionsSchema = z
    .object({
    canDo: z.array(z.string().min(1)).default([]),
    cannotDo: z.array(z.string().min(1)).default([]),
})
    .strict();
export const teamLeadSchema = z
    .object({
    id: teamLeadIdSchema,
    orgId: organizationIdSchema,
    teamId: teamIdSchema,
    role: z.literal("team_lead"),
    status: entityStatusSchema,
    displayName: z.string().min(1).max(256).optional(),
})
    .strict();
export const specialistSchema = z
    .object({
    id: specialistIdSchema,
    orgId: organizationIdSchema,
    teamId: teamIdSchema,
    specialistDefinitionId: specialistDefinitionIdSchema,
    role: z.literal("specialist"),
    tier: workforceTierSchema.optional(),
    permissions: specialistPermissionsSchema,
    status: entityStatusSchema,
})
    .strict();
export const managerSchema = z
    .object({
    id: managerIdSchema,
    orgId: organizationIdSchema,
    role: z.literal("manager"),
    supervisedTeamIds: z.array(teamIdSchema).default([]),
    status: entityStatusSchema,
    displayName: z.string().min(1).max(256).optional(),
})
    .strict();
export const directorSchema = z
    .object({
    id: directorIdSchema,
    orgId: organizationIdSchema,
    role: z.literal("director"),
    supervisedManagerIds: z.array(managerIdSchema).default([]),
    status: entityStatusSchema,
    displayName: z.string().min(1).max(256).optional(),
})
    .strict();
export const vicePresidentSchema = z
    .object({
    id: vicePresidentIdSchema,
    orgId: organizationIdSchema,
    role: z.literal("vice_president"),
    supervisedDirectorIds: z.array(directorIdSchema).default([]),
    status: entityStatusSchema,
    displayName: z.string().min(1).max(256).optional(),
})
    .strict();
export function parseTeamLead(input) {
    return teamLeadSchema.parse(input);
}
export function parseSpecialist(input) {
    return specialistSchema.parse(input);
}
export function parseManager(input) {
    return managerSchema.parse(input);
}
export function parseDirector(input) {
    return directorSchema.parse(input);
}
export function parseVicePresident(input) {
    return vicePresidentSchema.parse(input);
}
