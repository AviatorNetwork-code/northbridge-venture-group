import type { CatBudgetBucket } from "./constants.js";

/** Legacy Aviator flat usage record (snake_case). */
export interface CatCompletionUsage {
  model: string;
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
  estimated_cost_usd: number;
}

export interface CatBudgetCheckResult {
  allowed: boolean;
  bucket: CatBudgetBucket;
  limit_usd: number;
  spent_usd: number;
  estimated_cost_usd: number;
  remaining_usd: number;
}
