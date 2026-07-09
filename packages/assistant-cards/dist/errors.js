export function createAssistantCardValidationError(message, issues) {
    const error = new Error(message);
    error.name = "AssistantCardValidationError";
    error.issues = issues;
    return error;
}
/** Safe error card returned when validation fails — never expose raw invalid payloads. */
export function createSafeInvalidCardFallback(issues, fallbackId = "card_validation_error") {
    const summary = issues.length === 0
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
//# sourceMappingURL=errors.js.map