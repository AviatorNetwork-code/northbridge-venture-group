import {
  ASSISTANT_RICH_CARD_SCHEMA_VERSION,
  ASSISTANT_CARD_SEVERITIES,
  ASSISTANT_CARD_TYPES,
} from "./types.js";

/**
 * JSON Schema (draft-07 compatible object) for AssistantRichCard v1.0.
 * Used for documentation and cross-language validation; runtime uses validate.ts.
 */
export const assistantRichCardJsonSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  $id: "https://northbridge.dev/schemas/assistant-rich-card/v1.0",
  title: "AssistantRichCard",
  type: "object",
  additionalProperties: false,
  required: ["schema_version", "id", "type", "title", "body"],
  properties: {
    schema_version: {
      type: "string",
      const: ASSISTANT_RICH_CARD_SCHEMA_VERSION,
    },
    id: { type: "string", minLength: 1 },
    type: { type: "string", enum: [...ASSISTANT_CARD_TYPES] },
    title: { type: "string", minLength: 1 },
    body: { type: "string", minLength: 1 },
    severity: { type: "string", enum: [...ASSISTANT_CARD_SEVERITIES] },
    actions: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["action_id", "label"],
        properties: {
          action_id: { type: "string", minLength: 1 },
          label: { type: "string", minLength: 1 },
          draft_id: { type: "string" },
          disabled: { type: "boolean" },
          disabled_reason: { type: "string" },
        },
      },
    },
    metadata: {
      type: "object",
      additionalProperties: {
        type: ["string", "number", "boolean", "null"],
      },
    },
    created_at: { type: "string", format: "date-time" },
  },
  allOf: [
    {
      if: { properties: { type: { const: "confirmation_request" } } },
      then: { required: ["actions"] },
    },
    {
      if: {
        properties: { type: { enum: ["warning", "error"] } },
      },
      then: { required: ["severity"] },
    },
  ],
} as const;

export { ASSISTANT_RICH_CARD_SCHEMA_VERSION };
