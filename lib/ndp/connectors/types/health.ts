export type ConnectorHealthStatus = "healthy" | "degraded" | "unavailable" | "unknown";

export interface ConnectorHealthSnapshot {
  status: ConnectorHealthStatus;
  checkedAt: string;
  message?: string;
}
