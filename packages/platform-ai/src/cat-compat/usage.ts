import { estimateTokenCostUsd } from "../cost/estimate.js";
import { DEFAULT_CAT_MODEL } from "./constants.js";
import type { CatCompletionUsage } from "./types.js";

/** Build legacy snake_case usage record for Aviator CAT call sites. */
export function buildUsageRecord(
  model: string,
  inputTokens: number,
  outputTokens: number,
): CatCompletionUsage {
  const total_tokens = inputTokens + outputTokens;
  return {
    model,
    input_tokens: inputTokens,
    output_tokens: outputTokens,
    total_tokens,
    estimated_cost_usd: estimateTokenCostUsd(model, inputTokens, outputTokens),
  };
}

export { DEFAULT_CAT_MODEL };
