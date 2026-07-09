import { z } from "zod";
export declare const recommendationTypeSchema: z.ZodEnum<["add_team", "remove_team", "add_manager", "add_director", "add_vice_president", "upgrade_tier", "downgrade_tier", "wait", "no_change"]>;
export type RecommendationType = z.infer<typeof recommendationTypeSchema>;
export declare const recommendationStatusSchema: z.ZodEnum<["pending", "acknowledged", "dismissed"]>;
export type RecommendationStatus = z.infer<typeof recommendationStatusSchema>;
export declare const recommendationReasonSchema: z.ZodObject<{
    code: z.ZodString;
    description: z.ZodString;
    evidenceRef: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    code: string;
    description: string;
    evidenceRef?: string | undefined;
}, {
    code: string;
    description: string;
    evidenceRef?: string | undefined;
}>;
export type RecommendationReason = z.infer<typeof recommendationReasonSchema>;
/**
 * Evidence-based organizational or service recommendation.
 * Product services attach policy weights; contracts define shape only.
 */
export declare const recommendationSchema: z.ZodObject<{
    id: z.ZodString;
    orgId: z.ZodString;
    type: z.ZodEnum<["add_team", "remove_team", "add_manager", "add_director", "add_vice_president", "upgrade_tier", "downgrade_tier", "wait", "no_change"]>;
    reasons: z.ZodArray<z.ZodObject<{
        code: z.ZodString;
        description: z.ZodString;
        evidenceRef: z.ZodOptional<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        code: string;
        description: string;
        evidenceRef?: string | undefined;
    }, {
        code: string;
        description: string;
        evidenceRef?: string | undefined;
    }>, "many">;
    evidenceRefs: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    targetRef: z.ZodOptional<z.ZodString>;
    status: z.ZodDefault<z.ZodEnum<["pending", "acknowledged", "dismissed"]>>;
    createdAt: z.ZodString;
    acknowledgedAt: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    type: "add_team" | "remove_team" | "add_manager" | "add_director" | "add_vice_president" | "upgrade_tier" | "downgrade_tier" | "wait" | "no_change";
    status: "acknowledged" | "pending" | "dismissed";
    createdAt: string;
    id: string;
    orgId: string;
    reasons: {
        code: string;
        description: string;
        evidenceRef?: string | undefined;
    }[];
    evidenceRefs: string[];
    targetRef?: string | undefined;
    acknowledgedAt?: string | undefined;
}, {
    type: "add_team" | "remove_team" | "add_manager" | "add_director" | "add_vice_president" | "upgrade_tier" | "downgrade_tier" | "wait" | "no_change";
    createdAt: string;
    id: string;
    orgId: string;
    reasons: {
        code: string;
        description: string;
        evidenceRef?: string | undefined;
    }[];
    status?: "acknowledged" | "pending" | "dismissed" | undefined;
    evidenceRefs?: string[] | undefined;
    targetRef?: string | undefined;
    acknowledgedAt?: string | undefined;
}>;
export type Recommendation = z.infer<typeof recommendationSchema>;
export declare function parseRecommendation(input: unknown): Recommendation;
export declare function safeParseRecommendation(input: unknown): z.SafeParseReturnType<{
    type: "add_team" | "remove_team" | "add_manager" | "add_director" | "add_vice_president" | "upgrade_tier" | "downgrade_tier" | "wait" | "no_change";
    createdAt: string;
    id: string;
    orgId: string;
    reasons: {
        code: string;
        description: string;
        evidenceRef?: string | undefined;
    }[];
    status?: "acknowledged" | "pending" | "dismissed" | undefined;
    evidenceRefs?: string[] | undefined;
    targetRef?: string | undefined;
    acknowledgedAt?: string | undefined;
}, {
    type: "add_team" | "remove_team" | "add_manager" | "add_director" | "add_vice_president" | "upgrade_tier" | "downgrade_tier" | "wait" | "no_change";
    status: "acknowledged" | "pending" | "dismissed";
    createdAt: string;
    id: string;
    orgId: string;
    reasons: {
        code: string;
        description: string;
        evidenceRef?: string | undefined;
    }[];
    evidenceRefs: string[];
    targetRef?: string | undefined;
    acknowledgedAt?: string | undefined;
}>;
