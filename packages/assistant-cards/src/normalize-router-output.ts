import type { AssistantRichCard as ContractRichCard } from "@northbridge/assistant-contracts";
import type { AssistantRichCard, AssistantCardType } from "./types.js";
import {
  validateAssistantRichCards,
  validateAssistantRichCard,
} from "./validate.js";

/**
 * Maps legacy @northbridge/assistant-contracts planner cards to v1.0 schema
 * for validation at the platform boundary (NB-ASSIST-004).
 */
export function normalizeContractPlannerCard(
  card: ContractRichCard,
  index: number,
): AssistantRichCard {
  const type = mapContractStatusToCardType(card);
  const body =
    card.subtitle ??
    card.rows?.map((row) => `${row.label}: ${row.value}`).join("\n") ??
    card.title;

  const normalized: AssistantRichCard = {
    schema_version: "1.0",
    id: card.card_id || `card_normalized_${index}`,
    type,
    title: card.title,
    body,
  };

  if (type === "warning" || type === "error") {
    normalized.severity = card.status === "warning" ? "warning" : "error";
  }

  if (card.actions && card.actions.length > 0) {
    normalized.actions = card.actions.map((action) => ({
      action_id: action.action_id,
      label: action.label,
      draft_id: action.draft_id,
      disabled: action.disabled,
      disabled_reason: action.disabled_reason,
    }));
    if (card.actions.some((action) => action.draft_id)) {
      normalized.type = "confirmation_request";
    }
  }

  if (card.explanation) {
    normalized.metadata = {
      confidence: card.explanation.confidence,
      why: card.explanation.why,
    };
    if (normalized.type === "tool_result") {
      normalized.type = "explanation";
    }
  }

  return normalized;
}

function mapContractStatusToCardType(card: ContractRichCard): AssistantCardType {
  if (card.actions?.some((action) => action.draft_id)) {
    return "confirmation_request";
  }
  if (card.explanation) {
    return "explanation";
  }
  switch (card.status) {
    case "error":
      return "error";
    case "warning":
      return "warning";
    case "unsupported":
    case "missing_data":
      return "warning";
    case "pending":
      return "confirmation_request";
    case "success":
    default:
      return "tool_result";
  }
}

/** Validates cards produced by @northbridge/assistant-router response planner fakes. */
export function validateNormalizedPlannerCards(
  contractCards: readonly ContractRichCard[],
) {
  const normalized = contractCards.map(normalizeContractPlannerCard);
  return validateAssistantRichCards(normalized);
}

export function validateNormalizedPlannerCard(
  card: ContractRichCard,
  index = 0,
) {
  return validateAssistantRichCard(normalizeContractPlannerCard(card, index));
}
