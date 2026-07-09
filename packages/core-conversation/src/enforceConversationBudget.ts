import { checkBudget, getMonthKey } from "@northbridge/platform-ai";
import type { BudgetLimits } from "@northbridge/platform-ai";
import { payloadExceedsMaxBytes, serializeRedactedPayload } from "./redactAiPayload.js";
import type { ConversationBudgetResult } from "./types.js";

export const DEFAULT_MAX_INPUT_TOKENS_PER_REQUEST = 4_000;

export const CONVERSATION_BUDGET_EXCEEDED_MESSAGE =
  "You've reached your usage limit for this month. Try again later.";

export const CONVERSATION_PAYLOAD_TOO_LARGE_MESSAGE =
  "This request is too large to summarize safely. Try a more specific question.";

export function estimateTokensFromText(text: string): number {
  return Math.ceil(text.length / 4);
}

export function enforceConversationPayloadBudget(
  payload: unknown,
  maxInputTokens = DEFAULT_MAX_INPUT_TOKENS_PER_REQUEST,
  maxContextBytes?: number,
): ConversationBudgetResult {
  if (payloadExceedsMaxBytes(payload, maxContextBytes)) {
    return {
      ok: false,
      code: "request_payload_too_large",
      message: CONVERSATION_PAYLOAD_TOO_LARGE_MESSAGE,
    };
  }

  const serialized = serializeRedactedPayload(payload, maxContextBytes);
  const estimatedInputTokens = estimateTokensFromText(serialized);
  if (estimatedInputTokens > maxInputTokens) {
    return {
      ok: false,
      code: "request_payload_too_large",
      message: CONVERSATION_PAYLOAD_TOO_LARGE_MESSAGE,
    };
  }

  return { ok: true, estimatedInputTokens };
}

export async function enforceConversationBudget(input: {
  payload: unknown;
  getMonthlySpendUsd: (monthKey: string) => Promise<number>;
  estimatedCostUsd: number;
  bucket: string;
  limits: BudgetLimits;
  maxInputTokens?: number;
  maxContextBytes?: number;
}): Promise<ConversationBudgetResult> {
  const payloadBudget = enforceConversationPayloadBudget(
    input.payload,
    input.maxInputTokens,
    input.maxContextBytes,
  );
  if (!payloadBudget.ok) {
    return payloadBudget;
  }

  const monthKey = getMonthKey();
  const spentUsd = await input.getMonthlySpendUsd(monthKey);
  const monthly = checkBudget({
    bucket: input.bucket,
    spentUsd,
    estimatedCostUsd: input.estimatedCostUsd,
    limits: input.limits,
  });

  if (!monthly.allowed) {
    return {
      ok: false,
      code: "monthly_budget_exceeded",
      details: monthly,
      message: CONVERSATION_BUDGET_EXCEEDED_MESSAGE,
    };
  }

  return payloadBudget;
}

export function isMonthlyBudgetFailure(
  result: ConversationBudgetResult,
): result is Extract<ConversationBudgetResult, { ok: false; code: "monthly_budget_exceeded" }> {
  return !result.ok && result.code === "monthly_budget_exceeded";
}
