import type {
  ConsultantSessionState,
  ConversationIntelligenceCapture,
  SessionScores,
  VisitorProfile,
} from "./consultantTypes";
import {
  extractBuyingSignals,
  extractObjections,
  isQuestion,
} from "./intentDetection";

export function captureConversationIntelligence(
  input: string,
  session: ConsultantSessionState,
  matchedTopic?: string,
): ConversationIntelligenceCapture {
  const intel = { ...session.intelligence };
  const copy = <K extends keyof ConversationIntelligenceCapture>(key: K, value: string) => {
    if (!intel[key].includes(value)) {
      intel[key] = [...intel[key], value];
    }
  };

  if (isQuestion(input)) {
    copy("frequentlyAskedQuestions", input.slice(0, 200));
  }

  const objections = extractObjections(input);
  for (const objection of objections) {
    copy("objections", objection);
  }

  const buyingSignals = extractBuyingSignals(input);
  for (const signal of buyingSignals) {
    copy("buyingSignals", signal);
  }

  if (/confus|don't understand|unclear|what do you mean/.test(input.toLowerCase())) {
    copy("confusingExplanations", matchedTopic ?? "general");
  }

  if (/competitor|alternative vendor|other company|shopify|wix/.test(input.toLowerCase())) {
    copy("competitiveMentions", input.slice(0, 120));
  }

  if (/wish you had|need a feature|would be nice/.test(input.toLowerCase())) {
    copy("featureRequests", input.slice(0, 120));
  }

  if (!matchedTopic && isQuestion(input)) {
    copy("unansweredQuestions", input.slice(0, 200));
  }

  if (/misconception|thought you were|actually/.test(input.toLowerCase())) {
    copy("misconceptions", input.slice(0, 120));
  }

  return intel;
}

export function updateSessionScores(
  session: ConsultantSessionState,
  profile: VisitorProfile,
  hasRecommendation: boolean,
  buyingSignalCount: number,
): SessionScores {
  const contextRichness = Math.min(
    1,
    (profile.problems.length + profile.goals.length + (profile.industry ? 1 : 0)) / 5,
  );

  const productUnderstanding = clamp(
    session.scores.productUnderstanding + 0.12 * contextRichness + (hasRecommendation ? 0.15 : 0),
  );

  const visitorConfidence = clamp(
    session.scores.visitorConfidence + 0.08 + buyingSignalCount * 0.05,
  );

  const solutionClarity = clamp(
    hasRecommendation ? session.scores.solutionClarity + 0.2 : session.scores.solutionClarity + 0.05,
  );

  const trust = clamp(session.scores.trust + 0.06 + (profile.signals.length > 2 ? 0.05 : 0));

  const conversionProbability = clamp(
    0.1 +
      productUnderstanding * 0.25 +
      solutionClarity * 0.25 +
      trust * 0.2 +
      buyingSignalCount * 0.1 +
      (session.recommendationAccepted ? 0.15 : 0),
  );

  return {
    productUnderstanding,
    visitorConfidence,
    solutionClarity,
    trust,
    conversionProbability,
  };
}

function clamp(value: number): number {
  return Math.min(1, Math.max(0, value));
}

export function isQualifiedLead(session: ConsultantSessionState): boolean {
  return (
    session.scores.conversionProbability >= 0.55 &&
    (session.profile.urgency === "high" ||
      session.profile.budgetMentioned ||
      session.intelligence.buyingSignals.length >= 2 ||
      session.recommendationAccepted)
  );
}
