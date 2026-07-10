import { getExecutionCapability } from "@/lib/ndp/connectors";
import type { SalesSpecialistId } from "../constants.js";

export const SALES_EXECUTION_CAPABILITY_IDS = [
  "sales.analyze",
  "lead.qualify",
  "proposal.prepare",
  "followup.plan",
  "crm.update",
  "pipeline.review",
] as const;

export const SALES_EXECUTION_CAPABILITIES = SALES_EXECUTION_CAPABILITY_IDS.map(
  (id) => getExecutionCapability(id)!,
);

export const SALES_CAPABILITY_ID_SET = new Set(SALES_EXECUTION_CAPABILITY_IDS);

export const SPECIALIST_PRIMARY_CAPABILITY: Record<SalesSpecialistId, string> = {
  "sales-specialist": "sales.analyze",
  "lead-qualification-specialist": "lead.qualify",
  "proposal-quote-specialist": "proposal.prepare",
  "follow-up-specialist": "followup.plan",
  "crm-specialist": "crm.update",
};

export function resolveSalesCapabilityForSpecialist(specialistId: string): string {
  return (
    SPECIALIST_PRIMARY_CAPABILITY[specialistId as SalesSpecialistId] ?? "pipeline.review"
  );
}
