import type { RedactionPattern, RedactionResult } from "./types.js";

const SENSITIVE_KEY_PATTERNS: RegExp[] = [
  /^password$/i,
  /^passwd$/i,
  /^token$/i,
  /^access_token$/i,
  /^refresh_token$/i,
  /^api_key$/i,
  /^secret$/i,
  /^private_key$/i,
  /^ssn$/i,
  /^social_security/i,
  /^credit_card/i,
  /^card_number$/i,
  /^cvv$/i,
  /^routing_number$/i,
  /^account_number$/i,
  /^iban$/i,
  /^swift$/i,
  /^passport/i,
  /^driver.?license/i,
  /^license_number$/i,
  /^government_id$/i,
  /^home_address$/i,
  /^street_address$/i,
  /^address_line/i,
];

export const DEFAULT_SENSITIVE_VALUE_PATTERNS: RedactionPattern[] = [
  {
    pattern: /\b(?:sk|pk)_(?:live|test)_[a-zA-Z0-9]{10,}\b/,
    label: "payment API key",
    reject: true,
  },
  {
    pattern: /\beyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\b/,
    label: "JWT token",
    reject: true,
  },
  {
    pattern: /\b(?:password|passwd)\s*[:=]\s*\S+/i,
    label: "password assignment",
    reject: true,
  },
  { pattern: /\b\d{3}-\d{2}-\d{4}\b/, label: "SSN", reject: true },
  {
    pattern: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/,
    label: "credit card number",
    reject: true,
  },
  {
    pattern:
      /\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})\b/,
    label: "credit card number",
    reject: true,
  },
  {
    pattern: /-----BEGIN (?:RSA |EC )?PRIVATE KEY-----/,
    label: "private key",
    reject: true,
  },
  {
    pattern:
      /\b\d+\s+[A-Za-z0-9\s,.]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln|Court|Ct|Way|Place|Pl)\.?(?:\s+(?:Apt|Unit|Suite|#)\s*\S+)?\b/i,
    label: "precise street address",
    reject: true,
  },
  { pattern: /\b[A-Z]{1,2}\d{6,9}\b/, label: "government ID number", reject: true },
];

function isSensitiveKey(key: string): boolean {
  return SENSITIVE_KEY_PATTERNS.some((pattern) => pattern.test(key));
}

function scanSensitiveValue(
  text: string,
  patterns: RedactionPattern[],
): { reject: boolean; labels: string[] } {
  const labels: string[] = [];
  let reject = false;
  for (const { pattern, label, reject: shouldReject } of patterns) {
    if (pattern.test(text)) {
      labels.push(label);
      if (shouldReject) reject = true;
    }
  }
  return { reject, labels };
}

function redactString(
  value: string,
  patterns: RedactionPattern[],
): RedactionResult {
  const scan = scanSensitiveValue(value, patterns);
  if (scan.reject) {
    return {
      redacted: "[REDACTED]",
      warnings: scan.labels.map(
        (l) => `Sensitive content detected (${l}) — value rejected.`,
      ),
      rejected: true,
      rejectionReason: `Contains sensitive data: ${scan.labels.join(", ")}`,
    };
  }
  if (scan.labels.length > 0) {
    return {
      redacted: value.replace(/\S{4,}/g, (match) => {
        const inner = scanSensitiveValue(match, patterns);
        return inner.labels.length > 0 ? "[REDACTED]" : match;
      }),
      warnings: scan.labels.map(
        (l) => `Potentially sensitive content redacted (${l}).`,
      ),
      rejected: false,
    };
  }
  return { redacted: value, warnings: [], rejected: false };
}

/** Recursively redact a value before AI memory or log persistence. */
export function redactSensitiveValue(
  value: unknown,
  patterns: RedactionPattern[] = DEFAULT_SENSITIVE_VALUE_PATTERNS,
): RedactionResult {
  if (value === null || value === undefined) {
    return {
      redacted: "",
      warnings: ["Empty value."],
      rejected: false,
    };
  }

  if (typeof value === "string") {
    return redactString(value.trim(), patterns);
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return { redacted: String(value), warnings: [], rejected: false };
  }

  if (Array.isArray(value)) {
    const warnings: string[] = [];
    const items: unknown[] = [];
    for (const item of value) {
      const result = redactSensitiveValue(item, patterns);
      if (result.rejected) {
        return result;
      }
      warnings.push(...result.warnings);
      items.push(result.redacted);
    }
    return { redacted: { items }, warnings, rejected: false };
  }

  if (typeof value === "object") {
    const warnings: string[] = [];
    const out: Record<string, unknown> = {};
    for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
      if (isSensitiveKey(key)) {
        return {
          redacted: "[REDACTED]",
          warnings: [`Sensitive key "${key}" — value rejected.`],
          rejected: true,
          rejectionReason: `Sensitive key: ${key}`,
        };
      }
      const result = redactSensitiveValue(nested, patterns);
      if (result.rejected) {
        return result;
      }
      warnings.push(...result.warnings);
      out[key] = result.redacted;
    }
    return { redacted: out, warnings, rejected: false };
  }

  return {
    redacted: "[REDACTED]",
    warnings: ["Unsupported value type — redacted."],
    rejected: false,
  };
}

export function isForbiddenKey(key: string): boolean {
  return isSensitiveKey(key);
}

/** Strip control characters and normalize whitespace for prompt safety. */
export function sanitizePromptText(text: string): string {
  return text
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Sanitize text or context objects before sending to a model.
 * Removes forbidden keys and normalizes string values.
 */
export function sanitizeForModel(
  input: string | Record<string, unknown>,
): string | Record<string, unknown> {
  if (typeof input === "string") {
    return sanitizePromptText(input);
  }

  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(input)) {
    if (isForbiddenKey(key)) {
      continue;
    }
    if (typeof value === "string") {
      out[key] = sanitizePromptText(value);
    } else if (Array.isArray(value)) {
      out[key] = value.map((item) =>
        typeof item === "string" ? sanitizePromptText(item) : item,
      );
    } else {
      out[key] = value;
    }
  }
  return out;
}

/**
 * Sanitize values before writing to logs or telemetry.
 * Rejects or redacts sensitive keys, tokens, and PII patterns.
 */
export function sanitizeForLogs(input: unknown): string {
  const result = redactSensitiveValue(input);
  if (result.rejected) {
    return `[REDACTED: ${result.rejectionReason ?? "sensitive data"}]`;
  }
  if (typeof result.redacted === "string") {
    return result.redacted;
  }
  return JSON.stringify(result.redacted);
}
