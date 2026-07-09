import type { Organization, WorkforceFeatureFlags } from "@northbridge/workforce-contracts";
export interface CreateOrganizationInput {
    id: string;
    name: string;
    featureFlags?: Partial<WorkforceFeatureFlags>;
    metadata?: Record<string, unknown>;
    now?: string;
}
export declare function createOrganization(input: CreateOrganizationInput): Organization;
export declare function updateOrganization(organization: Organization, patch: Partial<Pick<Organization, "name" | "metadata" | "featureFlags">>, now?: string): Organization;
export declare function getOrganizationFeatureFlags(organization: Organization): WorkforceFeatureFlags;
