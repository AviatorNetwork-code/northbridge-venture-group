import type { ConnectorCapabilityDefinition, CapabilityDiscoveryQuery } from "./capability.js";
import type { Connector, ConnectorDefinition, ConnectorDiscoveryQuery } from "./connector.js";
import type { ConnectorHealth } from "./health.js";

export interface ConnectorRegistry {
  registerCapability(capability: ConnectorCapabilityDefinition): void;
  registerConnector(connector: Connector): void;
  discoverCapabilities(query?: CapabilityDiscoveryQuery): ConnectorCapabilityDefinition[];
  discoverConnectors(query?: ConnectorDiscoveryQuery): ConnectorDefinition[];
  resolveForCapability(
    capabilityId: string,
    orgId: string,
  ): Connector | undefined;
  getHealth(connectorId: string, orgId: string): Promise<ConnectorHealth>;
  hasCapability(capabilityId: string): boolean;
}
