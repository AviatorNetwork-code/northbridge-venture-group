export class ConnectorCapabilityToolRouter {
    connectorRouter;
    constructor(connectorRouter) {
        this.connectorRouter = connectorRouter;
    }
    invoke(request, envelope) {
        return this.connectorRouter.execute(request, envelope);
    }
}
export function createCapabilityToolRouter(connectorRouter) {
    return new ConnectorCapabilityToolRouter(connectorRouter);
}
