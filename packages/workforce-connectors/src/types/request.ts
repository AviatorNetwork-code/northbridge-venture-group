export type ConnectorExecutionStatus = "success" | "failed" | "denied";

export interface CapabilityRequest {
  requestId: string;
  capabilityId: string;
  orgId: string;
  teamId?: string;
  specialistId?: string;
  correlationId?: string;
  input: Record<string, unknown>;
  timestamp: string;
}

export interface ConnectorExecutionResult {
  requestId: string;
  capabilityId: string;
  status: ConnectorExecutionStatus;
  output?: Record<string, unknown>;
  error?: string;
  durationMs?: number;
  metadata?: Record<string, unknown>;
}
