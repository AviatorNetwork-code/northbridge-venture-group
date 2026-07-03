export {
  SEOIntelligenceEngine,
  createSEOIntelligenceEngine,
  SIE_GOVERNANCE,
} from "./core/seoIntelligenceEngine.js";
export { classifySearchIntent } from "./engines/searchIntentClassifier.js";
export { detectOpportunity, getSeedOpportunities } from "./engines/opportunityDetector.js";
export { auditExistingContent } from "./engines/contentAuditEngine.js";
export {
  mapKeywordToProduct,
  mapKeywordWithCapabilityVerification,
} from "./engines/productMappingEngine.js";
export type { ProductCapabilityVerifier } from "./engines/productMappingEngine.js";
export { scoreBusinessImpact } from "./engines/businessImpactScorer.js";
export { recommendContentFormat } from "./engines/contentRecommender.js";
export { generateContentDraft } from "./engines/draftGenerator.js";
export {
  buildContentRecommendation,
  generateExecutiveReport,
} from "./engines/executiveReportGenerator.js";
export {
  createPcbVerifierFromBroker,
  SIE_INTEGRATION_INPUTS,
  SIE_INTEGRATION_OUTPUTS,
} from "./integrations/neosIntegrations.js";
export {
  registerSIECapability,
  getSIECapabilityRegistration,
  SIE_CAPABILITY,
} from "./registration/capabilityRegistration.js";
export type {
  SearchIntentType,
  SearchIntentClassification,
  SearchOpportunity,
  ContentAuditResult,
  ProductMappingResult,
  SEOBusinessScore,
  ContentDraft,
  SEOContentRecommendation,
  SEOExecutiveReport,
  SEOAnalysisRequest,
} from "./types/index.js";
