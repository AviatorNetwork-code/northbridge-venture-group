import { z } from "zod";
/**
 * A hired team product instance within a customer organization.
 * Teams are customer-facing products; specialists are internal to the team.
 */
export declare const teamSchema: z.ZodObject<{
    id: z.ZodString;
    orgId: z.ZodString;
    teamProductId: z.ZodString;
    name: z.ZodString;
    status: z.ZodEnum<["provisioned", "active", "suspended", "deprovisioned"]>;
    teamLeadId: z.ZodString;
    specialistIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strict", z.ZodTypeAny, {
    status: "provisioned" | "active" | "suspended" | "deprovisioned";
    createdAt: string;
    updatedAt: string;
    id: string;
    orgId: string;
    teamLeadId: string;
    specialistIds: string[];
    name: string;
    teamProductId: string;
}, {
    status: "provisioned" | "active" | "suspended" | "deprovisioned";
    createdAt: string;
    updatedAt: string;
    id: string;
    orgId: string;
    teamLeadId: string;
    name: string;
    teamProductId: string;
    specialistIds?: string[] | undefined;
}>;
export type Team = z.infer<typeof teamSchema>;
export declare function parseTeam(input: unknown): Team;
export declare function safeParseTeam(input: unknown): z.SafeParseReturnType<{
    status: "provisioned" | "active" | "suspended" | "deprovisioned";
    createdAt: string;
    updatedAt: string;
    id: string;
    orgId: string;
    teamLeadId: string;
    name: string;
    teamProductId: string;
    specialistIds?: string[] | undefined;
}, {
    status: "provisioned" | "active" | "suspended" | "deprovisioned";
    createdAt: string;
    updatedAt: string;
    id: string;
    orgId: string;
    teamLeadId: string;
    specialistIds: string[];
    name: string;
    teamProductId: string;
}>;
