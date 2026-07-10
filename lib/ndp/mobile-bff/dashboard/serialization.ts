import type { DashboardResponse } from "./dto.js";

function sortValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((entry) => sortValue(entry));
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    const sorted: Record<string, unknown> = {};
    for (const key of Object.keys(record).sort()) {
      sorted[key] = sortValue(record[key]);
    }
    return sorted;
  }

  return value;
}

export function serializeDashboardResponse(response: DashboardResponse): string {
  return JSON.stringify(sortValue(response));
}

export function parseSerializedDashboardResponse(serialized: string): DashboardResponse {
  return JSON.parse(serialized) as DashboardResponse;
}

export function assertNoInternalFields(value: unknown, path = "$"): string[] {
  const violations: string[] = [];
  const internalKeys = [
    "specialistId",
    "teamLeadId",
    "reportId",
    "organizationContextRef",
    "operationsContextRef",
    "orchestrationState",
    "routingState",
    "executionMetadata",
    "specialistUtilization",
  ];

  if (Array.isArray(value)) {
    value.forEach((entry, index) => {
      violations.push(...assertNoInternalFields(entry, `${path}[${index}]`));
    });
    return violations;
  }

  if (value && typeof value === "object") {
    for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
      if (internalKeys.includes(key) && path !== "$.debug") {
        violations.push(`${path}.${key}`);
      }
      violations.push(...assertNoInternalFields(entry, `${path}.${key}`));
    }
  }

  return violations;
}
