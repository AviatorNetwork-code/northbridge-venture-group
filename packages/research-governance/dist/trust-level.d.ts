import { z } from "zod";
/**
 * Disposition of external research relative to Northbridge implementation.
 * Aligns with NEO Research & Knowledge Doctrine v1.0.
 */
export declare const researchTrustLevelSchema: z.ZodEnum<["unverified", "reference_only", "adopt_concepts", "adopt_implementation", "avoid"]>;
export type ResearchTrustLevel = z.infer<typeof researchTrustLevelSchema>;
export declare const RESEARCH_TRUST_LEVEL_LABELS: Record<ResearchTrustLevel, string>;
