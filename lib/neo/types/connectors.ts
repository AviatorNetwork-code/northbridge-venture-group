import type { ConnectorStatus } from "./common";

export interface Connector {
  id: string;
  name: string;
  category: string;
  status: ConnectorStatus;
  oauthConnected: boolean;
  lastSyncAt?: string;
  permissions: string[];
  usageToday: number;
  usageLimit: number;
  healthScore: number;
  refreshTokenAgeDays: number;
  errorMessage?: string;
}

export interface ConnectorCenterSnapshot {
  connectors: Connector[];
  lastUpdated: string;
}
