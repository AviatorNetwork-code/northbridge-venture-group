import { buildDashboardModel } from "@/lib/ndp/dashboard";
import {
  assertNoInternalFields,
  mapDashboardModelToResponse,
  SUPPORTED_DASHBOARD_VERSIONS,
  serializeDashboardResponse,
  validateDashboardResponse,
  validateResponseIntegrity,
} from "@/lib/ndp/mobile-bff/dashboard";
import { MobileDashboardError, toMobileDashboardErrorBody, toSanitizedInternalError } from "./errors.js";
import { emitMobileDashboardTelemetry } from "./observability.js";
import type {
  BuildMobileDashboardInput,
  MobileDashboardDependencies,
  MobileDashboardResult,
} from "./types.js";
import { MOBILE_DASHBOARD_OIL_POLICY } from "./types.js";

const LOCALE_PATTERN = /^[a-z]{2}(-[A-Z]{2})?$/;

function isValidTimezone(value: string): boolean {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: value });
    return true;
  } catch {
    return false;
  }
}

function validateMobileQuery(
  query: BuildMobileDashboardInput["query"],
  correlationId: string,
): void {
  if (!query.organizationId?.trim()) {
    throw new MobileDashboardError({
      code: "invalid_request",
      message: "organizationId is required.",
      status: 400,
      correlationId,
    });
  }

  if (query.locale !== undefined) {
    if (typeof query.locale !== "string" || !LOCALE_PATTERN.test(query.locale)) {
      throw new MobileDashboardError({
        code: "invalid_request",
        message: "locale must use a supported BCP-47 short form (e.g. en-US).",
        status: 400,
        correlationId,
      });
    }
  }

  if (query.timezone !== undefined) {
    if (typeof query.timezone !== "string" || !isValidTimezone(query.timezone)) {
      throw new MobileDashboardError({
        code: "invalid_request",
        message: "timezone must be a valid IANA timezone.",
        status: 400,
        correlationId,
      });
    }
  }

  if (query.dashboardVersion !== undefined) {
    if (
      !(SUPPORTED_DASHBOARD_VERSIONS as readonly string[]).includes(query.dashboardVersion)
    ) {
      throw new MobileDashboardError({
        code: "unsupported_dashboard_version",
        message: "Requested dashboard version is not supported.",
        status: 400,
        correlationId,
        supportedDashboardVersions: [...SUPPORTED_DASHBOARD_VERSIONS],
      });
    }
  }
}

function failureFromError(error: unknown, correlationId: string): MobileDashboardResult {
  if (error instanceof MobileDashboardError) {
    return {
      ok: false,
      status: error.status,
      body: toMobileDashboardErrorBody(error),
    };
  }

  const sanitized = toSanitizedInternalError(correlationId);
  return {
    ok: false,
    status: sanitized.status,
    body: toMobileDashboardErrorBody(sanitized),
  };
}

export async function buildMobileDashboardResponse(
  input: BuildMobileDashboardInput,
  dependencies: MobileDashboardDependencies,
): Promise<MobileDashboardResult> {
  const startedAt = Date.now();
  const correlationId = input.correlationId;
  const now = input.now ?? new Date().toISOString();

  await emitMobileDashboardTelemetry(dependencies.telemetry, {
    phase: "mobile_dashboard_requested",
    correlationId,
    organizationId: input.query.organizationId,
    status: "completed",
  });

  try {
    validateMobileQuery(input.query, correlationId);

    const customer = await dependencies.authentication.authenticate({
      authorizationHeader: input.authorizationHeader,
      correlationId,
    });

    if (!customer) {
      throw new MobileDashboardError({
        code: "unauthenticated",
        message: "Authentication required.",
        status: 401,
        correlationId,
      });
    }

    const membership = await dependencies.organizationAccess.resolve({
      customerId: customer.customerId,
      organizationId: input.query.organizationId,
    });

    if (membership.status === "unavailable") {
      throw new MobileDashboardError({
        code: "organization_unavailable",
        message: "Organization is unavailable.",
        status: 404,
        correlationId,
      });
    }

    if (membership.status === "denied") {
      throw new MobileDashboardError({
        code: "organization_access_denied",
        message: "You do not have access to this organization.",
        status: 403,
        correlationId,
      });
    }

    await emitMobileDashboardTelemetry(dependencies.telemetry, {
      phase: "mobile_dashboard_authorized",
      correlationId,
      organizationId: input.query.organizationId,
      customerId: customer.customerId,
      status: "completed",
    });

    const activeTeamIds = await dependencies.entitlements.load({
      customerId: customer.customerId,
      organizationId: input.query.organizationId,
    });

    const featureFlags = await dependencies.featureFlags.load({
      customerId: customer.customerId,
      organizationId: input.query.organizationId,
    });

    let operationsIntelligence = null;
    try {
      operationsIntelligence = await dependencies.operationsIntelligence.load({
        organizationId: input.query.organizationId,
        customerId: customer.customerId,
      });
    } catch {
      throw new MobileDashboardError({
        code: "dashboard_compose_failed",
        message: "Dashboard could not be composed from current organization data.",
        status: 409,
        correlationId,
      });
    }

    if (!operationsIntelligence && !MOBILE_DASHBOARD_OIL_POLICY.allowMissingOperationsIntelligence) {
      throw new MobileDashboardError({
        code: "dashboard_compose_failed",
        message: "Dashboard could not be composed from current organization data.",
        status: 409,
        correlationId,
      });
    }

    let teamReports: unknown[] = [];
    try {
      teamReports = await dependencies.teamReports.load({
        organizationId: input.query.organizationId,
        customerId: customer.customerId,
        activeTeamIds,
      });
    } catch {
      throw new MobileDashboardError({
        code: "dashboard_compose_failed",
        message: "Dashboard could not be composed from current organization data.",
        status: 409,
        correlationId,
      });
    }

    const dashboardModel = buildDashboardModel({
      organizationId: input.query.organizationId,
      activeTeamIds,
      teamReports,
      operationsIntelligence: operationsIntelligence ?? undefined,
      now,
    });

    const response = mapDashboardModelToResponse(dashboardModel, {
      request: {
        organizationId: input.query.organizationId,
        customerId: customer.customerId,
        activeTeamIds,
        locale: input.query.locale,
        timezone: input.query.timezone,
        appVersion: input.query.appVersion,
        dashboardVersionRequested: input.query.dashboardVersion,
        featureFlags,
        includePlaceholders: input.query.includePlaceholders ?? false,
        includeDebugMetadata: dependencies.includeDebugMetadata ?? false,
      },
    });

    const responseValidation = validateDashboardResponse(response);
    if (!responseValidation.valid) {
      throw new MobileDashboardError({
        code: "dashboard_compose_failed",
        message: "Dashboard could not be composed from current organization data.",
        status: 409,
        correlationId,
      });
    }

    const integrityValidation = validateResponseIntegrity(response);
    if (!integrityValidation.valid) {
      throw new MobileDashboardError({
        code: "dashboard_compose_failed",
        message: "Dashboard could not be composed from current organization data.",
        status: 409,
        correlationId,
      });
    }

    const violations = assertNoInternalFields(response);
    if (violations.length > 0) {
      throw new MobileDashboardError({
        code: "dashboard_compose_failed",
        message: "Dashboard could not be composed from current organization data.",
        status: 409,
        correlationId,
      });
    }

    const serialized = serializeDashboardResponse(response);

    await emitMobileDashboardTelemetry(dependencies.telemetry, {
      phase: "mobile_dashboard_built",
      correlationId,
      organizationId: input.query.organizationId,
      customerId: customer.customerId,
      status: "completed",
      durationMs: Date.now() - startedAt,
      metadata: {
        activeTeamCount: activeTeamIds.length,
        sectionCount: response.sections.length,
      },
    });

    return {
      ok: true,
      status: 200,
      body: response,
      serialized,
    };
  } catch (error) {
    const result = failureFromError(error, correlationId);

    await emitMobileDashboardTelemetry(dependencies.telemetry, {
      phase: "mobile_dashboard_failed",
      correlationId,
      organizationId: input.query.organizationId,
      status: result.ok ? "completed" : result.status === 401 ? "unauthorized" : "failed",
      durationMs: Date.now() - startedAt,
      metadata: {
        errorCode: result.body.error.code,
        httpStatus: result.status,
      },
    });

    return result;
  }
}
