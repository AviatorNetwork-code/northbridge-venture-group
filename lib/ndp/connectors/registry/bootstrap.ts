import { InMemoryConnectorRegistry } from "../registry/in-memory-registry.js";
import { NDP_EXECUTION_CAPABILITIES } from "../catalog/capabilities.js";
import { NDP_CONNECTOR_PROVIDER_CATALOG } from "../catalog/providers.js";
import type { ConnectorDescriptor } from "../types/descriptor.js";
import type { ConnectorRegistry } from "../types/registry.js";

export interface BootstrapConnectorRegistryOptions {
  orgId: string;
  descriptors?: ConnectorDescriptor[];
}

/**
 * Creates a registry preloaded with NDP capability and provider metadata.
 * Optionally registers org-specific connector descriptors.
 */
export function createNdpConnectorRegistry(
  options?: BootstrapConnectorRegistryOptions,
): ConnectorRegistry {
  const registry = new InMemoryConnectorRegistry();

  for (const capability of NDP_EXECUTION_CAPABILITIES) {
    registry.registerCapability(capability);
  }

  for (const provider of NDP_CONNECTOR_PROVIDER_CATALOG) {
    registry.registerProvider(provider);
  }

  if (options?.descriptors) {
    for (const descriptor of options.descriptors) {
      registry.registerDescriptor(descriptor);
    }
  }

  return registry;
}

export function createOrgConnectorDescriptor(input: {
  orgId: string;
  providerId: string;
  capabilityIds: string[];
  connectorId?: string;
  label?: string;
  enabled?: boolean;
  priority?: number;
}): ConnectorDescriptor {
  const connectorId =
    input.connectorId ?? `${input.orgId}:${input.providerId}`;

  return {
    connectorId,
    providerId: input.providerId,
    orgId: input.orgId,
    label: input.label ?? input.providerId,
    enabled: input.enabled ?? true,
    binding: {
      providerId: input.providerId,
      capabilityIds: input.capabilityIds,
      priority: input.priority,
    },
    health: {
      status: "healthy",
      checkedAt: new Date().toISOString(),
    },
  };
}

/**
 * Registers default scheduling connector bindings for an organization.
 */
export function registerDefaultSchedulingConnectors(
  registry: ConnectorRegistry,
  orgId: string,
  preferredProviderId = "provider:google-calendar",
): void {
  registry.registerOrgPolicy({
    orgId,
    capabilityId: "schedule.create",
    preferredProviderId,
    fallbackProviderIds: ["provider:microsoft-outlook", "provider:calendly"],
  });
  registry.registerOrgPolicy({
    orgId,
    capabilityId: "schedule.update",
    preferredProviderId,
    fallbackProviderIds: ["provider:microsoft-outlook", "provider:calendly"],
  });
  registry.registerOrgPolicy({
    orgId,
    capabilityId: "schedule.cancel",
    preferredProviderId,
    fallbackProviderIds: ["provider:microsoft-outlook", "provider:calendly"],
  });

  for (const providerId of [
    preferredProviderId,
    "provider:microsoft-outlook",
    "provider:calendly",
  ]) {
    registry.registerDescriptor(
      createOrgConnectorDescriptor({
        orgId,
        providerId,
        capabilityIds: ["schedule.create", "schedule.update", "schedule.cancel"],
        priority: providerId === preferredProviderId ? 10 : 5,
      }),
    );
  }
}
