import { getExecutionCapability } from "@/lib/ndp/connectors";
import type { FinancialSpecialistId } from "../constants.js";

export const FINANCIAL_EXECUTION_CAPABILITY_IDS = [
  "finance.analyze",
  "billing.review",
  "invoice.prepare",
  "receivables.review",
  "payment.followup",
  "financial.report",
] as const;

export const FINANCIAL_EXECUTION_CAPABILITIES = FINANCIAL_EXECUTION_CAPABILITY_IDS.map(
  (id) => getExecutionCapability(id)!,
);

export const FINANCIAL_CAPABILITY_ID_SET = new Set(FINANCIAL_EXECUTION_CAPABILITY_IDS);

export const SPECIALIST_PRIMARY_CAPABILITY: Record<FinancialSpecialistId, string> = {
  "financial-specialist": "finance.analyze",
  "billing-specialist": "billing.review",
  "accounts-receivable-specialist": "receivables.review",
  "financial-reporting-specialist": "financial.report",
};

export function resolveFinancialCapabilityForSpecialist(specialistId: string): string {
  return (
    SPECIALIST_PRIMARY_CAPABILITY[specialistId as FinancialSpecialistId] ?? "finance.analyze"
  );
}
