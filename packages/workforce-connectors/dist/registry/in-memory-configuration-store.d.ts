import type { ConnectorConfiguration, ConnectorConfigurationStore } from "../types/configuration.js";
export declare class InMemoryConnectorConfigurationStore implements ConnectorConfigurationStore {
    private readonly configs;
    private key;
    get(orgId: string, connectorId: string): ConnectorConfiguration | undefined;
    set(config: ConnectorConfiguration): void;
}
