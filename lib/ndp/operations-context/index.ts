export {
  resolveOrganizationContextRef,
  buildOperationsContextReferences,
  buildOperationsIntelligenceContextForOrg,
  type OperationsContextRefOptions,
  type BuildOperationsContextReferencesInput,
} from "./references.js";

export {
  InMemoryOperationsIntelligenceLoader,
  createExampleOperationsIntelligenceLoader,
  resolveTeamOperationsContextReference,
  resolveConsumedOperationsSections,
  type OperationsIntelligenceLoader,
} from "./loaders.js";

export type {
  OrganizationIntelligenceContext,
  OrganizationIntelligenceInput,
  OrganizationProfile,
  TeamOrganizationContextReference,
} from "@northbridge/operations-intelligence";

export {
  buildOrganizationContext,
  buildExampleSkywardOrganizationInput,
  MARKETING_TEAM_ORGANIZATION_CONTEXT_REFERENCE,
  TEAM_ORGANIZATION_CONTEXT_REFERENCES,
} from "@northbridge/operations-intelligence";
