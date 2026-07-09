import type {
  CapabilityRequest,
  ConnectorExecutionResult,
  ConnectorPermissionEnvelope,
  DefaultConnectorRouter,
} from "@northbridge/workforce-connectors";

/**
 * Routes specialist capability requests to connectors without exposing provider details.
 */
export interface CapabilityToolRouter {
  invoke(
    request: CapabilityRequest,
    envelope: ConnectorPermissionEnvelope,
  ): Promise<ConnectorExecutionResult>;
}

export class ConnectorCapabilityToolRouter implements CapabilityToolRouter {
  constructor(private readonly connectorRouter: DefaultConnectorRouter) {}

  invoke(
    request: CapabilityRequest,
    envelope: ConnectorPermissionEnvelope,
  ): Promise<ConnectorExecutionResult> {
    return this.connectorRouter.execute(request, envelope);
  }
}

export function createCapabilityToolRouter(
  connectorRouter: DefaultConnectorRouter,
): CapabilityToolRouter {
  return new ConnectorCapabilityToolRouter(connectorRouter);
}
