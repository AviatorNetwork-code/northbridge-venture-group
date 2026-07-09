export type ConnectorHealthStatus =
  | "healthy"
  | "degraded"
  | "unavailable"
  | "unknown";

export interface ConnectorHealth {
  connectorId: string;
  status: ConnectorHealthStatus;
  checkedAt: string;
  message?: string;
  latencyMs?: number;
}

export interface ConnectorHealthChecker {
  check(connectorId: string, orgId: string): Promise<ConnectorHealth>;
}
