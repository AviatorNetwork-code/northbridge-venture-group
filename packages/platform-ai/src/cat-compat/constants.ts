/** CAT Phase 1 default budget caps — Aviator parity constants. */
export const PLATFORM_INTELLIGENCE_MONTHLY_BUDGET_USD = 50;

export const DEFAULT_USER_AI_MONTHLY_BUDGET_USD = 5;

export const DEFAULT_CAT_MODEL = "gpt-4o-mini";

export const CAT_BUDGET_BUCKETS = ["user_ai", "platform_intelligence"] as const;

export type CatBudgetBucket = (typeof CAT_BUDGET_BUCKETS)[number];
