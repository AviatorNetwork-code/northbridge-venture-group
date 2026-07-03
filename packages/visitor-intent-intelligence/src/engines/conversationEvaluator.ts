import type { CatInteractionRecord, ConversationEvaluation } from "../types/conversation.js";
import type { IntentInference } from "../types/intent.js";
import type { JourneyUnderstanding } from "../types/journey.js";

const LONG_CONVERSATION_THRESHOLD = 6;

export function evaluateConversation(
  interactions: CatInteractionRecord[],
  intent: IntentInference,
  journey: JourneyUnderstanding,
): ConversationEvaluation | undefined {
  if (interactions.length === 0) return undefined;

  const visitorMessages = interactions.filter((i) => i.role === "visitor");
  const catMessages = interactions.filter((i) => i.role === "cat");
  const matchedTopics = catMessages.filter((m) => m.matchedTopic).length;
  const ctasClicked = interactions.filter((i) => i.ctaClicked).length;

  const intentIdentifiedCorrectly =
    matchedTopics > 0 || intent.confidence >= 0.55;

  const followUpQuestionsAppropriate =
    visitorMessages.length <= 3 || matchedTopics >= visitorMessages.length * 0.5;

  const conversationTooLong = interactions.length >= LONG_CONVERSATION_THRESHOLD;

  const unnecessaryInformationPresented =
    conversationTooLong && ctasClicked === 0 && journey.completedObjectives.length === 0;

  const recommendationsPersonalized =
    matchedTopics > 0 && intent.supportingEvidence.some((e) => e.source === "cat");

  const guidedToNextBestAction =
    ctasClicked > 0 || journey.completedObjectives.length > 0;

  const checks = [
    intentIdentifiedCorrectly,
    followUpQuestionsAppropriate,
    !conversationTooLong,
    !unnecessaryInformationPresented,
    recommendationsPersonalized,
    guidedToNextBestAction,
  ];

  const catGuidanceScore = checks.filter(Boolean).length / checks.length;

  const improvementRecommendations: string[] = [];

  if (!intentIdentifiedCorrectly) {
    improvementRecommendations.push(
      "Improve CAT intent detection for this visitor profile with clearer follow-up prompts.",
    );
  }
  if (conversationTooLong) {
    improvementRecommendations.push(
      "Shorten CAT conversations by offering next-best-action CTAs earlier.",
    );
  }
  if (!guidedToNextBestAction) {
    improvementRecommendations.push(
      "Guide visitors toward a concrete CTA aligned with inferred intent.",
    );
  }
  if (unnecessaryInformationPresented) {
    improvementRecommendations.push(
      "Reduce generic responses; prioritize personalized recommendations.",
    );
  }
  if (journey.unansweredQuestions.length > 0) {
    improvementRecommendations.push(
      `Address unanswered questions: ${journey.unansweredQuestions.slice(0, 3).join("; ")}`,
    );
  }

  return {
    intentIdentifiedCorrectly,
    followUpQuestionsAppropriate,
    conversationTooLong,
    unnecessaryInformationPresented,
    recommendationsPersonalized,
    guidedToNextBestAction,
    catGuidanceScore,
    improvementRecommendations,
  };
}

export function extractCatInteractions(events: import("../types/journey.js").JourneyEvent[]): CatInteractionRecord[] {
  return events
    .filter((e) => e.type === "cat_message")
    .map((e) => ({
      timestamp: e.timestamp,
      role: (e.metadata?.role === "cat" ? "cat" : "visitor") as "visitor" | "cat",
      content: String(e.metadata?.content ?? e.label ?? ""),
      matchedTopic: e.metadata?.matchedTopic as string | undefined,
      recommendationAction: e.metadata?.recommendationAction as string | undefined,
      ctaClicked: e.metadata?.ctaClicked as string | undefined,
    }));
}
