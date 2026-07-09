/**
 * Platform capability — what a specialist may request.
 * Does not name any external provider or SDK.
 */
export interface ConnectorCapabilityDefinition {
  id: string;
  /** Permission action checked via workforce-core against caller permissions. */
  requiredPermission: string;
  description?: string;
  /** Optional tags for discovery filters (e.g. "scheduling", "crm"). */
  tags?: string[];
}

export interface CapabilityDiscoveryQuery {
  orgId?: string;
  tags?: string[];
  capabilityIdPrefix?: string;
}
