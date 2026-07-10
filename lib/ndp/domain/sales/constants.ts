export const SALES_SPECIALIST_IDS = [
  "sales-specialist",
  "lead-qualification-specialist",
  "proposal-quote-specialist",
  "follow-up-specialist",
  "crm-specialist",
] as const;

export const SALES_EMPLOYEE_IDS = [
  "employee-sales",
  "employee-lead-qualification",
  "employee-proposal-quote",
  "employee-follow-up",
  "employee-crm",
] as const;

export type SalesSpecialistId = (typeof SALES_SPECIALIST_IDS)[number];
