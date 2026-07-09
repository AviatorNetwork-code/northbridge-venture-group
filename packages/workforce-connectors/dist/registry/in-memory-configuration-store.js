export class InMemoryConnectorConfigurationStore {
    configs = new Map();
    key(orgId, connectorId) {
        return `${orgId}:${connectorId}`;
    }
    get(orgId, connectorId) {
        return this.configs.get(this.key(orgId, connectorId));
    }
    set(config) {
        this.configs.set(this.key(config.orgId, config.connectorId), config);
    }
}
