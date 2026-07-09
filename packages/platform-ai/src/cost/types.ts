/** Token counts from a provider completion call. */
export interface TokenUsage {
  model: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
}

/** Estimated cost for a token usage window. */
export interface CostEstimate {
  usage: TokenUsage;
  estimatedCostUsd: number;
}

export interface ModelRate {
  inputPerMillionUsd: number;
  outputPerMillionUsd: number;
}

export type ModelRateTable = Record<string, ModelRate>;
