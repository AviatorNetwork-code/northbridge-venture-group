export { ProductCapabilityBroker, createProductCapabilityBroker, PCB_GOVERNANCE } from "./core/productCapabilityBroker.js";
export { ProductRegistry, createDefaultProductRegistry } from "./registry/productRegistry.js";
export {
  validateCapabilityResponse,
  detectHallucinationRisk,
  findBlockedClaimsForQuestion,
} from "./engines/capabilityResponseValidator.js";
export {
  applyDisclosureGuardrails,
  enforceRoadmapDisclosureRules,
  blockUnsupportedClaimsInAnswer,
} from "./engines/disclosureGuardrails.js";
export {
  synthesizePublicAnswer,
  synthesizeConsultantAnswer,
} from "./engines/publicSafeSynthesis.js";
export {
  DEFAULT_PRODUCT_ADAPTERS,
  aviatorNetworkCapabilityAdapter,
  quadrixCapabilityAdapter,
  northbridgeDigitalServicesAdapter,
  airTaxCapabilityAdapter,
  createGenericProductAdapter,
} from "./adapters/defaultProductAdapters.js";
export {
  registerPCBCapability,
  getPCBCapabilityRegistration,
  PCB_CAPABILITY,
} from "./registration/capabilityRegistration.js";
export type {
  ProductCapabilityAdapter,
  ProductCapabilityRequest,
  ProductCapabilityResponse,
  BrokeredCapabilityResult,
  CapabilityItem,
  CapabilityConfidence,
  DisclosureLevel,
  VisitorContext,
  UnsupportedClaim,
  ProductOwnershipMetadata,
} from "./types/index.js";
