import { z } from "zod";
import { organizationIdSchema, recommendationIdSchema } from "./primitives.js";
export const recommendationTypeSchema = z.enum([
    "add_team",
    "remove_team",
    "add_manager",
    "add_director",
    "add_vice_president",
    "upgrade_tier",
    "downgrade_tier",
    "wait",
    "no_change",
]);
export const recommendationStatusSchema = z.enum([
    "pending",
    "acknowledged",
    "dismissed",
]);
export const recommendationReasonSchema = z
    .object({
    code: z.string().min(1).max(64),
    description: z.string().min(1).max(1024),
    evidenceRef: z.string().min(1).max(128).optional(),
})
    .strict();
/**
 * Evidence-based organizational or service recommendation.
 * Product services attach policy weights; contracts define shape only.
 */
export const recommendationSchema = z
    .object({
    id: recommendationIdSchema,
    orgId: organizationIdSchema,
    type: recommendationTypeSchema,
    reasons: z.array(recommendationReasonSchema).min(1),
    evidenceRefs: z.array(z.string().min(1).max(128)).default([]),
    targetRef: z.string().min(1).max(128).optional(),
    status: recommendationStatusSchema.default("pending"),
    createdAt: z.string().datetime({ offset: true }),
    acknowledgedAt: z.string().datetime({ offset: true }).optional(),
})
    .strict();
export function parseRecommendation(input) {
    return recommendationSchema.parse(input);
}
export function safeParseRecommendation(input) {
    return recommendationSchema.safeParse(input);
}
