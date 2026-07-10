import type { OrganizationIntelligenceContext } from "@northbridge/operations-intelligence";
import {
  resolveConsumedOperationsSections,
  resolveOrganizationContextRef,
} from "@/lib/ndp/operations-context";
import { CUSTOMER_SERVICE_TEAM_ID } from "../constants.js";

export interface CustomerServiceTeamRuntimeContext {
  teamId: string;
  organizationId: string;
  organizationContextRef?: string;
  organizationPublicName?: string;
  contextVersion?: string;
  consumedOperationsSections: ReturnType<typeof resolveConsumedOperationsSections>;
}

export function buildCustomerServiceTeamRuntimeContext(input: {
  operationsIntelligence?: OrganizationIntelligenceContext;
}): CustomerServiceTeamRuntimeContext {
  const operationsIntelligence = input.operationsIntelligence;
  const organizationId = operationsIntelligence?.organizationId ?? "unknown";

  return {
    teamId: CUSTOMER_SERVICE_TEAM_ID,
    organizationId,
    organizationContextRef: operationsIntelligence
      ? resolveOrganizationContextRef({
          organizationId: operationsIntelligence.organizationId,
          contextVersion: operationsIntelligence.contextVersion,
        })
      : undefined,
    organizationPublicName: operationsIntelligence?.profile.publicName,
    contextVersion: operationsIntelligence?.contextVersion,
    consumedOperationsSections: resolveConsumedOperationsSections(CUSTOMER_SERVICE_TEAM_ID),
  };
}
