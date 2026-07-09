/** ISO-8601 timestamp string. */
export type IsoDateTime = string;

/** Stable product identifier (e.g. `product-a`, `product-b`). */
export type ProductId = string;

/** Stable assistant instance identifier within a product. */
export type AssistantId = string;

/** Stable tool identifier in the platform Tool Registry. */
export type ToolId = string;

/** Confidence tier aligned with the Northbridge Confidence Model. */
export type ConfidenceLevel = "high" | "medium" | "low";

/**
 * NBS-011 assistant safety and certification levels.
 * @see docs/architecture/NORTHBRIDGE-ASSISTANT-PLATFORM-v1.md
 */
export type AssistantCertificationLevel = "L0" | "L1" | "L2" | "L3" | "L4";

/** Read/write classification for Tool Registry entries. */
export type ToolClassification = "read" | "write" | "draft_only";

/** Intent categories produced by the Intent Engine (plan only — no execution). */
export type IntentType =
  | "inform"
  | "explain"
  | "draft"
  | "recommend"
  | "tool_request"
  | "clarify"
  | "unsupported";

/** Confirmation gate required before side effects or NOP handoff. */
export type ConfirmationRequirement =
  | "none"
  | "user_confirm"
  | "supervisor_approve"
  | "neo_gate";

/** Rich card and tool result lifecycle status. */
export type ResponseStatus =
  | "success"
  | "warning"
  | "error"
  | "pending"
  | "unsupported"
  | "missing_data";

/** Confirmation Framework stage. */
export type ConfirmationStage =
  | "draft"
  | "review"
  | "confirm"
  | "execute"
  | "report"
  | "cancelled"
  | "timed_out";

/** Risk class for operational drafts (Intelligence Stack alignment). */
export type RiskClass = "low" | "medium" | "high";

/** Approval status for drafts and governance gates. */
export type ApprovalStatus = "pending" | "approved" | "rejected";

/** Reference to an approved NKB knowledge artifact. */
export interface KnowledgeArtifactRef {
  artifact_id: string;
  version: string;
  citation_label?: string;
}
