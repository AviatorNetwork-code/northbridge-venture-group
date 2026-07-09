import type {
  ConfidenceLevel,
  ConfirmationRequirement,
  IntentType,
  ToolId,
} from "./primitives.js";

/**
 * Intent plan produced by the Intent Engine.
 * Classification does not execute tools — it describes the planned response path.
 */
export interface AssistantIntent {
  intent_type: IntentType;
  /** Product domain tag from the adapter registry (opaque to platform). */
  domain: string;
  required_tool_ids: readonly ToolId[];
  confirmation_requirement: ConfirmationRequirement;
  /** Context or tool parameters still required before invocation. */
  missing_data_fields: readonly string[];
  /** Confidence in intent classification. */
  classification_confidence: ConfidenceLevel;
  /** Optional user-facing clarification prompt when intent is `clarify`. */
  clarification_prompt?: string;
}
