import type {
  PresentationDecision,
  PresentationPolicyInput,
} from "./types.js";

/**
 * Platform-owned presentation policy. Products must not override format selection.
 */
export function resolvePresentationPolicy(
  input: PresentationPolicyInput,
): PresentationDecision {
  if (input.requiresConfirmation) {
    return {
      format: "confirmation",
      collapsedByDefault: false,
      maxVisibleRows: 6,
      reasoning: "Side effect requires explicit confirmation presentation.",
    };
  }

  if (input.stepCount && input.stepCount > 1) {
    return {
      format: "checklist",
      collapsedByDefault: false,
      maxVisibleRows: input.stepCount,
      reasoning: "Multi-step workflow detected — checklist modality.",
    };
  }

  if (input.hasStructuredData && (input.rowCount ?? 0) > 8) {
    return {
      format: "table",
      collapsedByDefault: true,
      maxVisibleRows: 6,
      reasoning: "High row count — table with collapsed default.",
    };
  }

  if (input.hasStructuredData && (input.rowCount ?? 0) > 0) {
    const expandable = (input.rowCount ?? 0) > 4;
    return {
      format: expandable ? "expandable_card" : "card",
      collapsedByDefault: expandable,
      maxVisibleRows: expandable ? 4 : input.rowCount ?? 4,
      reasoning: expandable
        ? "Structured data exceeds collapsed card limit."
        : "Structured data fits compact card.",
    };
  }

  if (input.confidence < 0.65 || input.intentType === "explain") {
    return {
      format: "detailed_answer",
      collapsedByDefault: false,
      maxVisibleRows: 0,
      reasoning: "Low confidence or explain intent — detailed prose.",
    };
  }

  const mobile = input.channel === "mobile";
  return {
    format: "short_answer",
    collapsedByDefault: mobile,
    maxVisibleRows: 0,
    reasoning: "High confidence, low complexity — short answer.",
  };
}
