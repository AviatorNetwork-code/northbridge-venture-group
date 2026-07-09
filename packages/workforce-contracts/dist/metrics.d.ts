import { z } from "zod";
export declare const operationalMetricSchema: z.ZodObject<{
    id: z.ZodString;
    orgId: z.ZodString;
    teamId: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    value: z.ZodNumber;
    unit: z.ZodOptional<z.ZodString>;
    windowStart: z.ZodOptional<z.ZodString>;
    windowEnd: z.ZodOptional<z.ZodString>;
    collectedAt: z.ZodString;
}, "strict", z.ZodTypeAny, {
    value: number;
    id: string;
    orgId: string;
    name: string;
    collectedAt: string;
    teamId?: string | undefined;
    unit?: string | undefined;
    windowStart?: string | undefined;
    windowEnd?: string | undefined;
}, {
    value: number;
    id: string;
    orgId: string;
    name: string;
    collectedAt: string;
    teamId?: string | undefined;
    unit?: string | undefined;
    windowStart?: string | undefined;
    windowEnd?: string | undefined;
}>;
export type OperationalMetric = z.infer<typeof operationalMetricSchema>;
export declare const teamReportSchema: z.ZodObject<{
    id: z.ZodString;
    orgId: z.ZodString;
    teamId: z.ZodString;
    teamLeadId: z.ZodString;
    periodStart: z.ZodString;
    periodEnd: z.ZodString;
    summary: z.ZodString;
    metrics: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        orgId: z.ZodString;
        teamId: z.ZodOptional<z.ZodString>;
        name: z.ZodString;
        value: z.ZodNumber;
        unit: z.ZodOptional<z.ZodString>;
        windowStart: z.ZodOptional<z.ZodString>;
        windowEnd: z.ZodOptional<z.ZodString>;
        collectedAt: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        value: number;
        id: string;
        orgId: string;
        name: string;
        collectedAt: string;
        teamId?: string | undefined;
        unit?: string | undefined;
        windowStart?: string | undefined;
        windowEnd?: string | undefined;
    }, {
        value: number;
        id: string;
        orgId: string;
        name: string;
        collectedAt: string;
        teamId?: string | undefined;
        unit?: string | undefined;
        windowStart?: string | undefined;
        windowEnd?: string | undefined;
    }>, "many">>;
    generatedAt: z.ZodString;
}, "strict", z.ZodTypeAny, {
    id: string;
    orgId: string;
    teamId: string;
    teamLeadId: string;
    generatedAt: string;
    periodStart: string;
    periodEnd: string;
    summary: string;
    metrics: {
        value: number;
        id: string;
        orgId: string;
        name: string;
        collectedAt: string;
        teamId?: string | undefined;
        unit?: string | undefined;
        windowStart?: string | undefined;
        windowEnd?: string | undefined;
    }[];
}, {
    id: string;
    orgId: string;
    teamId: string;
    teamLeadId: string;
    generatedAt: string;
    periodStart: string;
    periodEnd: string;
    summary: string;
    metrics?: {
        value: number;
        id: string;
        orgId: string;
        name: string;
        collectedAt: string;
        teamId?: string | undefined;
        unit?: string | undefined;
        windowStart?: string | undefined;
        windowEnd?: string | undefined;
    }[] | undefined;
}>;
export type TeamReport = z.infer<typeof teamReportSchema>;
export declare function parseOperationalMetric(input: unknown): OperationalMetric;
export declare function parseTeamReport(input: unknown): TeamReport;
export declare function safeParseTeamReport(input: unknown): z.SafeParseReturnType<{
    id: string;
    orgId: string;
    teamId: string;
    teamLeadId: string;
    generatedAt: string;
    periodStart: string;
    periodEnd: string;
    summary: string;
    metrics?: {
        value: number;
        id: string;
        orgId: string;
        name: string;
        collectedAt: string;
        teamId?: string | undefined;
        unit?: string | undefined;
        windowStart?: string | undefined;
        windowEnd?: string | undefined;
    }[] | undefined;
}, {
    id: string;
    orgId: string;
    teamId: string;
    teamLeadId: string;
    generatedAt: string;
    periodStart: string;
    periodEnd: string;
    summary: string;
    metrics: {
        value: number;
        id: string;
        orgId: string;
        name: string;
        collectedAt: string;
        teamId?: string | undefined;
        unit?: string | undefined;
        windowStart?: string | undefined;
        windowEnd?: string | undefined;
    }[];
}>;
