import { z } from "zod";
export declare const teamHierarchyNodeSchema: z.ZodObject<{
    teamId: z.ZodString;
    teamLeadId: z.ZodString;
    specialistIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
}, "strict", z.ZodTypeAny, {
    teamId: string;
    teamLeadId: string;
    specialistIds: string[];
}, {
    teamId: string;
    teamLeadId: string;
    specialistIds?: string[] | undefined;
}>;
export type TeamHierarchyNode = z.infer<typeof teamHierarchyNodeSchema>;
export declare const managerHierarchyNodeSchema: z.ZodObject<{
    managerId: z.ZodString;
    supervisedTeamIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
}, "strict", z.ZodTypeAny, {
    supervisedTeamIds: string[];
    managerId: string;
}, {
    managerId: string;
    supervisedTeamIds?: string[] | undefined;
}>;
export type ManagerHierarchyNode = z.infer<typeof managerHierarchyNodeSchema>;
export declare const directorHierarchyNodeSchema: z.ZodObject<{
    directorId: z.ZodString;
    supervisedManagerIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
}, "strict", z.ZodTypeAny, {
    supervisedManagerIds: string[];
    directorId: string;
}, {
    directorId: string;
    supervisedManagerIds?: string[] | undefined;
}>;
export type DirectorHierarchyNode = z.infer<typeof directorHierarchyNodeSchema>;
export declare const vicePresidentHierarchyNodeSchema: z.ZodObject<{
    vicePresidentId: z.ZodString;
    supervisedDirectorIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
}, "strict", z.ZodTypeAny, {
    supervisedDirectorIds: string[];
    vicePresidentId: string;
}, {
    vicePresidentId: string;
    supervisedDirectorIds?: string[] | undefined;
}>;
export type VicePresidentHierarchyNode = z.infer<typeof vicePresidentHierarchyNodeSchema>;
/**
 * Customer organizational hierarchy snapshot.
 * Excludes Nordi (Level 0 external representative).
 */
export declare const organizationHierarchySchema: z.ZodObject<{
    orgId: z.ZodString;
    version: z.ZodNumber;
    teams: z.ZodDefault<z.ZodArray<z.ZodObject<{
        teamId: z.ZodString;
        teamLeadId: z.ZodString;
        specialistIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    }, "strict", z.ZodTypeAny, {
        teamId: string;
        teamLeadId: string;
        specialistIds: string[];
    }, {
        teamId: string;
        teamLeadId: string;
        specialistIds?: string[] | undefined;
    }>, "many">>;
    managers: z.ZodOptional<z.ZodArray<z.ZodObject<{
        managerId: z.ZodString;
        supervisedTeamIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    }, "strict", z.ZodTypeAny, {
        supervisedTeamIds: string[];
        managerId: string;
    }, {
        managerId: string;
        supervisedTeamIds?: string[] | undefined;
    }>, "many">>;
    directors: z.ZodOptional<z.ZodArray<z.ZodObject<{
        directorId: z.ZodString;
        supervisedManagerIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    }, "strict", z.ZodTypeAny, {
        supervisedManagerIds: string[];
        directorId: string;
    }, {
        directorId: string;
        supervisedManagerIds?: string[] | undefined;
    }>, "many">>;
    vicePresidents: z.ZodOptional<z.ZodArray<z.ZodObject<{
        vicePresidentId: z.ZodString;
        supervisedDirectorIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    }, "strict", z.ZodTypeAny, {
        supervisedDirectorIds: string[];
        vicePresidentId: string;
    }, {
        vicePresidentId: string;
        supervisedDirectorIds?: string[] | undefined;
    }>, "many">>;
    generatedAt: z.ZodString;
}, "strict", z.ZodTypeAny, {
    orgId: string;
    version: number;
    teams: {
        teamId: string;
        teamLeadId: string;
        specialistIds: string[];
    }[];
    generatedAt: string;
    managers?: {
        supervisedTeamIds: string[];
        managerId: string;
    }[] | undefined;
    directors?: {
        supervisedManagerIds: string[];
        directorId: string;
    }[] | undefined;
    vicePresidents?: {
        supervisedDirectorIds: string[];
        vicePresidentId: string;
    }[] | undefined;
}, {
    orgId: string;
    version: number;
    generatedAt: string;
    teams?: {
        teamId: string;
        teamLeadId: string;
        specialistIds?: string[] | undefined;
    }[] | undefined;
    managers?: {
        managerId: string;
        supervisedTeamIds?: string[] | undefined;
    }[] | undefined;
    directors?: {
        directorId: string;
        supervisedManagerIds?: string[] | undefined;
    }[] | undefined;
    vicePresidents?: {
        vicePresidentId: string;
        supervisedDirectorIds?: string[] | undefined;
    }[] | undefined;
}>;
export type OrganizationHierarchy = z.infer<typeof organizationHierarchySchema>;
export declare function parseOrganizationHierarchy(input: unknown): OrganizationHierarchy;
export declare function safeParseOrganizationHierarchy(input: unknown): z.SafeParseReturnType<{
    orgId: string;
    version: number;
    generatedAt: string;
    teams?: {
        teamId: string;
        teamLeadId: string;
        specialistIds?: string[] | undefined;
    }[] | undefined;
    managers?: {
        managerId: string;
        supervisedTeamIds?: string[] | undefined;
    }[] | undefined;
    directors?: {
        directorId: string;
        supervisedManagerIds?: string[] | undefined;
    }[] | undefined;
    vicePresidents?: {
        vicePresidentId: string;
        supervisedDirectorIds?: string[] | undefined;
    }[] | undefined;
}, {
    orgId: string;
    version: number;
    teams: {
        teamId: string;
        teamLeadId: string;
        specialistIds: string[];
    }[];
    generatedAt: string;
    managers?: {
        supervisedTeamIds: string[];
        managerId: string;
    }[] | undefined;
    directors?: {
        supervisedManagerIds: string[];
        directorId: string;
    }[] | undefined;
    vicePresidents?: {
        supervisedDirectorIds: string[];
        vicePresidentId: string;
    }[] | undefined;
}>;
