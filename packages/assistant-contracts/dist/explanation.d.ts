import type { ConfidenceLevel, KnowledgeArtifactRef } from "./primitives.js";
/** Source attribution for explainability (snapshot, tool, NKB, provider). */
export interface ExplanationDataSource {
    source_type: "workspace" | "tool" | "nkb" | "session" | "memory" | "provider";
    source_id: string;
    description?: string;
}
/**
 * Structured explainability payload for user-visible panels and audit logs.
 * Aligns with the Confidence Model — medium/low confidence requires limitation language.
 */
export interface AssistantExplanation {
    /** Primary rationale for the response or recommendation. */
    why: string;
    data_sources: readonly ExplanationDataSource[];
    confidence: ConfidenceLevel;
    missing_information: readonly string[];
    unsupported_assumptions: readonly string[];
    /** Required when confidence is not `high`. */
    limitation_language?: string;
    nkb_citations: readonly KnowledgeArtifactRef[];
}
//# sourceMappingURL=explanation.d.ts.map