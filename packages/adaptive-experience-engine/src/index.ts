export { AdaptiveExperienceEngine } from "./core/adaptiveExperienceEngine.js";

export type {
  AdaptiveExperienceAdapter,
  ProductExperienceContext,
  ExperienceDomain,
} from "./types/adapter.js";

export type {
  AEEInputBundle,
  AnalyzedExperienceContext,
  VisitorIntentSignal,
  CustomerExperienceSignal,
  BusinessImpactSignal,
  ExecutivePrioritySignal,
  JourneyIntelligenceSignal,
  TelemetryEvent,
  ConversationAnalytics,
  SessionAnalytics,
  ExperimentOutcome,
} from "./types/inputs.js";

export type {
  AdaptiveExperiencePlan,
  ExperienceRecommendation,
  RecommendationArea,
  ImpactSummary,
  RiskAssessment,
  EvidenceItem,
} from "./types/recommendations.js";

export type {
  AEEOutputEnvelope,
  AEEOutputTarget,
  PersonalizationScore,
} from "./types/integration.js";

export {
  registerAEECapability,
  getAEECapabilityRegistration,
  AEE_CAPABILITY,
} from "./registration/capabilityRegistration.js";

export type {
  NEOCapabilityRegistry,
  NEOCapabilityDescriptor,
} from "./registration/capabilityRegistration.js";

export {
  AEE_GOVERNANCE,
  assertReadOnlyOperation,
  wrapRecommendationOutput,
  validateExperiencePlan,
} from "./governance/readOnlyPolicy.js";

export { analyzeExperienceContext } from "./engines/experienceAnalyzer.js";
export { generateRecommendations } from "./engines/recommendationEngine.js";
export { scorePersonalization, computeEvidenceQuality } from "./engines/personalizationScoringModel.js";
export { evaluateRisk } from "./engines/riskEvaluator.js";
export {
  estimateBusinessImpact,
  estimateCustomerImpact,
} from "./engines/customerImpactEstimator.js";
export { buildAdaptiveExperiencePlan, resolveDependencies } from "./engines/planGenerator.js";
