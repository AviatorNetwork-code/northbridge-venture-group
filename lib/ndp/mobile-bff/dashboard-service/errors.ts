import type { MobileDashboardErrorBody } from "./types.js";

export type MobileDashboardErrorCode =
  | "unauthenticated"
  | "invalid_request"
  | "unsupported_dashboard_version"
  | "organization_access_denied"
  | "organization_unavailable"
  | "dashboard_compose_failed"
  | "internal_error";

export class MobileDashboardError extends Error {
  readonly code: MobileDashboardErrorCode;
  readonly status: number;
  readonly correlationId: string;
  readonly supportedDashboardVersions?: string[];

  constructor(input: {
    code: MobileDashboardErrorCode;
    message: string;
    status: number;
    correlationId: string;
    supportedDashboardVersions?: string[];
  }) {
    super(input.message);
    this.name = "MobileDashboardError";
    this.code = input.code;
    this.status = input.status;
    this.correlationId = input.correlationId;
    this.supportedDashboardVersions = input.supportedDashboardVersions;
  }
}

export function toMobileDashboardErrorBody(error: MobileDashboardError): MobileDashboardErrorBody {
  return {
    error: {
      code: error.code,
      message: error.message,
      correlationId: error.correlationId,
      ...(error.supportedDashboardVersions
        ? { supportedDashboardVersions: error.supportedDashboardVersions }
        : {}),
    },
  };
}

export function toSanitizedInternalError(correlationId: string): MobileDashboardError {
  return new MobileDashboardError({
    code: "internal_error",
    message: "Unable to load dashboard at this time.",
    status: 500,
    correlationId,
  });
}
