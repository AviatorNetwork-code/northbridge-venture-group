import type { CapabilityRequest, ConnectorExecutionResult, ConnectorPermissionEnvelope, DefaultConnectorRouter } from "@northbridge/workforce-connectors";
/**
 * Routes specialist capability requests to connectors without exposing provider details.
 */
export interface CapabilityToolRouter {
    invoke(request: CapabilityRequest, envelope: ConnectorPermissionEnvelope): Promise<ConnectorExecutionResult>;
}
export declare class ConnectorCapabilityToolRouter implements CapabilityToolRouter {
    private readonly connectorRouter;
    constructor(connectorRouter: DefaultConnectorRouter);
    invoke(request: CapabilityRequest, envelope: ConnectorPermissionEnvelope): Promise<ConnectorExecutionResult>;
}
export declare function createCapabilityToolRouter(connectorRouter: DefaultConnectorRouter): CapabilityToolRouter;
