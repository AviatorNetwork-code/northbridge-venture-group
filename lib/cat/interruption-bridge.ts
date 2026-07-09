import { INDUSTRY_QUESTION_BANK } from "@/lib/cat/industry-questions";
import type { DiscoveryProfile } from "@/lib/cat/discovery-types";
import type { BusinessProfile } from "@/lib/cat/types";
import {
  detectInterruption,
  handleInterruption,
  type InterruptionDetection,
  type InterruptionHandleResult,
} from "@northbridge/conversation-engine";
import { getLocalizedQuestionPrompt } from "@/lib/nordi/localized-content";
import type { NordiLanguage } from "@/lib/nordi/language/types";

export type ConversationInterruptionInput = {
  message: string;
  pendingQuestionId?: string;
  pendingQuestionPrompt?: string;
  language?: NordiLanguage;
  answeredQuestions?: string[];
};

export type ConversationInterruptionResult = InterruptionHandleResult & {
  detection: InterruptionDetection;
  humanAssistanceRequested: boolean;
};

export function resolvePendingQuestionPrompt(
  pendingQuestionId: string | undefined,
  language: NordiLanguage = "en",
): string | undefined {
  if (!pendingQuestionId) return undefined;

  const match = INDUSTRY_QUESTION_BANK.find((question) => question.id === pendingQuestionId);
  if (!match) return pendingQuestionId;

  return getLocalizedQuestionPrompt(match.id, language, match.prompt);
}

export function tryConversationInterruption(
  input: ConversationInterruptionInput,
): ConversationInterruptionResult | null {
  if (!input.pendingQuestionId) return null;

  const detection = detectInterruption({
    message: input.message,
    hasPendingQuestion: true,
    pendingQuestionId: input.pendingQuestionId,
  });

  if (!detection.isInterruption || !detection.type) {
    return null;
  }

  const pendingQuestionPrompt =
    input.pendingQuestionPrompt ??
    resolvePendingQuestionPrompt(input.pendingQuestionId, input.language ?? "en");

  const questionStillPending = !input.answeredQuestions?.includes(input.pendingQuestionId);

  const handled = handleInterruption({
    detection,
    language: input.language ?? "en",
    resume: {
      pendingQuestionId: input.pendingQuestionId,
      pendingQuestionPrompt,
      language: input.language ?? "en",
      questionStillPending,
    },
  });

  return {
    ...handled,
    detection,
    humanAssistanceRequested: detection.type === "human_assistance",
  };
}

export function isPendingQuestionAnswered(
  profile: Pick<DiscoveryProfile | BusinessProfile, "answeredQuestions">,
  pendingQuestionId?: string,
): boolean {
  if (!pendingQuestionId) return false;
  return profile.answeredQuestions?.includes(pendingQuestionId) ?? false;
}
