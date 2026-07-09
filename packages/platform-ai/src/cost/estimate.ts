import type { CostEstimate, ModelRateTable, TokenUsage } from "./types.js";

export const DEFAULT_MODEL = "gpt-4o-mini";

/** Baseline OpenAI-style rates — products may extend via custom rate tables. */
export const DEFAULT_MODEL_RATES: ModelRateTable = {
  "gpt-4o-mini": { inputPerMillionUsd: 0.15, outputPerMillionUsd: 0.6 },
  "gpt-4o": { inputPerMillionUsd: 2.5, outputPerMillionUsd: 10 },
};

export function estimateTokenCostUsd(
  model: string,
  inputTokens: number,
  outputTokens: number,
  rates: ModelRateTable = DEFAULT_MODEL_RATES,
  fallbackModel: string = DEFAULT_MODEL,
): number {
  const table = rates[model] ?? rates[fallbackModel];
  if (!table) {
    return 0;
  }
  const inputCost = (inputTokens / 1_000_000) * table.inputPerMillionUsd;
  const outputCost = (outputTokens / 1_000_000) * table.outputPerMillionUsd;
  return Math.round((inputCost + outputCost) * 1_000_000) / 1_000_000;
}

export function buildTokenUsage(
  model: string,
  inputTokens: number,
  outputTokens: number,
): TokenUsage {
  return {
    model,
    inputTokens,
    outputTokens,
    totalTokens: inputTokens + outputTokens,
  };
}

export function buildCostEstimate(
  model: string,
  inputTokens: number,
  outputTokens: number,
  rates?: ModelRateTable,
): CostEstimate {
  const usage = buildTokenUsage(model, inputTokens, outputTokens);
  return {
    usage,
    estimatedCostUsd: estimateTokenCostUsd(
      model,
      inputTokens,
      outputTokens,
      rates,
    ),
  };
}
