import type { ConfirmationStage, IsoDateTime } from "./primitives.js";

/**
 * Confirmation Framework state for a single operational draft.
 * Stages: Draft → Review → Confirm → Execute → Report.
 */
export interface ConfirmationState {
  draft_id: string;
  stage: ConfirmationStage;
  /** User or supervisor identity when stage is `confirm` or later. */
  confirmed_by?: string;
  confirmed_at?: IsoDateTime;
  /** NOP execution id when stage is `execute` or `report`. */
  execution_id?: string;
  /** Audit trail reference for Intelligence Stack OperationalExecutionRecord. */
  audit_ref?: string;
  cancelled_reason?: string;
}
