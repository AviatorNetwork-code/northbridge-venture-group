import type { ResponseStatus } from "./primitives.js";
import type { AssistantExplanation } from "./explanation.js";

/** Metric row for Rich Response System cards. */
export interface AssistantRichCardMetric {
  label: string;
  value: string;
  delta?: string;
  tone?: "neutral" | "positive" | "negative" | "warning";
}

/** Status badge on a rich card. */
export interface AssistantRichCardBadge {
  label: string;
  status: ResponseStatus;
}

/** User action wired exclusively to the Confirmation Framework. */
export interface AssistantRichCardAction {
  action_id: string;
  label: string;
  /** Links to OperationalDraft.draft_id when action requires confirmation. */
  draft_id?: string;
  disabled?: boolean;
  disabled_reason?: string;
}

/** Key-value or list row inside a card body. */
export interface AssistantRichCardRow {
  label: string;
  value: string;
}

/**
 * Structured UI card — normalized provider/tool output for Assistant Shell.
 * Raw JSON must not be rendered directly in user-facing chat.
 */
export interface AssistantRichCard {
  schema_version: "1.0";
  card_id: string;
  status: ResponseStatus;
  title: string;
  subtitle?: string;
  metrics?: readonly AssistantRichCardMetric[];
  badges?: readonly AssistantRichCardBadge[];
  rows?: readonly AssistantRichCardRow[];
  actions?: readonly AssistantRichCardAction[];
  explanation?: AssistantExplanation;
}
