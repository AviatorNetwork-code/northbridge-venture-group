import type { OrganizationIntelligenceContext } from "@northbridge/operations-intelligence";
import {
  resolveConsumedOperationsSections,
  resolveOrganizationContextRef,
} from "@/lib/ndp/operations-context";
import { FINANCIAL_TEAM_ID } from "../constants.js";

export interface FinancialTeamRuntimeContext {
  teamId: string;
  organizationId: string;
  organizationContextRef?: string;
  organizationPublicName?: string;
  contextVersion?: string;
  consumedOperationsSections: ReturnType<typeof resolveConsumedOperationsSections>;
}

export function buildFinancialTeamRuntimeContext(input: {
  operationsIntelligence?: OrganizationIntelligenceContext;
}): FinancialTeamRuntimeContext {
  const operationsIntelligence = input.operationsIntelligence;
  const organizationId = operationsIntelligence?.organizationId ?? "unknown";

  return {
    teamId: FINANCIAL_TEAM_ID,
    organizationId,
    organizationContextRef: operationsIntelligence
      ? resolveOrganizationContextRef({
          organizationId: operationsIntelligence.organizationId,
          contextVersion: operationsIntelligence.contextVersion,
        })
      : undefined,
    organizationPublicName: operationsIntelligence?.profile.publicName,
    contextVersion: operationsIntelligence?.contextVersion,
    consumedOperationsSections: resolveConsumedOperationsSections(FINANCIAL_TEAM_ID),
  };
}
