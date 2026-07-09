import type { AssistantCardValidationIssue } from "./types.js";
/** Structured validation failure for invalid rich cards. */
export interface AssistantCardValidationError extends Error {
    name: "AssistantCardValidationError";
    issues: readonly AssistantCardValidationIssue[];
}
export declare function createAssistantCardValidationError(message: string, issues: readonly AssistantCardValidationIssue[]): AssistantCardValidationError;
/** Safe error card returned when validation fails — never expose raw invalid payloads. */
export declare function createSafeInvalidCardFallback(issues: readonly AssistantCardValidationIssue[], fallbackId?: string): import("./types.js").AssistantRichCard;
//# sourceMappingURL=errors.d.ts.map