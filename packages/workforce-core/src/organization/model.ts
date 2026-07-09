import type {
  Organization,
  WorkforceFeatureFlags,
} from "@northbridge/workforce-contracts";
import { normalizeFeatureFlags } from "../feature-flags.js";

export interface CreateOrganizationInput {
  id: string;
  name: string;
  featureFlags?: Partial<WorkforceFeatureFlags>;
  metadata?: Record<string, unknown>;
  now?: string;
}

export function createOrganization(
  input: CreateOrganizationInput,
): Organization {
  const now = input.now ?? new Date().toISOString();
  return {
    id: input.id,
    name: input.name.trim(),
    featureFlags: normalizeFeatureFlags(input.featureFlags),
    metadata: input.metadata,
    createdAt: now,
    updatedAt: now,
  };
}

export function updateOrganization(
  organization: Organization,
  patch: Partial<Pick<Organization, "name" | "metadata" | "featureFlags">>,
  now?: string,
): Organization {
  return {
    ...organization,
    name: patch.name?.trim() ?? organization.name,
    metadata: patch.metadata ?? organization.metadata,
    featureFlags: patch.featureFlags
      ? normalizeFeatureFlags({
          ...organization.featureFlags,
          ...patch.featureFlags,
        })
      : organization.featureFlags,
    updatedAt: now ?? new Date().toISOString(),
  };
}

export function getOrganizationFeatureFlags(
  organization: Organization,
): WorkforceFeatureFlags {
  return normalizeFeatureFlags(organization.featureFlags);
}
