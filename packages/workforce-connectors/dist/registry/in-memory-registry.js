export class InMemoryConnectorRegistry {
    capabilities = new Map();
    connectors = new Map();
    registerCapability(capability) {
        this.capabilities.set(capability.id, capability);
    }
    registerConnector(connector) {
        this.connectors.set(connector.definition.id, connector);
    }
    discoverCapabilities(query = {}) {
        let results = [...this.capabilities.values()];
        if (query.capabilityIdPrefix) {
            results = results.filter((entry) => entry.id.startsWith(query.capabilityIdPrefix));
        }
        if (query.tags?.length) {
            results = results.filter((entry) => query.tags.some((tag) => entry.tags?.includes(tag)));
        }
        return results;
    }
    discoverConnectors(query = {}) {
        let results = [...this.connectors.values()].map((connector) => connector.definition);
        if (query.orgId && query.status) {
            results = results.filter((definition) => definition.status === query.status &&
                (definition.orgScope === "platform" ||
                    definition.orgScope === "organization"));
        }
        else if (query.status) {
            results = results.filter((definition) => definition.status === query.status);
        }
        if (query.capabilityId) {
            results = results.filter((definition) => definition.capabilityIds.includes(query.capabilityId));
        }
        return results;
    }
    resolveForCapability(capabilityId, _orgId) {
        for (const connector of this.connectors.values()) {
            if (connector.definition.status !== "disabled" &&
                connector.definition.capabilityIds.includes(capabilityId)) {
                return connector;
            }
        }
        return undefined;
    }
    async getHealth(connectorId, orgId) {
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
    hasCapability(capabilityId) {
        return this.capabilities.has(capabilityId);
    }
}
