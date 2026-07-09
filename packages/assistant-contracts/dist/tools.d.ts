import type { AssistantCertificationLevel, ResponseStatus, ToolClassification, ToolId } from "./primitives.js";
import type { AssistantExplanation } from "./explanation.js";
/** Safety boundaries attached to a certified tool. */
export interface ToolSafetyBoundaries {
    /** Maximum invocations per user session (optional rate limit). */
    max_invocations_per_session?: number;
    /** Whether PII may appear in tool input/output (default: false). */
    allows_pii: boolean;
    /** Whether Confirmation Framework is mandatory regardless of classification. */
    requires_confirmation: boolean;
    /** Additional platform-enumerated constraint keys (adapter-defined values). */
    constraints?: Readonly<Record<string, string | number | boolean>>;
}
/**
 * Certified Tool Registry metadata.
 * Products register tools; platform validates schema and NBS-011 level.
 */
export interface AssistantToolMetadata {
    tool_id: ToolId;
    /** Product or subdomain tag (opaque string). */
    domain: string;
    /** Model-consumable summary of tool purpose. */
    description: string;
    certification_level: AssistantCertificationLevel;
    required_scopes: readonly string[];
    classification: ToolClassification;
    safety_boundaries: ToolSafetyBoundaries;
    /** Adapter handler id or NOP workflow binding reference. */
    handler_ref: string;
}
/** Normalized result from a tool invocation (read or pre-confirm draft). */
export interface AssistantToolResult<TData = Record<string, unknown>> {
    tool_id: ToolId;
    status: ResponseStatus;
    /** Present when status is `success` or partial success with warnings. */
    data?: TData;
    /** Present when status is `error`. */
    error_message?: string;
    /** Structured explainability for audit and Rich Response rendering. */
    explanation?: AssistantExplanation;
}
//# sourceMappingURL=tools.d.ts.map