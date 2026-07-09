/**
 * Opaque connector configuration — products supply values; platform never embeds SDK keys.
 */
export interface ConnectorConfiguration {
  connectorId: string;
  orgId: string;
  /** Schema version for migration without breaking stored config. */
  version: 1;
  /** Non-secret settings (feature flags, scopes, endpoints labels). */
  settings: Record<string, unknown>;
  /** Reference to secret store — never inline secrets in platform code. */
  credentialRef?: string;
  updatedAt: string;
}

export interface ConnectorConfigurationStore {
  get(orgId: string, connectorId: string): ConnectorConfiguration | undefined;
  set(config: ConnectorConfiguration): void;
}
