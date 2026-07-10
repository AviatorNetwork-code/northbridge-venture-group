export type OrganizationAccessResolution =
  | { status: "allowed" }
  | { status: "denied" }
  | { status: "unavailable" };

export interface MobileOrganizationAccess {
  organizationId: string;
  customerId: string;
}

export interface OrganizationAccessResolver {
  resolve(input: {
    customerId: string;
    organizationId: string;
  }): Promise<OrganizationAccessResolution>;
}

export class InMemoryOrganizationAccessResolver implements OrganizationAccessResolver {
  constructor(
    private readonly memberships: Map<string, Set<string>>,
    private readonly availableOrganizations: Set<string>,
  ) {}

  async resolve(input: {
    customerId: string;
    organizationId: string;
  }): Promise<OrganizationAccessResolution> {
    if (!this.availableOrganizations.has(input.organizationId)) {
      return { status: "unavailable" };
    }

    const members = this.memberships.get(input.organizationId);
    if (!members?.has(input.customerId)) {
      return { status: "denied" };
    }

    return { status: "allowed" };
  }
}

export function createExampleOrganizationAccessResolver(): InMemoryOrganizationAccessResolver {
  const memberships = new Map<string, Set<string>>([
    ["org-acme", new Set(["customer-1", "customer-2"])],
    ["org-beta", new Set(["customer-2"])],
  ]);

  return new InMemoryOrganizationAccessResolver(
    memberships,
    new Set(["org-acme", "org-beta"]),
  );
}
