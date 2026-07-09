import { ASSISTANT_RICH_CARD_SCHEMA_VERSION } from "./types.js";
/**
 * JSON Schema (draft-07 compatible object) for AssistantRichCard v1.0.
 * Used for documentation and cross-language validation; runtime uses validate.ts.
 */
export declare const assistantRichCardJsonSchema: {
    readonly $schema: "http://json-schema.org/draft-07/schema#";
    readonly $id: "https://northbridge.dev/schemas/assistant-rich-card/v1.0";
    readonly title: "AssistantRichCard";
    readonly type: "object";
    readonly additionalProperties: false;
    readonly required: readonly ["schema_version", "id", "type", "title", "body"];
    readonly properties: {
        readonly schema_version: {
            readonly type: "string";
            readonly const: "1.0";
        };
        readonly id: {
            readonly type: "string";
            readonly minLength: 1;
        };
        readonly type: {
            readonly type: "string";
            readonly enum: readonly import("./types.js").AssistantCardType[];
        };
        readonly title: {
            readonly type: "string";
            readonly minLength: 1;
        };
        readonly body: {
            readonly type: "string";
            readonly minLength: 1;
        };
        readonly severity: {
            readonly type: "string";
            readonly enum: readonly import("./types.js").AssistantCardSeverity[];
        };
        readonly actions: {
            readonly type: "array";
            readonly minItems: 1;
            readonly items: {
                readonly type: "object";
                readonly additionalProperties: false;
                readonly required: readonly ["action_id", "label"];
                readonly properties: {
                    readonly action_id: {
                        readonly type: "string";
                        readonly minLength: 1;
                    };
                    readonly label: {
                        readonly type: "string";
                        readonly minLength: 1;
                    };
                    readonly draft_id: {
                        readonly type: "string";
                    };
                    readonly disabled: {
                        readonly type: "boolean";
                    };
                    readonly disabled_reason: {
                        readonly type: "string";
                    };
                };
            };
        };
        readonly metadata: {
            readonly type: "object";
            readonly additionalProperties: {
                readonly type: readonly ["string", "number", "boolean", "null"];
            };
        };
        readonly created_at: {
            readonly type: "string";
            readonly format: "date-time";
        };
    };
    readonly allOf: readonly [{
        readonly if: {
            readonly properties: {
                readonly type: {
                    readonly const: "confirmation_request";
                };
            };
        };
        readonly then: {
            readonly required: readonly ["actions"];
        };
    }, {
        readonly if: {
            readonly properties: {
                readonly type: {
                    readonly enum: readonly ["warning", "error"];
                };
            };
        };
        readonly then: {
            readonly required: readonly ["severity"];
        };
    }];
};
export { ASSISTANT_RICH_CARD_SCHEMA_VERSION };
//# sourceMappingURL=schema.d.ts.map