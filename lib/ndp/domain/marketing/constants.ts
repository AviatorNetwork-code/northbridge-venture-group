export const MARKETING_SPECIALIST_IDS = [
  "marketing-campaign-specialist",
  "content-posts-specialist",
  "brand-specialist",
  "marketing-analytics-specialist",
  "advertising-budget-specialist",
] as const;

export type MarketingSpecialistId = (typeof MARKETING_SPECIALIST_IDS)[number];

export const MARKETING_EMPLOYEE_IDS = [
  "employee-marketing-campaign",
  "employee-content-posts",
  "employee-brand",
  "employee-marketing-analytics",
  "employee-advertising-budget",
] as const;
