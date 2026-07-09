import type { AssistantId, IsoDateTime, ProductId } from "./primitives.js";
/** Session and authorization context supplied by the product adapter. */
export interface AssistantSessionContext {
    user_id: string;
    roles: readonly string[];
    permissions: readonly string[];
    locale?: string;
}
/** Feature availability resolved before each turn. */
export interface AssistantFeatureContext {
    enabled: readonly string[];
    /** Map of feature id → human-readable disable reason. Empty when all enabled. */
    disabled_reasons: Readonly<Record<string, string>>;
}
/** Governed memory ports — long-term refs must point to NKB or approved memory IDs. */
export interface AssistantMemoryContext {
    /** Turn-scoped structured memory entries (adapter-defined shape). */
    short_term: readonly Readonly<Record<string, unknown>>[];
    /** Approved long-term memory or NKB artifact IDs only. */
    long_term_refs: readonly string[];
}
/** Tracks fields the Context Engine could not load — must not be invented. */
export interface AssistantContextCompleteness {
    missing_fields: readonly string[];
}
/**
 * Bounded context assembled for a single assistant turn.
 *
 * @typeParam TWorkspace - Product adapter workspace snapshot (extends at adapter layer).
 */
export interface AssistantContext<TWorkspace extends Record<string, unknown> = Record<string, unknown>> {
    snapshot_id: string;
    product_id: ProductId;
    assistant_id: AssistantId;
    /** Adapter-defined workspace snapshot; validated by the product adapter. */
    workspace: TWorkspace;
    session: AssistantSessionContext;
    features: AssistantFeatureContext;
    memory: AssistantMemoryContext;
    loaded_at: IsoDateTime;
    completeness: AssistantContextCompleteness;
}
//# sourceMappingURL=context.d.ts.map