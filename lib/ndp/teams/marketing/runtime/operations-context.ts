import type { OrganizationIntelligenceContext } from "@northbridge/operations-intelligence";
import {
  resolveConsumedOperationsSections,
  resolveOrganizationContextRef,
} from "@/lib/ndp/operations-context";
import { MARKETING_TEAM_ID } from "../constants.js";

export interface MarketingTeamRuntimeContext {
  teamId: string;
  organizationId: string;
  organizationContextRef?: string;
  organizationPublicName?: string;
  contextVersion?: string;
  consumedOperationsSections: ReturnType<typeof resolveConsumedOperationsSections>;
}

export function buildMarketingTeamRuntimeContext(input: {
  operationsIntelligence?: OrganizationIntelligenceContext;
}): MarketingTeamRuntimeContext {
  const operationsIntelligence = input.operationsIntelligence;
  const organizationId =
    operationsIntelligence?.organizationId ?? "unknown";

  return {
    teamId: MARKETING_TEAM_ID,
    organizationId,
    organizationContextRef: operationsIntelligence
      ? resolveOrganizationContextRef({
          organizationId: operationsIntelligence.organizationId,
          contextVersion: operationsIntelligence.contextVersion,
        })
      : undefined,
    organizationPublicName: operationsIntelligence?.profile.publicName,
    contextVersion: operationsIntelligence?.contextVersion,
    consumedOperationsSections: resolveConsumedOperationsSections(MARKETING_TEAM_ID),
  };
}
