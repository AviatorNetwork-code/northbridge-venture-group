export type ConversationBudgetFailureCode =
  | "monthly_budget_exceeded"
  | "request_payload_too_large";

export type ConversationBudgetCheckDetails = {
  allowed: boolean;
  bucket: string;
  limitUsd: number;
  spentUsd: number;
  estimatedCostUsd: number;
  remainingUsd: number;
  reason?: string;
};

export type ConversationBudgetResult =
  | { ok: true; estimatedInputTokens: number }
  | {
      ok: false;
      code: ConversationBudgetFailureCode;
      details?: ConversationBudgetCheckDetails;
      message: string;
    };

/** Simple conversation mode before tool selection or AI calls. */
export const MESSAGE_KINDS = [
  "greeting",
  "question",
  "intent",
  "help",
  "error",
  "unknown",
] as const;

export type MessageKind = (typeof MESSAGE_KINDS)[number];

export type MessageWorkspace = string;

export type FollowUpChip = {
  id: string;
  label: string;
  message: string;
};

export type ClassifyMessageKindInput = {
  message: string;
  workspace?: MessageWorkspace;
};

export type ClassifiedMessageKind = {
  kind: MessageKind;
  reasoning: string;
};

export type MessageKindResponse = {
  answer: string;
  followUpChips: FollowUpChip[];
};

export type MessageKindClassifierConfig = {
  operationalIntentPatterns?: RegExp[];
  isOperationalIntent?: (message: string, workspace: MessageWorkspace) => boolean;
};

export type MessageKindResponseConfig = {
  answers?: Partial<Record<MessageKind, string>>;
  chipsByKind?: Partial<
    Record<MessageKind, (workspace: MessageWorkspace) => FollowUpChip[]>
  >;
  defaultChips?: (workspace: MessageWorkspace) => FollowUpChip[];
};

export type AiTranslationPayloadInput = {
  message: string;
  tool: string;
  compactSummary: Record<string, unknown>;
};

export type AiTranslationPayload = {
  system: string;
  user: string;
};
