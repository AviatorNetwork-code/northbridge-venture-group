import { getExecutionCapability } from "@/lib/ndp/connectors";
import type { MarketingSpecialistId } from "../constants.js";

export const MARKETING_EXECUTION_CAPABILITY_IDS = [
  "campaign.create",
  "campaign.review",
  "content.plan",
  "content.calendar",
  "marketing.analyze",
  "budget.review",
] as const;

export const MARKETING_EXECUTION_CAPABILITIES = MARKETING_EXECUTION_CAPABILITY_IDS.map(
  (id) => getExecutionCapability(id)!,
);

export const MARKETING_CAPABILITY_ID_SET = new Set(
  MARKETING_EXECUTION_CAPABILITY_IDS,
);

export const SPECIALIST_PRIMARY_CAPABILITY: Record<MarketingSpecialistId, string> = {
  "marketing-campaign-specialist": "campaign.create",
  "content-posts-specialist": "content.calendar",
  "brand-specialist": "content.plan",
  "marketing-analytics-specialist": "marketing.analyze",
  "advertising-budget-specialist": "budget.review",
};

export function resolveMarketingCapabilityForSpecialist(
  specialistId: string,
): string {
  return (
    SPECIALIST_PRIMARY_CAPABILITY[specialistId as MarketingSpecialistId] ??
    "campaign.review"
  );
}
