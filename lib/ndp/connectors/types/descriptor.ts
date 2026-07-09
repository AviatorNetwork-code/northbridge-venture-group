import type { ConnectorHealthSnapshot } from "./health.js";

export interface ConnectorConfigurationReference {
  configId: string;
  orgId: string;
  providerId: string;
  configured: boolean;
  lastValidatedAt?: string;
}

export interface ConnectorBinding {
  providerId: string;
  capabilityIds: string[];
  priority?: number;
}

export interface ConnectorDescriptor {
  connectorId: string;
  providerId: string;
  orgId: string;
  label: string;
  enabled: boolean;
  binding: ConnectorBinding;
  configurationRef?: ConnectorConfigurationReference;
  health?: ConnectorHealthSnapshot;
}
