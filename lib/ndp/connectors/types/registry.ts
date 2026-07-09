import type { ConnectorCapability, ConnectorCapabilityQuery } from "./capability.js";
import type { ConnectorDescriptor } from "./descriptor.js";
import type { ConnectorProvider, ConnectorProviderQuery } from "./provider.js";
import type { ProviderSelectionPolicy } from "./resolution.js";

export interface ConnectorRegistry {
  registerCapability(capability: ConnectorCapability): void;
  registerProvider(provider: ConnectorProvider): void;
  registerDescriptor(descriptor: ConnectorDescriptor): void;
  registerOrgPolicy(policy: ProviderSelectionPolicy): void;
  getCapability(id: string): ConnectorCapability | undefined;
  getProvider(id: string): ConnectorProvider | undefined;
  getDescriptor(connectorId: string): ConnectorDescriptor | undefined;
  hasCapability(id: string): boolean;
  listCapabilities(query?: ConnectorCapabilityQuery): ConnectorCapability[];
  listProviders(query?: ConnectorProviderQuery): ConnectorProvider[];
  listDescriptors(orgId: string): ConnectorDescriptor[];
  listOrgPolicies(orgId: string): ProviderSelectionPolicy[];
  getOrgPolicy(orgId: string, capabilityId: string): ProviderSelectionPolicy | undefined;
}
