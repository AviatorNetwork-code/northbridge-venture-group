import type {
  DashboardResponse,
  MobileDashboardErrorBody,
  MobileDashboardErrorCode,
} from "@/types/dashboard";

export class DashboardApiError extends Error {
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
    this.name = "DashboardApiError";
    this.code = input.code;
    this.status = input.status;
    this.correlationId = input.correlationId;
    this.supportedDashboardVersions = input.supportedDashboardVersions;
  }
}

export function parseDashboardApiError(
  status: number,
  body: unknown,
  fallbackCorrelationId: string,
): DashboardApiError {
  const record = body as Partial<MobileDashboardErrorBody>;
  if (record?.error?.code && record.error.message) {
    return new DashboardApiError({
      code: record.error.code,
      message: record.error.message,
      status,
      correlationId: record.error.correlationId ?? fallbackCorrelationId,
      supportedDashboardVersions: record.error.supportedDashboardVersions,
    });
  }

  if (status === 401) {
    return new DashboardApiError({
      code: "unauthenticated",
      message: "Authentication required.",
      status,
      correlationId: fallbackCorrelationId,
    });
  }

  if (status === 403) {
    return new DashboardApiError({
      code: "organization_access_denied",
      message: "You do not have access to this organization.",
      status,
      correlationId: fallbackCorrelationId,
    });
  }

  return new DashboardApiError({
    code: "internal_error",
    message: "Unable to load dashboard at this time.",
    status,
    correlationId: fallbackCorrelationId,
  });
}

export function isDashboardResponse(value: unknown): value is DashboardResponse {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.schemaVersion === "string" &&
    typeof record.apiVersion === "string" &&
    !!record.metadata &&
    Array.isArray(record.sections)
  );
}

export const INTERNAL_FIELD_KEYS = [
  "specialistId",
  "teamLeadId",
  "reportId",
  "operationsContextRef",
  "orchestrationState",
  "routingState",
  "executionMetadata",
  "specialistUtilization",
] as const;

export function findInternalFieldViolations(value: unknown, path = "$"): string[] {
  const violations: string[] = [];

  if (Array.isArray(value)) {
    value.forEach((entry, index) => {
      violations.push(...findInternalFieldViolations(entry, `${path}[${index}]`));
    });
    return violations;
  }

  if (value && typeof value === "object") {
    for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
      if ((INTERNAL_FIELD_KEYS as readonly string[]).includes(key)) {
        violations.push(`${path}.${key}`);
      }
      violations.push(...findInternalFieldViolations(entry, `${path}.${key}`));
    }
  }

  return violations;
}

export function sanitizeLogMessage(message: string): string {
  return message.replace(/Bearer\s+\S+/gi, "Bearer [redacted]");
}
