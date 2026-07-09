export type { ConnectorCategory, ConnectorCapability, ConnectorCapabilityQuery } from "./types/capability.js";
export type {
  ConnectorProvider,
  ConnectorProviderQuery,
  ConnectorProviderStatus,
} from "./types/provider.js";
export type {
  ConnectorBinding,
  ConnectorConfigurationReference,
  ConnectorDescriptor,
} from "./types/descriptor.js";
export type { ConnectorHealthSnapshot, ConnectorHealthStatus } from "./types/health.js";
export type {
  CapabilityResolutionRequest,
  CapabilityResolutionResult,
  CapabilityResolutionStatus,
  OrganizationCapabilityAvailability,
  OrganizationCapabilityEntry,
  ProviderSelectionPolicy,
} from "./types/resolution.js";
export type { ConnectorRegistry } from "./types/registry.js";

export {
  NDP_EXECUTION_CAPABILITIES,
  NDP_EXECUTION_CAPABILITY_ID_SET,
  ROUTING_TAG_TO_EXECUTION_CAPABILITIES,
  getExecutionCapability,
  resolveExecutionCapabilitiesForRoutingTag,
} from "./catalog/capabilities.js";

export {
  NDP_CONNECTOR_PROVIDER_CATALOG,
  NDP_CONNECTOR_PROVIDER_ID_SET,
  getConnectorProvider,
  listProvidersByCategory,
} from "./catalog/providers.js";

export { InMemoryConnectorRegistry } from "./registry/in-memory-registry.js";
export {
  createNdpConnectorRegistry,
  createOrgConnectorDescriptor,
  registerDefaultSchedulingConnectors,
  type BootstrapConnectorRegistryOptions,
} from "./registry/bootstrap.js";

export {
  CapabilityResolver,
  type CapabilityResolverOptions,
} from "./resolution/capability-resolver.js";
export {
  PreferredProviderResolver,
  FallbackProviderResolver,
  type ProviderCandidate,
  type PreferredProviderResolverInput,
  type FallbackProviderResolverInput,
} from "./resolution/provider-resolvers.js";

export {
  SPECIALIST_EXECUTION_CAPABILITIES,
  getSpecialistExecutionCapabilities,
  validateSpecialistCapabilityCompatibility,
  validateAllMappedSpecialists,
  type SpecialistCapabilityCompatibilityIssue,
} from "./integration/team-capabilities.js";

export { emitConnectorResolutionEvent } from "./observability/resolution-telemetry.js";
