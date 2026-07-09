import { z } from "zod";
/**
 * Feature flags gating manager+ organizational tiers at launch.
 * @see docs/northbridge-digital-workforce-execution-plan-v1.md Phase 1
 */
export declare const workforceFeatureFlagsSchema: z.ZodObject<{
    managersEnabled: z.ZodDefault<z.ZodBoolean>;
    directorsEnabled: z.ZodDefault<z.ZodBoolean>;
    vpsEnabled: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    managersEnabled: boolean;
    directorsEnabled: boolean;
    vpsEnabled: boolean;
}, {
    managersEnabled?: boolean | undefined;
    directorsEnabled?: boolean | undefined;
    vpsEnabled?: boolean | undefined;
}>;
export type WorkforceFeatureFlags = z.infer<typeof workforceFeatureFlagsSchema>;
export declare const organizationSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    featureFlags: z.ZodDefault<z.ZodObject<{
        managersEnabled: z.ZodDefault<z.ZodBoolean>;
        directorsEnabled: z.ZodDefault<z.ZodBoolean>;
        vpsEnabled: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        managersEnabled: boolean;
        directorsEnabled: boolean;
        vpsEnabled: boolean;
    }, {
        managersEnabled?: boolean | undefined;
        directorsEnabled?: boolean | undefined;
        vpsEnabled?: boolean | undefined;
    }>>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strict", z.ZodTypeAny, {
    createdAt: string;
    updatedAt: string;
    id: string;
    name: string;
    featureFlags: {
        managersEnabled: boolean;
        directorsEnabled: boolean;
        vpsEnabled: boolean;
    };
    metadata?: Record<string, unknown> | undefined;
}, {
    createdAt: string;
    updatedAt: string;
    id: string;
    name: string;
    featureFlags?: {
        managersEnabled?: boolean | undefined;
        directorsEnabled?: boolean | undefined;
        vpsEnabled?: boolean | undefined;
    } | undefined;
    metadata?: Record<string, unknown> | undefined;
}>;
export type Organization = z.infer<typeof organizationSchema>;
export declare function parseOrganization(input: unknown): Organization;
export declare function safeParseOrganization(input: unknown): z.SafeParseReturnType<{
    createdAt: string;
    updatedAt: string;
    id: string;
    name: string;
    featureFlags?: {
        managersEnabled?: boolean | undefined;
        directorsEnabled?: boolean | undefined;
        vpsEnabled?: boolean | undefined;
    } | undefined;
    metadata?: Record<string, unknown> | undefined;
}, {
    createdAt: string;
    updatedAt: string;
    id: string;
    name: string;
    featureFlags: {
        managersEnabled: boolean;
        directorsEnabled: boolean;
        vpsEnabled: boolean;
    };
    metadata?: Record<string, unknown> | undefined;
}>;
