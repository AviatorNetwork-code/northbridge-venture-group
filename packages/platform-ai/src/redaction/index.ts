export type { RedactionPattern, RedactionResult } from "./types.js";

export {
  DEFAULT_SENSITIVE_VALUE_PATTERNS,
  isForbiddenKey,
  redactSensitiveValue,
  sanitizeForLogs,
  sanitizeForModel,
  sanitizePromptText,
} from "./sanitize.js";
