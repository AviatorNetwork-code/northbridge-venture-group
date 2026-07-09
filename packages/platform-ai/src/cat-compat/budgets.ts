import type { BudgetLimits } from "../budgets/types.js";
import { checkBudget } from "../budgets/checkBudget.js";
import {
  DEFAULT_USER_AI_MONTHLY_BUDGET_USD,
  PLATFORM_INTELLIGENCE_MONTHLY_BUDGET_USD,
  type CatBudgetBucket,
} from "./constants.js";
import type { CatBudgetCheckResult } from "./types.js";

/** Default CAT budget limits matching Aviator Phase 1 constants. */
export const DEFAULT_CAT_BUDGET_LIMITS: BudgetLimits = {
  defaultLimitUsd: DEFAULT_USER_AI_MONTHLY_BUDGET_USD,
  limits: [
    { bucket: "platform_intelligence", limitUsd: PLATFORM_INTELLIGENCE_MONTHLY_BUDGET_USD },
    { bucket: "user_ai", limitUsd: DEFAULT_USER_AI_MONTHLY_BUDGET_USD },
  ],
};

function readPositiveEnv(env: NodeJS.ProcessEnv, name: string): number | null {
  const raw = env[name];
  if (!raw) return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

/** Resolve CAT budget limits from Aviator env var names when present. */
export function createCatBudgetLimitsFromEnv(
  env: NodeJS.ProcessEnv = process.env,
): BudgetLimits {
  const platformOverride = readPositiveEnv(
    env,
    "CAT_PLATFORM_INTELLIGENCE_MONTHLY_BUDGET_USD",
  );
  const userOverride = readPositiveEnv(env, "CAT_USER_AI_MONTHLY_BUDGET_USD");

  return {
    defaultLimitUsd: userOverride ?? DEFAULT_USER_AI_MONTHLY_BUDGET_USD,
    limits: [
      {
        bucket: "platform_intelligence",
        limitUsd: platformOverride ?? PLATFORM_INTELLIGENCE_MONTHLY_BUDGET_USD,
      },
      {
        bucket: "user_ai",
        limitUsd: userOverride ?? DEFAULT_USER_AI_MONTHLY_BUDGET_USD,
      },
    ],
  };
}

export function getCatBudgetLimitUsd(
  bucket: CatBudgetBucket,
  limits: BudgetLimits = DEFAULT_CAT_BUDGET_LIMITS,
): number {
  const override = limits.limits?.find((entry) => entry.bucket === bucket);
  if (override && override.limitUsd > 0) {
    return override.limitUsd;
  }
  return limits.defaultLimitUsd;
}

/** Legacy snake_case budget check for Aviator CAT call sites. */
export function checkCatBudget(input: {
  bucket: CatBudgetBucket;
  spent_usd: number;
  estimated_cost_usd: number;
  limits?: BudgetLimits;
}): CatBudgetCheckResult {
  const limits = input.limits ?? DEFAULT_CAT_BUDGET_LIMITS;
  const decision = checkBudget({
    bucket: input.bucket,
    spentUsd: input.spent_usd,
    estimatedCostUsd: input.estimated_cost_usd,
    limits,
  });

  return {
    allowed: decision.allowed,
    bucket: input.bucket,
    limit_usd: decision.limitUsd,
    spent_usd: decision.spentUsd,
    estimated_cost_usd: decision.estimatedCostUsd,
    remaining_usd: decision.remainingUsd,
  };
}
