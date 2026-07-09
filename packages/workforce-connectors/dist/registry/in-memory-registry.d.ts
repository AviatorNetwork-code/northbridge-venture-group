import type { ConnectorCapabilityDefinition, CapabilityDiscoveryQuery } from "../types/capability.js";
import type { Connector, ConnectorDefinition, ConnectorDiscoveryQuery } from "../types/connector.js";
import type { ConnectorHealth } from "../types/health.js";
import type { ConnectorRegistry } from "../types/registry.js";
export declare class InMemoryConnectorRegistry implements ConnectorRegistry {
    private readonly capabilities;
    private readonly connectors;
    registerCapability(capability: ConnectorCapabilityDefinition): void;
    registerConnector(connector: Connector): void;
    discoverCapabilities(query?: CapabilityDiscoveryQuery): ConnectorCapabilityDefinition[];
    discoverConnectors(query?: ConnectorDiscoveryQuery): ConnectorDefinition[];
    resolveForCapability(capabilityId: string, _orgId: string): Connector | undefined;
    getHealth(connectorId: string, orgId: string): Promise<ConnectorHealth>;
    hasCapability(capabilityId: string): boolean;
}
