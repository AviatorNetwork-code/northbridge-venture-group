import type { AssistantRichCard as ContractRichCard } from "@northbridge/assistant-contracts";
import type { AssistantRichCard } from "./types.js";
/**
 * Maps legacy @northbridge/assistant-contracts planner cards to v1.0 schema
 * for validation at the platform boundary (NB-ASSIST-004).
 */
export declare function normalizeContractPlannerCard(card: ContractRichCard, index: number): AssistantRichCard;
/** Validates cards produced by @northbridge/assistant-router response planner fakes. */
export declare function validateNormalizedPlannerCards(contractCards: readonly ContractRichCard[]): import("./validate.js").AssistantCardsBatchValidationResult;
export declare function validateNormalizedPlannerCard(card: ContractRichCard, index?: number): import("./types.js").AssistantCardValidationResult;
//# sourceMappingURL=normalize-router-output.d.ts.map