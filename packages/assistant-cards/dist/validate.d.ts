import type { AssistantCardValidationIssue, AssistantCardValidationResult, AssistantRichCard } from "./types.js";
export interface AssistantCardsBatchValidationResult {
    valid: boolean;
    results: readonly AssistantCardValidationResult[];
    validCards: readonly AssistantRichCard[];
    issues: readonly AssistantCardValidationIssue[];
}
export declare function validateAssistantRichCard(input: unknown): AssistantCardValidationResult;
export declare function validateAssistantRichCards(cards: unknown): AssistantCardsBatchValidationResult;
export declare function assertAssistantRichCard(input: unknown): AssistantRichCard;
//# sourceMappingURL=validate.d.ts.map