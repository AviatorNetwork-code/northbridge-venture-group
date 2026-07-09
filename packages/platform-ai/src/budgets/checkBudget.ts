import type {
  BudgetCheckInput,
  BudgetDecision,
  BudgetLimits,
} from "./types.js";

/** UTC month key `YYYY-MM` for monthly budget windows. */
export function getMonthKey(date = new Date()): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

export function getBudgetLimitUsd(
  bucket: string,
  limits: BudgetLimits,
): number {
  const override = limits.limits?.find((entry) => entry.bucket === bucket);
  if (override && override.limitUsd > 0) {
    return override.limitUsd;
  }
  return limits.defaultLimitUsd;
}

/** Pre-flight budget check — fail closed when spend + estimate exceeds limit. */
export function checkBudget(input: BudgetCheckInput): BudgetDecision {
  const limitUsd = getBudgetLimitUsd(input.bucket, input.limits);
  const remainingUsd = Math.max(0, limitUsd - input.spentUsd);
  const allowed = input.spentUsd + input.estimatedCostUsd <= limitUsd + 1e-9;

  return {
    allowed,
    bucket: input.bucket,
    limitUsd,
    spentUsd: input.spentUsd,
    estimatedCostUsd: input.estimatedCostUsd,
    remainingUsd,
    reason: allowed ? undefined : "Monthly budget exceeded",
  };
}
