/** Current AssistantRichCard schema version (v1.0). */
export const ASSISTANT_RICH_CARD_SCHEMA_VERSION = "1.0";
export const ASSISTANT_CARD_TYPES = [
    "explanation",
    "recommendation",
    "confirmation_request",
    "tool_result",
    "warning",
    "error",
    "next_steps",
];
export const ASSISTANT_CARD_SEVERITIES = [
    "info",
    "warning",
    "error",
    "critical",
];
/** Cards that require a severity field. */
export const SEVERITY_REQUIRED_CARD_TYPES = [
    "warning",
    "error",
];
/** Cards that require at least one action. */
export const ACTIONS_REQUIRED_CARD_TYPES = [
    "confirmation_request",
];
//# sourceMappingURL=types.js.map