import type {
  AccumulatedFact,
  ConversationFactMemory,
  ExtractedFactInput,
  FactConfidence,
  FieldCorrection,
} from "./types.js";

const CONFIDENCE_RANK: Record<FactConfidence, number> = {
  low: 0,
  medium: 1,
  high: 2,
};

export function createEmptyFactMemory(): ConversationFactMemory {
  return {
    accumulatedFacts: {},
    answeredFields: [],
    missingFields: [],
    corrections: [],
    lastAskedQuestion: null,
    askedQuestionHistory: [],
  };
}

export function isPresentFactValue(value: unknown): boolean {
  if (value === undefined || value === null) return false;
  if (typeof value === "string" && value.trim() === "") return false;
  if (Array.isArray(value) && value.length === 0) return false;
  return true;
}

function valuesEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

function upsertAnsweredField(answeredFields: readonly string[], fieldId: string): string[] {
  if (answeredFields.includes(fieldId)) return [...answeredFields];
  return [...answeredFields, fieldId];
}

function buildAccumulatedFact(
  input: ExtractedFactInput,
  existing: AccumulatedFact | undefined,
  now: string,
): AccumulatedFact {
  const sourceMessageIds = [
    ...(existing?.sourceMessageIds ?? (existing?.sourceMessageId ? [existing.sourceMessageId] : [])),
    ...(input.sourceMessageId ? [input.sourceMessageId] : []),
  ];

  return {
    fieldId: input.fieldId,
    value: input.value,
    confidence: input.confidence ?? "medium",
    sourceMessageId: input.sourceMessageId ?? existing?.sourceMessageId,
    sourceMessageIds: Array.from(new Set(sourceMessageIds)),
    updatedAt: now,
    isCorrection: input.isCorrection === true,
    previousValue: input.isCorrection ? existing?.value : undefined,
  };
}

/**
 * Deterministically merge newly extracted facts into accumulated state.
 * Never replaces a valid existing fact unless the user explicitly corrects it.
 */
export function mergeExtractedFacts(
  memory: ConversationFactMemory,
  extracted: readonly ExtractedFactInput[],
  now: () => string = () => new Date().toISOString(),
): ConversationFactMemory {
  let accumulatedFacts = { ...memory.accumulatedFacts };
  let answeredFields = [...memory.answeredFields];
  const corrections: FieldCorrection[] = [...memory.corrections];
  const timestamp = now();

  for (const input of extracted) {
    if (!isPresentFactValue(input.value)) continue;

    const existing = accumulatedFacts[input.fieldId];
    const incomingConfidence = input.confidence ?? "medium";

    if (existing && !input.isCorrection) {
      const existingRank = CONFIDENCE_RANK[existing.confidence];
      const incomingRank = CONFIDENCE_RANK[incomingConfidence];

      if (isPresentFactValue(existing.value)) {
        if (valuesEqual(existing.value, input.value)) {
          accumulatedFacts = {
            ...accumulatedFacts,
            [input.fieldId]: buildAccumulatedFact(input, existing, timestamp),
          };
          answeredFields = upsertAnsweredField(answeredFields, input.fieldId);
          continue;
        }

        if (incomingRank <= existingRank) {
          continue;
        }
      }
    }

    if (input.isCorrection && existing && isPresentFactValue(existing.value)) {
      corrections.push({
        fieldId: input.fieldId,
        previousValue: existing.value,
        correctedValue: input.value,
        sourceMessageId: input.sourceMessageId,
        correctedAt: timestamp,
      });
    }

    accumulatedFacts = {
      ...accumulatedFacts,
      [input.fieldId]: buildAccumulatedFact(input, existing, timestamp),
    };
    answeredFields = upsertAnsweredField(answeredFields, input.fieldId);
  }

  return {
    ...memory,
    accumulatedFacts,
    answeredFields,
    corrections,
  };
}
