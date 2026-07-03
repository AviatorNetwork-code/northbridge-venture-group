export { VisitorIntentIntelligence, mergeIntentCatalog, DEFAULT_INTENT_CATALOG } from "./core/visitorIntentIntelligence.js";

export type {
  VisitorIntentAdapter,
  VIIEvent,
  AdapterContext,
  AdapterSignals,
  IntentEvidence,
} from "./types/adapter.js";

export type {
  IntentDefinition,
  IntentInference,
  CoreIntentCategory,
} from "./types/intent.js";

export { CORE_INTENT_CATEGORIES } from "./types/intent.js";

export type {
  SessionIntelligence,
  ExecutiveReport,
  ImprovementRecommendation,
} from "./types/reporting.js";

export type {
  ConfidenceAssessment,
  ConfidenceSignal,
  ConfidenceSignalType,
} from "./types/confidence.js";

export type {
  JourneyUnderstanding,
  JourneyEvent,
  FrictionEvent,
} from "./types/journey.js";

export type {
  OutcomeAssessment,
  OutcomeClassification,
} from "./types/outcome.js";

export type {
  ConversationEvaluation,
  CatInteractionRecord,
} from "./types/conversation.js";

export type {
  BusinessCorrelation,
  BusinessSignal,
  BusinessCorrelationSummary,
} from "./types/business.js";

export type {
  VIIIntegrationInputs,
  VIIOutputEnvelope,
  VIIOutputTarget,
} from "./types/integration.js";

export {
  registerVIICapability,
  getVIICapabilityRegistration,
  VII_CAPABILITY,
} from "./registration/capabilityRegistration.js";

export type {
  NEOCapabilityRegistry,
  NEOCapabilityDescriptor,
} from "./registration/capabilityRegistration.js";

export {
  VII_GOVERNANCE,
  assertReadOnlyOperation,
  wrapRecommendationOutput,
  validateRecommendations,
} from "./governance/readOnlyPolicy.js";

export { inferIntent, buildEvidenceFromKeywords } from "./engines/intentInferenceEngine.js";
export { assessConfidence } from "./engines/confidenceEngine.js";
export { buildJourneyUnderstanding } from "./engines/journeyUnderstandingEngine.js";
export { evaluateConversation, extractCatInteractions } from "./engines/conversationEvaluator.js";
export { correlateBusinessSignals, summarizeBusinessCorrelations } from "./engines/businessCorrelationEngine.js";
export { classifyOutcome } from "./engines/outcomeClassifier.js";
export { generateExecutiveReport, buildImprovementRecommendations } from "./engines/executiveReportingEngine.js";
