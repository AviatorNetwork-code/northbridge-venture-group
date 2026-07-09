import type { ConnectorRegistry } from "../types/registry.js";
import type { ConnectorDescriptor } from "../types/descriptor.js";
import type { ProviderSelectionPolicy } from "../types/resolution.js";

export interface ProviderCandidate {
  providerId: string;
  connectorId?: string;
  enabled: boolean;
  healthy: boolean;
  priority: number;
}

export interface PreferredProviderResolverInput {
  registry: ConnectorRegistry;
  orgId: string;
  capabilityId: string;
  policy?: ProviderSelectionPolicy;
  region?: string;
}

export class PreferredProviderResolver {
  resolve(input: PreferredProviderResolverInput): ProviderCandidate | undefined {
    const { registry, orgId, capabilityId, policy, region } = input;
    const preferredId = policy?.preferredProviderId;
    if (!preferredId) {
      return undefined;
    }

    if (policy?.disabledProviderIds?.includes(preferredId)) {
      return undefined;
    }

    const provider = registry.getProvider(preferredId);
    if (!provider?.supportedCapabilityIds.includes(capabilityId)) {
      return undefined;
    }

    if (region && provider.regions && !providerSupportsRegion(provider.regions, region)) {
      return undefined;
    }

    const descriptor = findEnabledDescriptor(registry, orgId, preferredId, capabilityId);
    if (!descriptor) {
      return undefined;
    }

    return {
      providerId: preferredId,
      connectorId: descriptor.connectorId,
      enabled: descriptor.enabled,
      healthy: isDescriptorHealthy(descriptor),
      priority: descriptor.binding.priority ?? 0,
    };
  }
}

export interface FallbackProviderResolverInput {
  registry: ConnectorRegistry;
  orgId: string;
  capabilityId: string;
  policy?: ProviderSelectionPolicy;
  region?: string;
  excludeProviderIds?: string[];
}

export class FallbackProviderResolver {
  resolve(input: FallbackProviderResolverInput): ProviderCandidate | undefined {
    const {
      registry,
      orgId,
      capabilityId,
      policy,
      region,
      excludeProviderIds = [],
    } = input;

    const fallbackIds = policy?.fallbackProviderIds ?? [];
    const disabledIds = new Set(policy?.disabledProviderIds ?? []);
    const excluded = new Set(excludeProviderIds);

    for (const providerId of fallbackIds) {
      if (disabledIds.has(providerId) || excluded.has(providerId)) {
        continue;
      }

      const provider = registry.getProvider(providerId);
      if (!provider?.supportedCapabilityIds.includes(capabilityId)) {
        continue;
      }

      if (region && provider.regions && !providerSupportsRegion(provider.regions, region)) {
        continue;
      }

      const descriptor = findEnabledDescriptor(registry, orgId, providerId, capabilityId);
      if (!descriptor) {
        continue;
      }

      return {
        providerId,
        connectorId: descriptor.connectorId,
        enabled: descriptor.enabled,
        healthy: isDescriptorHealthy(descriptor),
        priority: descriptor.binding.priority ?? 0,
      };
    }

    return resolveDefaultProvider(registry, orgId, capabilityId, region, [
      ...excluded,
      ...disabledIds,
    ]);
  }
}

function resolveDefaultProvider(
  registry: ConnectorRegistry,
  orgId: string,
  capabilityId: string,
  region: string | undefined,
  excludeProviderIds: Iterable<string>,
): ProviderCandidate | undefined {
  const excluded = new Set(excludeProviderIds);
  const candidates = registry
    .listProviders({ capabilityId, region })
    .filter((provider) => !excluded.has(provider.id))
    .map((provider) => {
      const descriptor = findEnabledDescriptor(
        registry,
        orgId,
        provider.id,
        capabilityId,
      );
      if (!descriptor) {
        return undefined;
      }
      return {
        providerId: provider.id,
        connectorId: descriptor.connectorId,
        enabled: descriptor.enabled,
        healthy: isDescriptorHealthy(descriptor),
        priority: descriptor.binding.priority ?? 0,
      };
    })
    .filter((entry): entry is ProviderCandidate => entry !== undefined)
    .sort((left, right) => right.priority - left.priority);

  return candidates[0];
}

function findEnabledDescriptor(
  registry: ConnectorRegistry,
  orgId: string,
  providerId: string,
  capabilityId: string,
): ConnectorDescriptor | undefined {
  return registry.listDescriptors(orgId).find(
    (descriptor) =>
      descriptor.providerId === providerId &&
      descriptor.enabled &&
      descriptor.binding.capabilityIds.includes(capabilityId),
  );
}

function isDescriptorHealthy(descriptor: ConnectorDescriptor): boolean {
  if (!descriptor.health) {
    return true;
  }
  return descriptor.health.status === "healthy" || descriptor.health.status === "degraded";
}

function providerSupportsRegion(regions: string[], region: string): boolean {
  return regions.includes("global") || regions.includes(region);
}
