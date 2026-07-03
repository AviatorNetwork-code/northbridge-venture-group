import type { SessionIntelligence, ExecutiveReport } from "../types/reporting.js";
import type { ImprovementRecommendation } from "../types/reporting.js";
import { summarizeBusinessCorrelations } from "./businessCorrelationEngine.js";

export function generateExecutiveReport(
  sessions: SessionIntelligence[],
  productId: string,
): ExecutiveReport {
  const sessionCount = sessions.length;

  const intentDistribution: Record<string, number> = {};
  for (const session of sessions) {
    const id = session.intent.primaryIntent.id;
    intentDistribution[id] = (intentDistribution[id] ?? 0) + 1;
  }

  const visitorSuccessScore = average(sessions.map((s) => s.outcome.successScore));
  const intentAccuracyScore = average(sessions.map((s) => s.intent.confidence));

  const conversationSessions = sessions.filter((s) => s.conversation);
  const catGuidanceScore = conversationSessions.length
    ? average(conversationSessions.map((s) => s.conversation!.catGuidanceScore))
    : 0;

  const journeyCompletionRate = average(
    sessions.map((s) => (s.outcome.objectiveAchieved ? 1 : 0)),
  );

  const unansweredCounts = new Map<string, number>();
  for (const session of sessions) {
    for (const question of session.journey.unansweredQuestions) {
      unansweredCounts.set(question, (unansweredCounts.get(question) ?? 0) + 1);
    }
  }

  const topUnansweredQuestions = [...unansweredCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([question]) => question);

  const frictionByIntent = new Map<string, number>();
  for (const session of sessions) {
    const frictionCount = session.journey.frictionEvents.length;
    if (frictionCount > 0) {
      const id = session.intent.primaryIntent.id;
      frictionByIntent.set(id, (frictionByIntent.get(id) ?? 0) + frictionCount);
    }
  }

  const highestFrictionIntentId = [...frictionByIntent.entries()].sort(
    (a, b) => b[1] - a[1],
  )[0]?.[0];

  const businessSummary = summarizeBusinessCorrelations(
    sessions.map((s) => s.business).filter((b): b is NonNullable<typeof b> => Boolean(b)),
  );

  const recommendedCatImprovements = dedupe(
    sessions.flatMap((s) => s.catImprovementRecommendations),
  ).slice(0, 10);

  const recommendedProductImprovements = dedupe(
    sessions.flatMap((s) => s.productImprovementRecommendations),
  ).slice(0, 10);

  return {
    schemaVersion: "1.0.0",
    generatedAt: Date.now(),
    productId,
    sessionCount,
    intentDistribution,
    visitorSuccessScore,
    intentAccuracyScore,
    catGuidanceScore,
    journeyCompletionRate,
    topUnansweredQuestions,
    highestFrictionIntentId,
    highestValueIntentId: businessSummary.highestValueIntentId,
    recommendedCatImprovements,
    recommendedProductImprovements,
  };
}

export function buildImprovementRecommendations(
  session: SessionIntelligence,
): ImprovementRecommendation[] {
  const recommendations: ImprovementRecommendation[] = [];

  for (const [index, summary] of session.catImprovementRecommendations.entries()) {
    recommendations.push({
      id: `cat-${session.sessionId}-${index}`,
      area: "cat",
      priority: session.conversation && session.conversation.catGuidanceScore < 0.5 ? "high" : "medium",
      summary,
      rationale: "Derived from conversation evaluation and journey friction.",
      requiresFounderApproval: true,
    });
  }

  for (const [index, summary] of session.productImprovementRecommendations.entries()) {
    recommendations.push({
      id: `product-${session.sessionId}-${index}`,
      area: session.journey.frictionEvents.length > 0 ? "navigation" : "content",
      priority: session.outcome.classification === "abandoned" ? "high" : "medium",
      summary,
      rationale: "Derived from journey understanding and outcome classification.",
      requiresFounderApproval: true,
    });
  }

  return recommendations;
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

function dedupe(items: string[]): string[] {
  return [...new Set(items)];
}
