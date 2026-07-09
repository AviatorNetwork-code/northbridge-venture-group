import type { ApprovalStatus, AssistantId, IsoDateTime, ProductId, RiskClass, ToolId } from "./primitives.js";
/**
 * Assistant-prepared operational action pending Confirmation Framework approval.
 * Maps to Intelligence Stack `OperationalDraft`; executed by NOP after confirm.
 */
export interface OperationalDraft<TParameters extends Record<string, unknown> = Record<string, unknown>> {
    draft_id: string;
    source: {
        assistant_id: AssistantId;
        product_id: ProductId;
        /** Must be true before NOP handoff for user_confirm gates. */
        user_confirmation: boolean;
    };
    workflow: {
        /** Opaque workflow type (product adapter defines). */
        type: string;
        parameters: TParameters;
    };
    /** Primary tool that produced this draft, when applicable. */
    originating_tool_id?: ToolId;
    approval: {
        status: ApprovalStatus;
        neo_gate_ids: readonly string[];
        human_approver?: string;
    };
    risk_class: RiskClass;
    created_at: IsoDateTime;
}
//# sourceMappingURL=operational.d.ts.map