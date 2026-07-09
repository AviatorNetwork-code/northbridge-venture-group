/** Monthly spend cap for a budget bucket. */
export interface BudgetLimit {
  bucket: string;
  limitUsd: number;
}

/** Product-defined budget configuration. */
export interface BudgetLimits {
  defaultLimitUsd: number;
  limits?: BudgetLimit[];
}

export interface BudgetCheckInput {
  bucket: string;
  spentUsd: number;
  estimatedCostUsd: number;
  limits: BudgetLimits;
}

/** Result of a pre-flight budget check. */
export interface BudgetDecision {
  allowed: boolean;
  bucket: string;
  limitUsd: number;
  spentUsd: number;
  estimatedCostUsd: number;
  remainingUsd: number;
  reason?: string;
}
