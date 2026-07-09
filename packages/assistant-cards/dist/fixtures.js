export const explanationCardFixture = {
    schema_version: "1.0",
    id: "card_explanation_001",
    type: "explanation",
    title: "Why this recommendation",
    body: "This recommendation is based on approved platform knowledge and your current workspace snapshot.",
    metadata: { confidence: "medium" },
    created_at: "2026-06-30T12:00:00.000Z",
};
export const recommendationCardFixture = {
    schema_version: "1.0",
    id: "card_recommendation_001",
    type: "recommendation",
    title: "Suggested next step",
    body: "Review the pending items in your workspace before proceeding.",
};
export const confirmationRequestCardFixture = {
    schema_version: "1.0",
    id: "card_confirm_001",
    type: "confirmation_request",
    title: "Confirm operational change",
    body: "This action requires your explicit approval before execution.",
    actions: [
        {
            action_id: "confirm",
            label: "Confirm",
            draft_id: "OPD-example-001",
        },
        { action_id: "cancel", label: "Cancel" },
    ],
};
export const toolResultCardFixture = {
    schema_version: "1.0",
    id: "card_tool_result_001",
    type: "tool_result",
    title: "Lookup result",
    body: "Entity Example is active in the current workspace.",
};
export const warningCardFixture = {
    schema_version: "1.0",
    id: "card_warning_001",
    type: "warning",
    title: "Incomplete context",
    body: "Some workspace fields could not be loaded.",
    severity: "warning",
};
export const errorCardFixture = {
    schema_version: "1.0",
    id: "card_error_001",
    type: "error",
    title: "Action blocked",
    body: "The requested operation was blocked by platform safety rules.",
    severity: "error",
};
export const nextStepsCardFixture = {
    schema_version: "1.0",
    id: "card_next_steps_001",
    type: "next_steps",
    title: "What you can do next",
    body: "1. Review details\n2. Confirm if ready\n3. Contact support if blocked",
};
export const missingTitleCardFixture = {
    schema_version: "1.0",
    id: "card_invalid_title",
    type: "explanation",
    body: "Missing title field.",
};
export const unknownTypeCardFixture = {
    schema_version: "1.0",
    id: "card_invalid_type",
    type: "unknown_type",
    title: "Invalid",
    body: "Unknown card type.",
};
export const confirmationWithoutActionsFixture = {
    schema_version: "1.0",
    id: "card_invalid_confirm",
    type: "confirmation_request",
    title: "Confirm",
    body: "No actions provided.",
};
export const warningWithoutSeverityFixture = {
    schema_version: "1.0",
    id: "card_invalid_warning",
    type: "warning",
    title: "Warning",
    body: "Missing severity.",
};
export const errorWithoutSeverityFixture = {
    schema_version: "1.0",
    id: "card_invalid_error",
    type: "error",
    title: "Error",
    body: "Missing severity.",
};
//# sourceMappingURL=fixtures.js.map