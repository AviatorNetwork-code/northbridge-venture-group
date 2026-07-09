import { z } from "zod";
/**
 * Workforce roles within a customer organization.
 * Nordi is intentionally excluded — Nordi is outside the customer hierarchy.
 */
export declare const workforceRoleSchema: z.ZodEnum<["team_lead", "specialist", "manager", "director", "vice_president"]>;
export type WorkforceRole = z.infer<typeof workforceRoleSchema>;
export declare const specialistPermissionsSchema: z.ZodObject<{
    canDo: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    cannotDo: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
}, "strict", z.ZodTypeAny, {
    canDo: string[];
    cannotDo: string[];
}, {
    canDo?: string[] | undefined;
    cannotDo?: string[] | undefined;
}>;
export type SpecialistPermissions = z.infer<typeof specialistPermissionsSchema>;
export declare const teamLeadSchema: z.ZodObject<{
    id: z.ZodString;
    orgId: z.ZodString;
    teamId: z.ZodString;
    role: z.ZodLiteral<"team_lead">;
    status: z.ZodEnum<["provisioned", "active", "suspended", "deprovisioned"]>;
    displayName: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    status: "provisioned" | "active" | "suspended" | "deprovisioned";
    id: string;
    orgId: string;
    teamId: string;
    role: "team_lead";
    displayName?: string | undefined;
}, {
    status: "provisioned" | "active" | "suspended" | "deprovisioned";
    id: string;
    orgId: string;
    teamId: string;
    role: "team_lead";
    displayName?: string | undefined;
}>;
export type TeamLead = z.infer<typeof teamLeadSchema>;
export declare const specialistSchema: z.ZodObject<{
    id: z.ZodString;
    orgId: z.ZodString;
    teamId: z.ZodString;
    specialistDefinitionId: z.ZodString;
    role: z.ZodLiteral<"specialist">;
    tier: z.ZodOptional<z.ZodEnum<["essential", "pro", "elite"]>>;
    permissions: z.ZodObject<{
        canDo: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        cannotDo: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    }, "strict", z.ZodTypeAny, {
        canDo: string[];
        cannotDo: string[];
    }, {
        canDo?: string[] | undefined;
        cannotDo?: string[] | undefined;
    }>;
    status: z.ZodEnum<["provisioned", "active", "suspended", "deprovisioned"]>;
}, "strict", z.ZodTypeAny, {
    status: "provisioned" | "active" | "suspended" | "deprovisioned";
    id: string;
    orgId: string;
    teamId: string;
    role: "specialist";
    specialistDefinitionId: string;
    permissions: {
        canDo: string[];
        cannotDo: string[];
    };
    tier?: "essential" | "pro" | "elite" | undefined;
}, {
    status: "provisioned" | "active" | "suspended" | "deprovisioned";
    id: string;
    orgId: string;
    teamId: string;
    role: "specialist";
    specialistDefinitionId: string;
    permissions: {
        canDo?: string[] | undefined;
        cannotDo?: string[] | undefined;
    };
    tier?: "essential" | "pro" | "elite" | undefined;
}>;
export type Specialist = z.infer<typeof specialistSchema>;
export declare const managerSchema: z.ZodObject<{
    id: z.ZodString;
    orgId: z.ZodString;
    role: z.ZodLiteral<"manager">;
    supervisedTeamIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    status: z.ZodEnum<["provisioned", "active", "suspended", "deprovisioned"]>;
    displayName: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    status: "provisioned" | "active" | "suspended" | "deprovisioned";
    id: string;
    orgId: string;
    role: "manager";
    supervisedTeamIds: string[];
    displayName?: string | undefined;
}, {
    status: "provisioned" | "active" | "suspended" | "deprovisioned";
    id: string;
    orgId: string;
    role: "manager";
    displayName?: string | undefined;
    supervisedTeamIds?: string[] | undefined;
}>;
export type Manager = z.infer<typeof managerSchema>;
export declare const directorSchema: z.ZodObject<{
    id: z.ZodString;
    orgId: z.ZodString;
    role: z.ZodLiteral<"director">;
    supervisedManagerIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    status: z.ZodEnum<["provisioned", "active", "suspended", "deprovisioned"]>;
    displayName: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    status: "provisioned" | "active" | "suspended" | "deprovisioned";
    id: string;
    orgId: string;
    role: "director";
    supervisedManagerIds: string[];
    displayName?: string | undefined;
}, {
    status: "provisioned" | "active" | "suspended" | "deprovisioned";
    id: string;
    orgId: string;
    role: "director";
    displayName?: string | undefined;
    supervisedManagerIds?: string[] | undefined;
}>;
export type Director = z.infer<typeof directorSchema>;
export declare const vicePresidentSchema: z.ZodObject<{
    id: z.ZodString;
    orgId: z.ZodString;
    role: z.ZodLiteral<"vice_president">;
    supervisedDirectorIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    status: z.ZodEnum<["provisioned", "active", "suspended", "deprovisioned"]>;
    displayName: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    status: "provisioned" | "active" | "suspended" | "deprovisioned";
    id: string;
    orgId: string;
    role: "vice_president";
    supervisedDirectorIds: string[];
    displayName?: string | undefined;
}, {
    status: "provisioned" | "active" | "suspended" | "deprovisioned";
    id: string;
    orgId: string;
    role: "vice_president";
    displayName?: string | undefined;
    supervisedDirectorIds?: string[] | undefined;
}>;
export type VicePresident = z.infer<typeof vicePresidentSchema>;
export declare function parseTeamLead(input: unknown): TeamLead;
export declare function parseSpecialist(input: unknown): Specialist;
export declare function parseManager(input: unknown): Manager;
export declare function parseDirector(input: unknown): Director;
export declare function parseVicePresident(input: unknown): VicePresident;
