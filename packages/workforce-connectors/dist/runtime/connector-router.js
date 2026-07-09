import { canPerformAction } from "@northbridge/workforce-core";
import { ConnectorError } from "./errors.js";
/**
 * Routes capability requests to connectors without exposing provider implementation to callers.
 */
export class DefaultConnectorRouter {
    registry;
    configurationStore;
    now;
    constructor(options) {
        this.registry = options.registry;
        this.configurationStore = options.configurationStore;
        this.now = options.now ?? (() => new Date().toISOString());
    }
    checkPermission(request, envelope) {
        if (!this.registry.hasCapability(request.capabilityId)) {
            return {
                allowed: false,
                reason: `Capability '${request.capabilityId}' is not registered`,
            };
        }
        const capability = this.registry
            .discoverCapabilities()
            .find((entry) => entry.id === request.capabilityId);
        if (!capability) {
            return {
                allowed: false,
                reason: `Capability '${request.capabilityId}' is not registered`,
            };
        }
        const permission = canPerformAction(envelope.permissions, capability.requiredPermission);
        if (!permission.allowed) {
            return permission;
        }
        const connector = this.registry.resolveForCapability(request.capabilityId, request.orgId);
        if (!connector) {
            return {
                allowed: false,
                reason: `No connector available for capability '${request.capabilityId}'`,
            };
        }
        if (connector.definition.status === "disabled") {
            return {
                allowed: false,
                reason: `Connector '${connector.definition.id}' is disabled`,
            };
        }
        return connector.checkPermission(request, envelope);
    }
    async execute(request, envelope) {
        const permission = this.checkPermission(request, envelope);
        if (!permission.allowed) {
            return {
                requestId: request.requestId,
                capabilityId: request.capabilityId,
                status: "denied",
                error: permission.reason ?? "Permission denied",
            };
        }
        const connector = this.registry.resolveForCapability(request.capabilityId, request.orgId);
        if (!connector) {
            throw new ConnectorError("connector_not_found", `No connector for capability '${request.capabilityId}'`, { capabilityId: request.capabilityId, orgId: request.orgId });
        }
        const config = this.configurationStore?.get(request.orgId, connector.definition.id);
        const started = Date.now();
        try {
            const result = await connector.execute(request, config);
            return {
                ...result,
                durationMs: result.durationMs ?? Date.now() - started,
            };
        }
        catch (error) {
            return {
                requestId: request.requestId,
                capabilityId: request.capabilityId,
                status: "failed",
                error: error instanceof Error ? error.message : "Connector execution failed",
                durationMs: Date.now() - started,
                metadata: { timestamp: this.now() },
            };
        }
    }
}
export function createConnectorRouter(options) {
    return new DefaultConnectorRouter(options);
}
