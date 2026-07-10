import * as Localization from "expo-localization";
import { getAppEnvironment } from "@/config/env";
import {
  DashboardApiError,
  findInternalFieldViolations,
  isDashboardResponse,
  parseDashboardApiError,
} from "@/api/errors";
import type { DashboardResponse } from "@/types/dashboard";
import { DASHBOARD_BFF_API_VERSION, DASHBOARD_BFF_SCHEMA_VERSION } from "@/types/dashboard";

export interface DashboardRequestOptions {
  organizationId: string;
  accessToken: string;
  locale?: string;
  timezone?: string;
  appVersion?: string;
  dashboardVersion?: string;
  includePlaceholders?: boolean;
  correlationId?: string;
}

export interface DashboardApiClient {
  fetchDashboard(options: DashboardRequestOptions): Promise<DashboardResponse>;
}

function buildDashboardUrl(options: DashboardRequestOptions, env = getAppEnvironment()): string {
  const params = new URLSearchParams();
  params.set("organizationId", options.organizationId);
  params.set("locale", options.locale ?? Localization.getLocales()[0]?.languageTag ?? "en-US");
  params.set(
    "timezone",
    options.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone ?? "UTC",
  );
  params.set("appVersion", options.appVersion ?? env.appVersion);
  params.set("dashboardVersion", options.dashboardVersion ?? env.dashboardVersion);

  if (options.includePlaceholders) {
    params.set("includePlaceholders", "true");
  }

  return `${env.apiBaseUrl.replace(/\/$/, "")}/api/mobile/v1/dashboard?${params.toString()}`;
}

export class MobileDashboardApiClient implements DashboardApiClient {
  constructor(private readonly fetchImpl: typeof fetch = fetch) {}

  async fetchDashboard(options: DashboardRequestOptions): Promise<DashboardResponse> {
    const correlationId = options.correlationId ?? createCorrelationId();
    const url = buildDashboardUrl(options);

    let response: Response;
    try {
      response = await this.fetchImpl(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${options.accessToken}`,
          Accept: "application/json",
          "x-correlation-id": correlationId,
        },
      });
    } catch {
      throw new DashboardApiError({
        code: "network_unavailable",
        message: "Network unavailable. Check your connection and try again.",
        status: 0,
        correlationId,
      });
    }

    const body = await response.json().catch(() => null);

    if (!response.ok) {
      throw parseDashboardApiError(response.status, body, correlationId);
    }

    if (!isDashboardResponse(body)) {
      throw new DashboardApiError({
        code: "internal_error",
        message: "Received an unexpected dashboard response.",
        status: response.status,
        correlationId,
      });
    }

    if (
      body.schemaVersion !== DASHBOARD_BFF_SCHEMA_VERSION ||
      body.apiVersion !== DASHBOARD_BFF_API_VERSION
    ) {
      throw new DashboardApiError({
        code: "unsupported_dashboard_version",
        message: "This app version does not support the dashboard returned by the server.",
        status: 400,
        correlationId,
        supportedDashboardVersions: [DASHBOARD_BFF_SCHEMA_VERSION],
      });
    }

    const violations = findInternalFieldViolations(body);
    if (violations.length > 0) {
      throw new DashboardApiError({
        code: "internal_error",
        message: "Received an unexpected dashboard response.",
        status: 500,
        correlationId,
      });
    }

    return body;
  }
}

export function createCorrelationId(): string {
  return `nordi-mobile-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export { buildDashboardUrl };
