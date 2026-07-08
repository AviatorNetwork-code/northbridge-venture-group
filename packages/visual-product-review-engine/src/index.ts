export {
  VisualProductReviewEngine,
  createVisualProductReviewEngine,
  VPRE_GOVERNANCE,
} from "./core/visualProductReviewEngine.js";
export {
  ReviewSourceRegistry,
  createDefaultReviewRegistry,
  FUTURE_CAPTURE_INTEGRATIONS,
} from "./registry/reviewSourceRegistry.js";
export {
  evaluateAllDimensions,
  aggregateScreenScores,
} from "./engines/dimensionEvaluators.js";
export {
  detectScreenIssues,
  prioritizeIssuesByBusinessImpact,
} from "./engines/issueDetector.js";
export { generateExecutiveUXReport } from "./engines/executiveReportGenerator.js";
export {
  DEFAULT_REVIEW_ADAPTERS,
  northbridgeWebsiteReviewAdapter,
  aviatorNetworkReviewAdapter,
  quadrixReviewAdapter,
} from "./adapters/defaultProductReviewAdapters.js";
export {
  registerVPRECapability,
  getVPRECapabilityRegistration,
  VPRE_CAPABILITY,
} from "./registration/capabilityRegistration.js";
export type {
  ReviewDimension,
  ScreenCapture,
  RenderedUISignals,
  ScreenScores,
  ReviewIssue,
  ScreenReview,
  ExecutiveUXReport,
  VisualReviewRequest,
  VisualReviewAdapter,
} from "./types/index.js";
