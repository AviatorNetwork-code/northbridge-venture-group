import type {
  AssistantCardAction,
  AssistantCardMetadata,
  AssistantCardSeverity,
  AssistantCardType,
  AssistantCardValidationIssue,
  AssistantCardValidationResult,
  AssistantRichCard,
} from "./types.js";
import {
  ACTIONS_REQUIRED_CARD_TYPES,
  ASSISTANT_CARD_SEVERITIES,
  ASSISTANT_CARD_TYPES,
  ASSISTANT_RICH_CARD_SCHEMA_VERSION,
  SEVERITY_REQUIRED_CARD_TYPES,
} from "./types.js";
import { createAssistantCardValidationError } from "./errors.js";

export interface AssistantCardsBatchValidationResult {
  valid: boolean;
  results: readonly AssistantCardValidationResult[];
  validCards: readonly AssistantRichCard[];
  issues: readonly AssistantCardValidationIssue[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function issue(
  path: string,
  code: string,
  message: string,
): AssistantCardValidationIssue {
  return { path, code, message };
}

function validateAction(
  value: unknown,
  index: number,
): AssistantCardValidationIssue[] {
  const path = `actions[${index}]`;
  if (!isRecord(value)) {
    return [issue(path, "INVALID_ACTION", "Action must be an object.")];
  }

  const issues: AssistantCardValidationIssue[] = [];
  if (typeof value.action_id !== "string" || value.action_id.length === 0) {
    issues.push(
      issue(`${path}.action_id`, "REQUIRED", "action_id is required."),
    );
  }
  if (typeof value.label !== "string" || value.label.length === 0) {
    issues.push(issue(`${path}.label`, "REQUIRED", "label is required."));
  }
  if (
    value.draft_id !== undefined &&
    typeof value.draft_id !== "string"
  ) {
    issues.push(
      issue(`${path}.draft_id`, "INVALID_TYPE", "draft_id must be a string."),
    );
  }
  if (value.disabled !== undefined && typeof value.disabled !== "boolean") {
    issues.push(
      issue(`${path}.disabled`, "INVALID_TYPE", "disabled must be a boolean."),
    );
  }
  if (
    value.disabled_reason !== undefined &&
    typeof value.disabled_reason !== "string"
  ) {
    issues.push(
      issue(
        `${path}.disabled_reason`,
        "INVALID_TYPE",
        "disabled_reason must be a string.",
      ),
    );
  }

  const allowed = new Set([
    "action_id",
    "label",
    "draft_id",
    "disabled",
    "disabled_reason",
  ]);
  for (const key of Object.keys(value)) {
    if (!allowed.has(key)) {
      issues.push(
        issue(`${path}.${key}`, "UNKNOWN_FIELD", `Unknown action field: ${key}.`),
      );
    }
  }

  return issues;
}

function parseActions(value: unknown): {
  issues: AssistantCardValidationIssue[];
  actions?: readonly AssistantCardAction[];
} {
  if (value === undefined) {
    return { issues: [] };
  }
  if (!Array.isArray(value)) {
    return {
      issues: [issue("actions", "INVALID_TYPE", "actions must be an array.")],
    };
  }

  const issues: AssistantCardValidationIssue[] = [];
  const actions: AssistantCardAction[] = [];
  value.forEach((entry, index) => {
    const actionIssues = validateAction(entry, index);
    issues.push(...actionIssues);
    if (actionIssues.length === 0 && isRecord(entry)) {
      actions.push({
        action_id: entry.action_id as string,
        label: entry.label as string,
        draft_id:
          typeof entry.draft_id === "string" ? entry.draft_id : undefined,
        disabled:
          typeof entry.disabled === "boolean" ? entry.disabled : undefined,
        disabled_reason:
          typeof entry.disabled_reason === "string"
            ? entry.disabled_reason
            : undefined,
      });
    }
  });

  return { issues, actions };
}

function parseMetadata(value: unknown): {
  issues: AssistantCardValidationIssue[];
  metadata?: AssistantCardMetadata;
} {
  if (value === undefined) {
    return { issues: [] };
  }
  if (!isRecord(value)) {
    return {
      issues: [
        issue("metadata", "INVALID_TYPE", "metadata must be an object."),
      ],
    };
  }

  const issues: AssistantCardValidationIssue[] = [];
  const metadata: Record<string, string | number | boolean | null> = {};
  for (const [key, entry] of Object.entries(value)) {
    const t = typeof entry;
    if (
      entry !== null &&
      t !== "string" &&
      t !== "number" &&
      t !== "boolean"
    ) {
      issues.push(
        issue(
          `metadata.${key}`,
          "INVALID_TYPE",
          "metadata values must be string, number, boolean, or null.",
        ),
      );
      continue;
    }
    metadata[key] = entry as string | number | boolean | null;
  }

  return { issues, metadata };
}

export function validateAssistantRichCard(
  input: unknown,
): AssistantCardValidationResult {
  const issues: AssistantCardValidationIssue[] = [];

  if (!isRecord(input)) {
    return {
      valid: false,
      issues: [issue("$", "INVALID_CARD", "Card must be a non-null object.")],
    };
  }

  const allowedTopLevel = new Set([
    "schema_version",
    "id",
    "type",
    "title",
    "body",
    "severity",
    "actions",
    "metadata",
    "created_at",
  ]);
  for (const key of Object.keys(input)) {
    if (!allowedTopLevel.has(key)) {
      issues.push(
        issue(key, "UNKNOWN_FIELD", `Unknown top-level field: ${key}.`),
      );
    }
  }

  if (input.schema_version !== ASSISTANT_RICH_CARD_SCHEMA_VERSION) {
    issues.push(
      issue(
        "schema_version",
        "INVALID_VERSION",
        `schema_version must be "${ASSISTANT_RICH_CARD_SCHEMA_VERSION}".`,
      ),
    );
  }

  if (typeof input.id !== "string" || input.id.trim().length === 0) {
    issues.push(issue("id", "REQUIRED", "id is required."));
  }

  const type = input.type;
  if (typeof type !== "string") {
    issues.push(issue("type", "REQUIRED", "type is required."));
  } else if (!ASSISTANT_CARD_TYPES.includes(type as AssistantCardType)) {
    issues.push(
      issue("type", "UNKNOWN_TYPE", `Unknown card type: ${type}.`),
    );
  }

  if (typeof input.title !== "string" || input.title.trim().length === 0) {
    issues.push(issue("title", "REQUIRED", "title is required."));
  }

  if (typeof input.body !== "string" || input.body.trim().length === 0) {
    issues.push(issue("body", "REQUIRED", "body is required."));
  }

  let severity: AssistantCardSeverity | undefined;
  if (input.severity !== undefined) {
    if (
      typeof input.severity !== "string" ||
      !ASSISTANT_CARD_SEVERITIES.includes(input.severity as AssistantCardSeverity)
    ) {
      issues.push(
        issue("severity", "INVALID_SEVERITY", "severity is not recognized."),
      );
    } else {
      severity = input.severity as AssistantCardSeverity;
    }
  }

  if (
    typeof type === "string" &&
    SEVERITY_REQUIRED_CARD_TYPES.includes(type as AssistantCardType) &&
    severity === undefined
  ) {
    issues.push(
      issue(
        "severity",
        "REQUIRED",
        `${type} cards must include severity.`,
      ),
    );
  }

  const { issues: actionIssues, actions } = parseActions(input.actions);
  issues.push(...actionIssues);

  if (
    typeof type === "string" &&
    ACTIONS_REQUIRED_CARD_TYPES.includes(type as AssistantCardType) &&
    (!actions || actions.length === 0)
  ) {
    issues.push(
      issue(
        "actions",
        "REQUIRED",
        "confirmation_request cards must include at least one action.",
      ),
    );
  }

  const { issues: metadataIssues, metadata } = parseMetadata(input.metadata);
  issues.push(...metadataIssues);

  if (input.created_at !== undefined && typeof input.created_at !== "string") {
    issues.push(
      issue("created_at", "INVALID_TYPE", "created_at must be an ISO string."),
    );
  }

  if (issues.length > 0) {
    return { valid: false, issues };
  }

  const card: AssistantRichCard = {
    schema_version: ASSISTANT_RICH_CARD_SCHEMA_VERSION,
    id: (input.id as string).trim(),
    type: type as AssistantCardType,
    title: (input.title as string).trim(),
    body: (input.body as string).trim(),
    severity,
    actions,
    metadata,
    created_at:
      typeof input.created_at === "string" ? input.created_at : undefined,
  };

  return { valid: true, issues: [], card };
}

export function validateAssistantRichCards(
  cards: unknown,
): AssistantCardsBatchValidationResult {
  if (!Array.isArray(cards)) {
    const singleIssue = issue("$", "INVALID_BATCH", "Expected an array of cards.");
    return {
      valid: false,
      results: [{ valid: false, issues: [singleIssue] }],
      validCards: [],
      issues: [singleIssue],
    };
  }

  const results = cards.map((card) => validateAssistantRichCard(card));
  const validCards = results
    .filter((result) => result.valid && result.card !== undefined)
    .map((result) => result.card as AssistantRichCard);
  const issues = results.flatMap((result) => result.issues);

  return {
    valid: results.every((result) => result.valid),
    results,
    validCards,
    issues,
  };
}

export function assertAssistantRichCard(input: unknown): AssistantRichCard {
  const result = validateAssistantRichCard(input);
  if (!result.valid || !result.card) {
    throw createAssistantCardValidationError(
      "AssistantRichCard validation failed.",
      result.issues,
    );
  }
  return result.card;
}
