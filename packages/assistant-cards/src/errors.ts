import type { AssistantCardValidationIssue } from "./types.js";

/** Structured validation failure for invalid rich cards. */
export interface AssistantCardValidationError extends Error {
  name: "AssistantCardValidationError";
  issues: readonly AssistantCardValidationIssue[];
}

export function createAssistantCardValidationError(
  message: string,
  issues: readonly AssistantCardValidationIssue[],
): AssistantCardValidationError {
  const error = new Error(message) as AssistantCardValidationError;
  error.name = "AssistantCardValidationError";
  error.issues = issues;
  return error;
}

/** Safe error card returned when validation fails — never expose raw invalid payloads. */
export function createSafeInvalidCardFallback(
  issues: readonly AssistantCardValidationIssue[],
  fallbackId = "card_validation_error",
): import("./types.js").AssistantRichCard {
  const summary =
    issues.length === 0
      ? "The assistant response could not be validated."
      : issues.map((issue) => issue.message).join(" ");

  return {
    schema_version: "1.0",
    id: fallbackId,
    type: "error",
    title: "Unable to display response",
    body: "The assistant produced a response that failed platform validation. No unverified content is shown.",
    severity: "error",
    metadata: {
      validation_issue_count: issues.length,
      validation_summary: summary.slice(0, 500),
    },
  };
}
