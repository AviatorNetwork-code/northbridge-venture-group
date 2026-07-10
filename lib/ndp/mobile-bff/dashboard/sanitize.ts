const INTERNAL_FIELD_KEYS = new Set([
  "specialistId",
  "specialistIds",
  "teamLeadId",
  "reportId",
  "reportVersion",
  "organizationContextRef",
  "operationsContextRef",
  "operationsContextVersion",
  "orchestrationState",
  "routingState",
  "executionMetadata",
  "correlationId",
  "requestId",
  "runtimeId",
  "internalId",
  "specialistLevels",
  "specialistUtilization",
  "routingInternals",
  "orchestrationMetadata",
]);

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function sanitizePublicPayload(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((entry) => sanitizePublicPayload(entry));
  }

  if (!isPlainObject(value)) {
    return value;
  }

  const sanitized: Record<string, unknown> = {};
  for (const [key, entry] of Object.entries(value)) {
    if (INTERNAL_FIELD_KEYS.has(key)) {
      continue;
    }
    sanitized[key] = sanitizePublicPayload(entry);
  }
  return sanitized;
}

export function sanitizePublicRecord(
  value: Record<string, unknown>,
): Record<string, unknown> {
  const sanitized = sanitizePublicPayload(value);
  return isPlainObject(sanitized) ? sanitized : {};
}
