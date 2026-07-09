import { isForbiddenKey } from "@northbridge/platform-ai";

export const DEFAULT_MAX_CONTEXT_BYTES = 48_000;

const ADDITIONAL_FORBIDDEN_CONTEXT_KEY_PATTERNS = [
  /^email$/i,
  /^phone$/i,
  /^medical/i,
  /^certificate_number$/i,
] as const;

const STRIPPED_COLLECTION_KEYS = new Set([
  "entries",
  "logbook_entries",
  "rows",
  "raw_rows",
  "messages",
]);

export function isForbiddenContextKey(key: string): boolean {
  return (
    isForbiddenKey(key) ||
    ADDITIONAL_FORBIDDEN_CONTEXT_KEY_PATTERNS.some((pattern) => pattern.test(key))
  );
}

function redactValue(value: unknown, depth: number): unknown {
  if (depth > 8) return "[truncated]";
  if (value == null || typeof value !== "object") return value;

  if (Array.isArray(value)) {
    if (value.length > 12) {
      return {
        _redacted: "array_truncated",
        length: value.length,
        preview: value.slice(0, 3).map((item) => redactValue(item, depth + 1)),
      };
    }
    return value.map((item) => redactValue(item, depth + 1));
  }

  const out: Record<string, unknown> = {};
  for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
    if (isForbiddenContextKey(key)) {
      out[key] = "[redacted]";
      continue;
    }
    if (STRIPPED_COLLECTION_KEYS.has(key)) {
      out[key] = { _redacted: "raw_collection_omitted" };
      continue;
    }
    out[key] = redactValue(nested, depth + 1);
  }
  return out;
}

/** Deep-redacts secrets and omits raw row collections before AI translation. */
export function redactAiPayload(value: unknown): Record<string, unknown> {
  const redacted = redactValue(value, 0);
  if (!redacted || typeof redacted !== "object" || Array.isArray(redacted)) {
    return {};
  }
  return redacted as Record<string, unknown>;
}

export function serializeRedactedPayload(
  value: unknown,
  maxContextBytes = DEFAULT_MAX_CONTEXT_BYTES,
): string {
  const payload = redactAiPayload(value);
  let serialized = JSON.stringify(payload);
  if (serialized.length <= maxContextBytes) {
    return serialized;
  }

  return JSON.stringify({
    _truncated: true,
    preview: serialized.slice(0, maxContextBytes - 128),
  });
}

export function payloadExceedsMaxBytes(
  value: unknown,
  maxContextBytes = DEFAULT_MAX_CONTEXT_BYTES,
): boolean {
  return serializeRedactedPayload(value, maxContextBytes).length > maxContextBytes;
}
