import type { ConnectorCategory } from "./capability.js";

export type ConnectorProviderStatus = "available" | "deprecated" | "preview";

export interface ConnectorProvider {
  id: string;
  name: string;
  vendor: string;
  category: ConnectorCategory;
  supportedCapabilityIds: string[];
  regions?: string[];
  status: ConnectorProviderStatus;
}

export interface ConnectorProviderQuery {
  category?: ConnectorCategory;
  capabilityId?: string;
  region?: string;
}
