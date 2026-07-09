import type { NeoBridgeConfig } from "./types.js";

const PRODUCT_CODE_PATTERN = /^[A-Z0-9]{2,8}$/;

export interface ValidationIssue {
  field: string;
  message: string;
}

export function validateConfig(config: unknown): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (!config || typeof config !== "object") {
    return [{ field: "config", message: "Config must be a JSON object" }];
  }

  const record = config as Record<string, unknown>;
  const required = [
    "productCode",
    "productName",
    "repositoryName",
    "sessionReportPath",
    "neoPath",
    "supportsLearning",
    "supportsStatus",
    "supportsWarRoom",
  ] as const;

  for (const field of required) {
    if (record[field] === undefined || record[field] === null) {
      issues.push({ field, message: `Missing required field '${field}'` });
    }
  }

  const allowed = new Set(required);
  for (const key of Object.keys(record)) {
    if (!allowed.has(key as (typeof required)[number])) {
      issues.push({ field: key, message: `Unknown field '${key}'` });
    }
  }

  if (typeof record.productCode === "string") {
    if (!PRODUCT_CODE_PATTERN.test(record.productCode)) {
      issues.push({
        field: "productCode",
        message: "Must be 2–8 uppercase letters or digits (e.g. AVN)",
      });
    }
  } else if (record.productCode !== undefined) {
    issues.push({ field: "productCode", message: "Must be a string" });
  }

  for (const field of ["productName", "repositoryName", "sessionReportPath", "neoPath"] as const) {
    const value = record[field];
    if (value !== undefined && (typeof value !== "string" || value.trim() === "")) {
      issues.push({ field, message: "Must be a non-empty string" });
    }
  }

  for (const field of ["supportsLearning", "supportsStatus", "supportsWarRoom"] as const) {
    if (record[field] !== undefined && typeof record[field] !== "boolean") {
      issues.push({ field, message: "Must be a boolean" });
    }
  }

  return issues;
}

export function assertValidConfig(config: unknown): NeoBridgeConfig {
  const issues = validateConfig(config);
  if (issues.length > 0) {
    const detail = issues.map((i) => `${i.field}: ${i.message}`).join("; ");
    throw new Error(`Invalid neo-bridge config — ${detail}`);
  }
  return config as NeoBridgeConfig;
}
