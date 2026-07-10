export {
  DASHBOARD_BFF_API_VERSION,
  DASHBOARD_BFF_SCHEMA_VERSION,
  SUPPORTED_API_VERSIONS,
  SUPPORTED_DASHBOARD_VERSIONS,
  isSupportedApiVersion,
  isSupportedDashboardVersion,
  type SupportedApiVersion,
  type SupportedDashboardVersion,
} from "./version.js";

export {
  type DashboardRequest,
  DEFAULT_DASHBOARD_REQUEST_LOCALE,
} from "./request.js";

export {
  type DashboardCardStatusDto,
  type DashboardSectionIdDto,
  type DashboardCardDto,
  type DashboardSectionDto,
  type DashboardAlertDto,
  type DashboardRecommendationDto,
  type ReportFreshnessDto,
  type ConfidenceSummaryDto,
  type TeamSummaryDto,
  type SupportedActionType,
  type SupportedActionDto,
  type FutureExpansionPlaceholder,
  type DashboardMetadataDto,
  type DashboardResponse,
} from "./dto.js";

export { sanitizePublicPayload, sanitizePublicRecord } from "./sanitize.js";
export { mapDashboardModelToResponse, type MapDashboardModelOptions } from "./mapping.js";
export {
  validateDashboardRequest,
  validateDashboardResponse,
  validateResponseIntegrity,
  type DashboardValidationIssue,
  type DashboardValidationResult,
} from "./validation.js";
export {
  serializeDashboardResponse,
  parseSerializedDashboardResponse,
  assertNoInternalFields,
} from "./serialization.js";
