import type { ConnectorCapabilityDefinition, CapabilityDiscoveryQuery } from "../types/capability.js";
import type { Connector, ConnectorDefinition, ConnectorDiscoveryQuery } from "../types/connector.js";
import type { ConnectorHealth } from "../types/health.js";
import type { ConnectorRegistry } from "../types/registry.js";

export class InMemoryConnectorRegistry implements ConnectorRegistry {
  private readonly capabilities = new Map<string, ConnectorCapabilityDefinition>();
  private readonly connectors = new Map<string, Connector>();

  registerCapability(capability: ConnectorCapabilityDefinition): void {
    this.capabilities.set(capability.id, capability);
  }

  registerConnector(connector: Connector): void {
    this.connectors.set(connector.definition.id, connector);
  }

  discoverCapabilities(
    query: CapabilityDiscoveryQuery = {},
  ): ConnectorCapabilityDefinition[] {
    let results = [...this.capabilities.values()];

    if (query.capabilityIdPrefix) {
      results = results.filter((entry) =>
        entry.id.startsWith(query.capabilityIdPrefix!),
      );
    }

    if (query.tags?.length) {
      results = results.filter((entry) =>
        query.tags!.some((tag) => entry.tags?.includes(tag)),
      );
    }

    return results;
  }

  discoverConnectors(
    query: ConnectorDiscoveryQuery = {},
  ): ConnectorDefinition[] {
    let results = [...this.connectors.values()].map(
      (connector) => connector.definition,
    );

    if (query.orgId && query.status) {
      results = results.filter(
        (definition) =>
          definition.status === query.status &&
          (definition.orgScope === "platform" ||
            definition.orgScope === "organization"),
      );
    } else if (query.status) {
      results = results.filter(
        (definition) => definition.status === query.status,
      );
    }

    if (query.capabilityId) {
      results = results.filter((definition) =>
        definition.capabilityIds.includes(query.capabilityId!),
      );
    }

    return results;
  }

  resolveForCapability(
    capabilityId: string,
    _orgId: string,
  ): Connector | undefined {
    for (const connector of this.connectors.values()) {
      if (
        connector.definition.status !== "disabled" &&
        connector.definition.capabilityIds.includes(capabilityId)
      ) {
        return connector;
      }
    }
    return undefined;
  }

  async getHealth(connectorId: string, orgId: string): Promise<ConnectorHealth> {
    const connector = this.connectors.get(connectorId);
    if (!connector) {
      return {
        connectorId,
        status: "unknown",
        checkedAt: new Date().toISOString(),
        message: "Connector not registered",
      };
    }
    return connector.health(orgId);
  }

  hasCapability(capabilityId: string): boolean {
    return this.capabilities.has(capabilityId);
  }
}
