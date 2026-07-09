import type {
  ConnectorConfiguration,
  ConnectorConfigurationStore,
} from "../types/configuration.js";

export class InMemoryConnectorConfigurationStore
  implements ConnectorConfigurationStore
{
  private readonly configs = new Map<string, ConnectorConfiguration>();

  private key(orgId: string, connectorId: string): string {
    return `${orgId}:${connectorId}`;
  }

  get(orgId: string, connectorId: string): ConnectorConfiguration | undefined {
    return this.configs.get(this.key(orgId, connectorId));
  }

  set(config: ConnectorConfiguration): void {
    this.configs.set(this.key(config.orgId, config.connectorId), config);
  }
}
