import { z } from "zod";
/**
 * Disposition of external research relative to Northbridge implementation.
 * Aligns with NEO Research & Knowledge Doctrine v1.0.
 */
export const researchTrustLevelSchema = z.enum([
    "unverified",
    "reference_only",
    "adopt_concepts",
    "adopt_implementation",
    "avoid",
]);
export const RESEARCH_TRUST_LEVEL_LABELS = {
    unverified: "Unverified — not yet reviewed",
    reference_only: "Reference only — learn patterns, do not adopt code",
    adopt_concepts: "Adopt concepts — architectural ideas approved",
    adopt_implementation: "Adopt implementation — approved for engineering use",
    avoid: "Avoid — do not use for Northbridge",
};
