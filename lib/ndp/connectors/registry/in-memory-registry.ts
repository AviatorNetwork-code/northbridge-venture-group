import type { ConnectorRegistry } from "../types/registry.js";
import type { ConnectorDescriptor } from "../types/descriptor.js";
import type { ConnectorCapability, ConnectorCapabilityQuery } from "../types/capability.js";
import type { ConnectorProvider, ConnectorProviderQuery } from "../types/provider.js";
import type { ProviderSelectionPolicy } from "../types/resolution.js";

export class InMemoryConnectorRegistry implements ConnectorRegistry {
  private readonly capabilities = new Map<string, ConnectorCapability>();
  private readonly providers = new Map<string, ConnectorProvider>();
  private readonly descriptors = new Map<string, ConnectorDescriptor>();
  private readonly orgPolicies = new Map<string, ProviderSelectionPolicy>();

  registerCapability(capability: ConnectorCapability): void {
    this.capabilities.set(capability.id, capability);
  }

  registerProvider(provider: ConnectorProvider): void {
    this.providers.set(provider.id, provider);
  }

  registerDescriptor(descriptor: ConnectorDescriptor): void {
    this.descriptors.set(descriptor.connectorId, descriptor);
  }

  registerOrgPolicy(policy: ProviderSelectionPolicy): void {
    const key = `${policy.orgId}:${policy.capabilityId}`;
    this.orgPolicies.set(key, policy);
  }

  getCapability(id: string): ConnectorCapability | undefined {
    return this.capabilities.get(id);
  }

  getProvider(id: string): ConnectorProvider | undefined {
    return this.providers.get(id);
  }

  getDescriptor(connectorId: string): ConnectorDescriptor | undefined {
    return this.descriptors.get(connectorId);
  }

  hasCapability(id: string): boolean {
    return this.capabilities.has(id);
  }

  listCapabilities(query?: ConnectorCapabilityQuery): ConnectorCapability[] {
    let entries = [...this.capabilities.values()];
    if (query?.category) {
      entries = entries.filter((entry) => entry.category === query.category);
    }
    if (query?.tag) {
      entries = entries.filter((entry) => entry.tags?.includes(query.tag!));
    }
    return entries;
  }

  listProviders(query?: ConnectorProviderQuery): ConnectorProvider[] {
    let entries = [...this.providers.values()];
    if (query?.category) {
      entries = entries.filter((entry) => entry.category === query.category);
    }
    if (query?.capabilityId) {
      entries = entries.filter((entry) =>
        entry.supportedCapabilityIds.includes(query.capabilityId!),
      );
    }
    if (query?.region) {
      entries = entries.filter(
        (entry) =>
          !entry.regions ||
          entry.regions.includes("global") ||
          entry.regions.includes(query.region!),
      );
    }
    return entries;
  }

  listDescriptors(orgId: string): ConnectorDescriptor[] {
    return [...this.descriptors.values()].filter(
      (entry) => entry.orgId === orgId,
    );
  }

  listOrgPolicies(orgId: string): ProviderSelectionPolicy[] {
    return [...this.orgPolicies.values()].filter(
      (entry) => entry.orgId === orgId,
    );
  }

  getOrgPolicy(
    orgId: string,
    capabilityId: string,
  ): ProviderSelectionPolicy | undefined {
    return this.orgPolicies.get(`${orgId}:${capabilityId}`);
  }
}
