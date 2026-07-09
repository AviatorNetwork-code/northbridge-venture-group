import type { ConnectorConfigurationStore } from "../types/configuration.js";
import type { ConnectorPermissionEnvelope, ConnectorPermissionResult } from "../types/permissions.js";
import type { CapabilityRequest, ConnectorExecutionResult } from "../types/request.js";
import type { ConnectorRegistry } from "../types/registry.js";
export interface ConnectorRouterOptions {
    registry: ConnectorRegistry;
    configurationStore?: ConnectorConfigurationStore;
    now?: () => string;
}
/**
 * Routes capability requests to connectors without exposing provider implementation to callers.
 */
export declare class DefaultConnectorRouter {
    private readonly registry;
    private readonly configurationStore?;
    private readonly now;
    constructor(options: ConnectorRouterOptions);
    checkPermission(request: CapabilityRequest, envelope: ConnectorPermissionEnvelope): ConnectorPermissionResult;
    execute(request: CapabilityRequest, envelope: ConnectorPermissionEnvelope): Promise<ConnectorExecutionResult>;
}
export declare function createConnectorRouter(options: ConnectorRouterOptions): DefaultConnectorRouter;
