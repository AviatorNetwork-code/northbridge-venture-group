import type { ConsultantSessionState, SessionScores } from "./consultantTypes";

export interface SessionMetricsSnapshot {
  productUnderstandingScore: number;
  visitorConfidenceScore: number;
  recommendationAcceptanceRate: number;
  ctaClickThroughRate: number;
  meetingBookingRate: number;
  qualifiedLeadRate: number;
  conversationCompletionRate: number;
  returnVisitorRate: number;
  conversationSatisfaction: number;
  customerUnderstandingImprovement: number;
}

export function buildMetricsSnapshot(
  session: ConsultantSessionState,
): SessionMetricsSnapshot {
  const scores = session.scores;

  return {
    productUnderstandingScore: round(scores.productUnderstanding),
    visitorConfidenceScore: round(scores.visitorConfidence),
    recommendationAcceptanceRate: session.recommendationAccepted ? 1 : 0,
    ctaClickThroughRate: session.ctaClicked ? 1 : 0,
    meetingBookingRate: session.ctaClicked && session.stage === "convert" ? 1 : 0,
    qualifiedLeadRate:
      scores.conversionProbability >= 0.55 &&
      (session.profile.budgetMentioned || session.intelligence.buyingSignals.length >= 2)
        ? 1
        : 0,
    conversationCompletionRate: session.stage === "convert" ? 1 : round(session.turnCount / 6),
    returnVisitorRate: 0,
    conversationSatisfaction: round((scores.trust + scores.visitorConfidence) / 2),
    customerUnderstandingImprovement: round(
      scores.productUnderstanding - 0.1 + scores.solutionClarity,
    ),
  };
}

export function summarizeScoreDelta(before: SessionScores, after: SessionScores): Record<string, number> {
  return {
    productUnderstanding: round(after.productUnderstanding - before.productUnderstanding),
    visitorConfidence: round(after.visitorConfidence - before.visitorConfidence),
    solutionClarity: round(after.solutionClarity - before.solutionClarity),
    trust: round(after.trust - before.trust),
    conversionProbability: round(after.conversionProbability - before.conversionProbability),
  };
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}
