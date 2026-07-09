import type { Organization } from "@northbridge/workforce-contracts";
import { normalizeFeatureFlags } from "@northbridge/workforce-core";
import type {
  OrganizationContext,
  SubscriptionContext,
  TeamContext,
} from "../types/conversation-context.js";
import type {
  OrganizationContextLoader,
  SubscriptionResolver,
  TeamResolver,
} from "./builders.js";

export interface InMemoryOrganizationRecord {
  organization: Organization;
  permissions?: string[];
}

export class InMemoryOrganizationContextLoader implements OrganizationContextLoader {
  constructor(private readonly records: Map<string, InMemoryOrganizationRecord>) {}

  async load(orgId: string, _customerId: string): Promise<OrganizationContext> {
    const record = this.records.get(orgId);
    if (!record) {
      throw new Error(`Organization not found: ${orgId}`);
    }

    return {
      orgId,
      organization: record.organization,
      featureFlags: normalizeFeatureFlags(record.organization.featureFlags),
      permissions: record.permissions ?? ["conversation:read", "conversation:write"],
    };
  }
}

export class InMemorySubscriptionResolver implements SubscriptionResolver {
  constructor(private readonly subscriptions: Map<string, SubscriptionContext>) {}

  private key(orgId: string, customerId: string): string {
    return `${orgId}:${customerId}`;
  }

  async resolve(orgId: string, customerId: string): Promise<SubscriptionContext> {
    const existing = this.subscriptions.get(this.key(orgId, customerId));
    if (existing) return existing;

    return {
      orgId,
      customerId,
      status: "missing",
      entitledTeamIds: [],
    };
  }
}

export class InMemoryTeamResolver implements TeamResolver {
  constructor(private readonly teams: Map<string, TeamContext>) {}

  private key(orgId: string, customerId: string): string {
    return `${orgId}:${customerId}`;
  }

  async resolve(orgId: string, customerId: string): Promise<TeamContext> {
    return (
      this.teams.get(this.key(orgId, customerId)) ?? {
        hiredTeamIds: [],
        activeConversations: [],
      }
    );
  }
}

export function createTestOrganization(
  orgId: string,
  overrides?: Partial<Organization>,
): Organization {
  const now = new Date().toISOString();
  return {
    id: orgId,
    name: `Organization ${orgId}`,
    featureFlags: {
      managersEnabled: false,
      directorsEnabled: false,
      vpsEnabled: false,
    },
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}
