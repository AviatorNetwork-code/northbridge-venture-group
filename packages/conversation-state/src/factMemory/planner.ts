import type {
  AccumulatedFact,
  ConversationFactMemory,
  ConversationFieldDefinition,
} from "./types.js";
import { isPresentFactValue } from "./merge.js";

function defaultIsAnswered(
  fieldId: string,
  facts: Readonly<Record<string, AccumulatedFact>>,
  answeredFields: readonly string[],
): boolean {
  if (answeredFields.includes(fieldId)) return true;
  const fact = facts[fieldId];
  return Boolean(fact && isPresentFactValue(fact.value));
}

export function isFieldAnswered(
  field: ConversationFieldDefinition,
  memory: ConversationFactMemory,
): boolean {
  if (field.isAnswered) {
    return field.isAnswered(memory.accumulatedFacts, memory.answeredFields);
  }
  return defaultIsAnswered(field.fieldId, memory.accumulatedFacts, memory.answeredFields);
}

export function syncMissingFields(
  memory: ConversationFactMemory,
  fieldDefinitions: readonly ConversationFieldDefinition[],
): ConversationFactMemory {
  const missingFields = fieldDefinitions
    .filter((field) => field.required && !isFieldAnswered(field, memory))
    .map((field) => field.fieldId);

  return {
    ...memory,
    missingFields,
  };
}

function askedSemanticKeys(history: ConversationFactMemory["askedQuestionHistory"]): Set<string> {
  return new Set(history.map((record) => record.semanticKey));
}

function askedFieldIds(history: ConversationFactMemory["askedQuestionHistory"]): Set<string> {
  return new Set(history.map((record) => record.fieldId));
}

function satisfiedSemanticKeys(
  memory: ConversationFactMemory,
  fieldDefinitions: readonly ConversationFieldDefinition[],
): Set<string> {
  return new Set(
    fieldDefinitions
      .filter((field) => isFieldAnswered(field, memory))
      .map((field) => field.semanticKey),
  );
}

/**
 * Choose the next required question deterministically.
 * Skips answered fields and semantically repeated questions.
 */
export function selectNextQuestion(
  memory: ConversationFactMemory,
  fieldDefinitions: readonly ConversationFieldDefinition[],
): {
  question: ConversationFieldDefinition | null;
  skippedRepeatedQuestions: string[];
} {
  const semanticKeys = askedSemanticKeys(memory.askedQuestionHistory);
  const fieldIds = askedFieldIds(memory.askedQuestionHistory);
  const answeredSemantics = satisfiedSemanticKeys(memory, fieldDefinitions);
  const skippedRepeatedQuestions: string[] = [];

  const candidates = fieldDefinitions
    .filter((field) => field.required)
    .filter((field) => memory.missingFields.includes(field.fieldId))
    .filter((field) => !isFieldAnswered(field, memory))
    .sort((a, b) => (a.priority ?? 100) - (b.priority ?? 100));

  let selected: ConversationFieldDefinition | null = null;

  for (const field of candidates) {
    if (answeredSemantics.has(field.semanticKey)) {
      skippedRepeatedQuestions.push(field.fieldId);
      continue;
    }
    if (semanticKeys.has(field.semanticKey) || fieldIds.has(field.fieldId)) {
      skippedRepeatedQuestions.push(field.fieldId);
      continue;
    }
    if (!selected) {
      selected = field;
    }
  }

  return { question: selected, skippedRepeatedQuestions };
}

export function recordAskedQuestion(
  memory: ConversationFactMemory,
  question: ConversationFieldDefinition,
  sourceMessageId?: string,
  now: () => string = () => new Date().toISOString(),
): ConversationFactMemory {
  const askedAt = now();
  const record = {
    fieldId: question.fieldId,
    semanticKey: question.semanticKey,
    prompt: question.prompt,
    askedAt,
    sourceMessageId,
  };

  return {
    ...memory,
    lastAskedQuestion: question.prompt,
    askedQuestionHistory: [...memory.askedQuestionHistory, record],
  };
}

export function recordAnswerForQuestion(
  memory: ConversationFactMemory,
  fieldId: string,
): ConversationFactMemory {
  if (memory.lastAskedQuestion === null) return memory;
  const lastRecord = memory.askedQuestionHistory.at(-1);
  if (!lastRecord || lastRecord.fieldId !== fieldId) return memory;

  return {
    ...memory,
    lastAskedQuestion: null,
  };
}
