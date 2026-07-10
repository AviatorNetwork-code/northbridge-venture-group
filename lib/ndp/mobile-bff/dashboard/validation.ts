import type { DashboardResponse } from "./dto.js";
import type { DashboardRequest } from "./request.js";
import {
  isSupportedApiVersion,
  isSupportedDashboardVersion,
  SUPPORTED_DASHBOARD_VERSIONS,
} from "./version.js";

export interface DashboardValidationIssue {
  code: string;
  path: string;
  message: string;
}

export interface DashboardValidationResult {
  valid: boolean;
  issues: DashboardValidationIssue[];
}

function issue(
  code: string,
  path: string,
  message: string,
): DashboardValidationIssue {
  return { code, path, message };
}

function success(): DashboardValidationResult {
  return { valid: true, issues: [] };
}

function failure(issues: DashboardValidationIssue[]): DashboardValidationResult {
  return { valid: false, issues };
}

const LOCALE_PATTERN = /^[a-z]{2}(-[A-Z]{2})?$/;

export function validateDashboardRequest(input: unknown): DashboardValidationResult {
  const issues: DashboardValidationIssue[] = [];

  if (!input || typeof input !== "object") {
    return failure([issue("invalid_request", "$", "DashboardRequest must be an object")]);
  }

  const request = input as Partial<DashboardRequest>;

  if (!request.organizationId || typeof request.organizationId !== "string") {
    issues.push(
      issue("required_field", "organizationId", "organizationId is required"),
    );
  }

  if (!request.customerId || typeof request.customerId !== "string") {
    issues.push(issue("required_field", "customerId", "customerId is required"));
  }

  if (!Array.isArray(request.activeTeamIds)) {
    issues.push(
      issue("required_field", "activeTeamIds", "activeTeamIds must be an array"),
    );
  } else if (request.activeTeamIds.some((teamId) => typeof teamId !== "string")) {
    issues.push(
      issue("invalid_field", "activeTeamIds", "activeTeamIds must contain strings"),
    );
  }

  if (request.locale !== undefined) {
    if (typeof request.locale !== "string" || !LOCALE_PATTERN.test(request.locale)) {
      issues.push(
        issue("invalid_field", "locale", "locale must match BCP-47 short form (e.g. en-US)"),
      );
    }
  }

  if (
    request.dashboardVersionRequested !== undefined &&
    !isSupportedDashboardVersion(request.dashboardVersionRequested)
  ) {
    issues.push(
      issue(
        "unsupported_version",
        "dashboardVersionRequested",
        `dashboardVersionRequested must be one of: ${SUPPORTED_DASHBOARD_VERSIONS.join(", ")}`,
      ),
    );
  }

  if (request.featureFlags !== undefined) {
    if (!request.featureFlags || typeof request.featureFlags !== "object") {
      issues.push(
        issue("invalid_field", "featureFlags", "featureFlags must be an object"),
      );
    }
  }

  return issues.length > 0 ? failure(issues) : success();
}

export function validateDashboardResponse(input: unknown): DashboardValidationResult {
  const issues: DashboardValidationIssue[] = [];

  if (!input || typeof input !== "object") {
    return failure([issue("invalid_response", "$", "DashboardResponse must be an object")]);
  }

  const response = input as Partial<DashboardResponse>;

  if (!response.schemaVersion || typeof response.schemaVersion !== "string") {
    issues.push(issue("required_field", "schemaVersion", "schemaVersion is required"));
  }

  if (!response.apiVersion || typeof response.apiVersion !== "string") {
    issues.push(issue("required_field", "apiVersion", "apiVersion is required"));
  } else if (!isSupportedApiVersion(response.apiVersion)) {
    issues.push(issue("unsupported_version", "apiVersion", "apiVersion is not supported"));
  }

  if (!response.metadata || typeof response.metadata !== "object") {
    issues.push(issue("required_field", "metadata", "metadata is required"));
  }

  if (!Array.isArray(response.sections)) {
    issues.push(issue("required_field", "sections", "sections must be an array"));
  }

  if (!Array.isArray(response.alerts)) {
    issues.push(issue("required_field", "alerts", "alerts must be an array"));
  }

  if (!Array.isArray(response.recommendations)) {
    issues.push(
      issue("required_field", "recommendations", "recommendations must be an array"),
    );
  }

  if (!Array.isArray(response.freshness)) {
    issues.push(issue("required_field", "freshness", "freshness must be an array"));
  }

  if (!response.confidence || typeof response.confidence !== "object") {
    issues.push(issue("required_field", "confidence", "confidence is required"));
  }

  if (!Array.isArray(response.supportedActions)) {
    issues.push(
      issue("required_field", "supportedActions", "supportedActions must be an array"),
    );
  }

  if (!Array.isArray(response.teamSummaries)) {
    issues.push(
      issue("required_field", "teamSummaries", "teamSummaries must be an array"),
    );
  }

  for (const key of [
    "offlineSync",
    "pagination",
    "widgetRefresh",
    "deltaUpdates",
    "liveSubscriptions",
  ] as const) {
    const placeholder = response[key];
    if (!placeholder || placeholder.enabled !== false || placeholder.reserved !== true) {
      issues.push(
        issue(
          "future_placeholder",
          key,
          `${key} must remain a reserved placeholder in this API version`,
        ),
      );
    }
  }

  return issues.length > 0 ? failure(issues) : success();
}

export function validateResponseIntegrity(response: DashboardResponse): DashboardValidationResult {
  const issues: DashboardValidationIssue[] = [];

  for (const alert of response.alerts) {
    if (!alert.sourceTeamId) {
      issues.push(
        issue("integrity", `alerts.${alert.id}`, "alert sourceTeamId is required"),
      );
    }
  }

  for (const recommendation of response.recommendations) {
    if (!recommendation.sourceTeamId) {
      issues.push(
        issue(
          "integrity",
          `recommendations.${recommendation.id}`,
          "recommendation sourceTeamId is required",
        ),
      );
    }
    if (!recommendation.recommendation) {
      issues.push(
        issue(
          "integrity",
          `recommendations.${recommendation.id}`,
          "recommendation text is required",
        ),
      );
    }
  }

  for (const section of response.sections) {
    for (const card of section.cards) {
      if (card.sectionId !== section.id) {
        issues.push(
          issue(
            "integrity",
            `sections.${section.id}.cards.${card.id}`,
            "card sectionId must match parent section",
          ),
        );
      }
    }
  }

  const freshnessTeamIds = new Set(response.freshness.map((entry) => entry.teamId));
  for (const teamId of response.metadata.availableTeams) {
    if (!freshnessTeamIds.has(teamId)) {
      issues.push(
        issue(
          "integrity",
          "freshness",
          `freshness entry missing for available team ${teamId}`,
        ),
      );
    }
  }

  return issues.length > 0 ? failure(issues) : success();
}

export { isSupportedDashboardVersion, isSupportedApiVersion };
