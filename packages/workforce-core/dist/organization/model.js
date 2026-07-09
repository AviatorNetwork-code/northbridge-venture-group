import { normalizeFeatureFlags } from "../feature-flags.js";
export function createOrganization(input) {
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
export function updateOrganization(organization, patch, now) {
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
export function getOrganizationFeatureFlags(organization) {
    return normalizeFeatureFlags(organization.featureFlags);
}
