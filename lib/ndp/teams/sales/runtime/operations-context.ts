import type { OrganizationIntelligenceContext } from "@northbridge/operations-intelligence";
import {
  resolveConsumedOperationsSections,
  resolveOrganizationContextRef,
} from "@/lib/ndp/operations-context";
import { SALES_TEAM_ID } from "../constants.js";

export interface SalesTeamRuntimeContext {
  teamId: string;
  organizationId: string;
  organizationContextRef?: string;
  organizationPublicName?: string;
  contextVersion?: string;
  consumedOperationsSections: ReturnType<typeof resolveConsumedOperationsSections>;
}

export function buildSalesTeamRuntimeContext(input: {
  operationsIntelligence?: OrganizationIntelligenceContext;
}): SalesTeamRuntimeContext {
  const operationsIntelligence = input.operationsIntelligence;
  const organizationId = operationsIntelligence?.organizationId ?? "unknown";

  return {
    teamId: SALES_TEAM_ID,
    organizationId,
    organizationContextRef: operationsIntelligence
      ? resolveOrganizationContextRef({
          organizationId: operationsIntelligence.organizationId,
          contextVersion: operationsIntelligence.contextVersion,
        })
      : undefined,
    organizationPublicName: operationsIntelligence?.profile.publicName,
    contextVersion: operationsIntelligence?.contextVersion,
    consumedOperationsSections: resolveConsumedOperationsSections(SALES_TEAM_ID),
  };
}
