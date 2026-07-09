import type { OrganizationIntelligenceContext } from "@northbridge/operations-intelligence";
import {
  MARKETING_TEAM_ORGANIZATION_CONTEXT_REFERENCE,
  TEAM_ORGANIZATION_CONTEXT_REFERENCES,
  type TeamOrganizationContextReference,
} from "@northbridge/operations-intelligence";
import { buildOperationsIntelligenceContextForOrg } from "./references.js";

export interface OperationsIntelligenceLoader {
  load(orgId: string, customerId: string): Promise<OrganizationIntelligenceContext>;
}

export class InMemoryOperationsIntelligenceLoader implements OperationsIntelligenceLoader {
  constructor(private readonly records: Map<string, OrganizationIntelligenceContext>) {}

  async load(orgId: string, _customerId: string): Promise<OrganizationIntelligenceContext> {
    const record = this.records.get(orgId);
    if (!record) {
      throw new Error(`Operations intelligence not found: ${orgId}`);
    }
    return record;
  }
}

export function createExampleOperationsIntelligenceLoader(
  organizationIds: string[],
  options?: { now?: () => string },
): InMemoryOperationsIntelligenceLoader {
  const records = new Map<string, OrganizationIntelligenceContext>();

  for (const organizationId of organizationIds) {
    records.set(
      organizationId,
      buildOperationsIntelligenceContextForOrg(organizationId, options),
    );
  }

  return new InMemoryOperationsIntelligenceLoader(records);
}

export function resolveTeamOperationsContextReference(
  teamId: string,
): TeamOrganizationContextReference | undefined {
  return TEAM_ORGANIZATION_CONTEXT_REFERENCES.find((entry) => entry.teamId === teamId);
}

export function resolveConsumedOperationsSections(
  teamId: string,
): TeamOrganizationContextReference["consumedSections"] {
  return (
    resolveTeamOperationsContextReference(teamId)?.consumedSections ??
    MARKETING_TEAM_ORGANIZATION_CONTEXT_REFERENCE.consumedSections
  );
}
