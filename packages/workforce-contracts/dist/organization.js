import { z } from "zod";
/**
 * Feature flags gating manager+ organizational tiers at launch.
 * @see docs/northbridge-digital-workforce-execution-plan-v1.md Phase 1
 */
export const workforceFeatureFlagsSchema = z.object({
    managersEnabled: z.boolean().default(false),
    directorsEnabled: z.boolean().default(false),
    vpsEnabled: z.boolean().default(false),
});
export const organizationSchema = z
    .object({
    id: z.string().min(1).max(128),
    name: z.string().min(1).max(256),
    featureFlags: workforceFeatureFlagsSchema.default({
        managersEnabled: false,
        directorsEnabled: false,
        vpsEnabled: false,
    }),
    metadata: z.record(z.unknown()).optional(),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }),
})
    .strict();
export function parseOrganization(input) {
    return organizationSchema.parse(input);
}
export function safeParseOrganization(input) {
    return organizationSchema.safeParse(input);
}
