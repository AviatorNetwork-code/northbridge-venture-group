/** Current AssistantRichCard schema version (v1.0). */
export const ASSISTANT_RICH_CARD_SCHEMA_VERSION = "1.0" as const;

export type AssistantRichCardSchemaVersion =
  typeof ASSISTANT_RICH_CARD_SCHEMA_VERSION;

/** Recognized rich card variants for Assistant Shell rendering. */
export type AssistantCardType =
  | "explanation"
  | "recommendation"
  | "confirmation_request"
  | "tool_result"
  | "warning"
  | "error"
  | "next_steps";

/** Severity for warning and error cards (Confidence Model alignment). */
export type AssistantCardSeverity = "info" | "warning" | "error" | "critical";

/** User action wired to Confirmation Framework when present. */
export interface AssistantCardAction {
  action_id: string;
  label: string;
  draft_id?: string;
  disabled?: boolean;
  disabled_reason?: string;
}

/** Metadata bag for non-critical adapter annotations. */
export type AssistantCardMetadata = Readonly<
  Record<string, string | number | boolean | null>
>;

/**
 * AssistantRichCard v1.0 — canonical validated card model for platform outputs.
 * Product adapters must validate before rendering; raw provider JSON is forbidden in UX.
 */
export interface AssistantRichCard {
  schema_version: AssistantRichCardSchemaVersion;
  id: string;
  type: AssistantCardType;
  title: string;
  body: string;
  severity?: AssistantCardSeverity;
  actions?: readonly AssistantCardAction[];
  metadata?: AssistantCardMetadata;
  created_at?: string;
}

export const ASSISTANT_CARD_TYPES: readonly AssistantCardType[] = [
  "explanation",
  "recommendation",
  "confirmation_request",
  "tool_result",
  "warning",
  "error",
  "next_steps",
] as const;

export const ASSISTANT_CARD_SEVERITIES: readonly AssistantCardSeverity[] = [
  "info",
  "warning",
  "error",
  "critical",
] as const;

/** Cards that require a severity field. */
export const SEVERITY_REQUIRED_CARD_TYPES: readonly AssistantCardType[] = [
  "warning",
  "error",
] as const;

/** Cards that require at least one action. */
export const ACTIONS_REQUIRED_CARD_TYPES: readonly AssistantCardType[] = [
  "confirmation_request",
] as const;

/** Single validation issue for an invalid card field. */
export interface AssistantCardValidationIssue {
  path: string;
  code: string;
  message: string;
}

/** Result of validating one rich card candidate. */
export interface AssistantCardValidationResult {
  valid: boolean;
  issues: readonly AssistantCardValidationIssue[];
  card?: AssistantRichCard;
}
