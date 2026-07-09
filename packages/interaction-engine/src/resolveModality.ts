import type {
  InteractionModalityDecision,
  InteractionModalityInput,
} from "./types.js";

const FORMAT_TO_MODALITY: Record<string, InteractionModalityDecision["modality"]> = {
  short_answer: "message",
  detailed_answer: "message",
  card: "card",
  expandable_card: "card",
  table: "card",
  timeline: "timeline",
  checklist: "form",
  confirmation: "confirmation",
};

/**
 * Map conversation turn + presentation policy to interaction modality.
 */
export function resolveInteractionModality(
  input: InteractionModalityInput,
): InteractionModalityDecision {
  if (input.severity === "error" || input.severity === "warning") {
    return {
      modality: "alert",
      reasoning: "Elevated severity — alert modality.",
    };
  }

  if (input.turnAction === "confirm") {
    return {
      modality: "confirmation",
      reasoning: "Turn action requires confirmation modality.",
    };
  }

  if (input.turnAction === "ask" || input.hasFormFields) {
    return {
      modality: "form",
      reasoning: "Information collection — progressive form modality.",
    };
  }

  if (input.hasTimeSeries) {
    return {
      modality: "timeline",
      reasoning: "Time-ordered data — timeline modality.",
    };
  }

  if (input.hasMetrics && input.presentationFormat === "card") {
    return {
      modality: "chart",
      reasoning: "Metrics present — chart modality within card shell.",
    };
  }

  if (input.turnAction === "finish_workflow") {
    return {
      modality: "quick_actions",
      reasoning: "Workflow complete — suggest next actions.",
    };
  }

  const mapped = FORMAT_TO_MODALITY[input.presentationFormat] ?? "message";
  return {
    modality: mapped,
    reasoning: `Presentation format '${input.presentationFormat}' maps to '${mapped}'.`,
  };
}
