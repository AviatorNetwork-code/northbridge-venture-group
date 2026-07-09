export type CapabilityResolutionStatus =
  | "resolved"
  | "fallback"
  | "unavailable"
  | "not_found";

export interface ProviderSelectionPolicy {
  orgId: string;
  capabilityId: string;
  preferredProviderId?: string;
  fallbackProviderIds?: string[];
  disabledProviderIds?: string[];
  region?: string;
}

export interface CapabilityResolutionRequest {
  orgId: string;
  capabilityId: string;
  region?: string;
  correlationId?: string;
}

export interface CapabilityResolutionResult {
  capabilityId: string;
  orgId: string;
  status: CapabilityResolutionStatus;
  providerId?: string;
  connectorId?: string;
  selectionReason: string;
  attemptedProviderIds: string[];
  region?: string;
}

export interface OrganizationCapabilityAvailability {
  orgId: string;
  region?: string;
  capabilities: OrganizationCapabilityEntry[];
}

export interface OrganizationCapabilityEntry {
  capabilityId: string;
  label: string;
  category: string;
  available: boolean;
  status: CapabilityResolutionStatus;
  providerId?: string;
  connectorId?: string;
}
