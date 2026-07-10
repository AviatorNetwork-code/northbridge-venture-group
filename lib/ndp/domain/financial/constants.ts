export const FINANCIAL_SPECIALIST_IDS = [
  "financial-specialist",
  "billing-specialist",
  "accounts-receivable-specialist",
  "financial-reporting-specialist",
] as const;

export const FINANCIAL_EMPLOYEE_IDS = [
  "employee-financial",
  "employee-billing",
  "employee-accounts-receivable",
  "employee-financial-reporting",
] as const;

export type FinancialSpecialistId = (typeof FINANCIAL_SPECIALIST_IDS)[number];
