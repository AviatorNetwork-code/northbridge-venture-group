import type { ConsultantSessionState, LeadQualificationScore } from "./consultantTypes";
import { extractBuyingSignals } from "./intentDetection";

export function scoreLeadQualification(
  session: ConsultantSessionState,
  input: string,
): LeadQualificationScore {
  const { profile, sales, scores } = session;
  const buyingSignals = extractBuyingSignals(input);

  const budgetFit = profile.budgetMentioned ? 0.85 : buyingSignals.includes("pricing") ? 0.5 : 0.2;

  const urgencyFit =
    profile.urgency === "high" ? 0.9 : profile.urgency === "medium" ? 0.6 : 0.3;

  const problemClarity = clamp(
    (sales.primaryChallenge ? 0.5 : 0) +
      profile.problems.length * 0.15 +
      profile.goals.length * 0.1,
  );

  const authoritySignals = clamp(
    (profile.visitorType === "business_owner" || profile.visitorType === "founder" ? 0.4 : 0.1) +
      (buyingSignals.includes("consultation") || buyingSignals.includes("meeting") ? 0.4 : 0) +
      (session.recommendationAccepted ? 0.2 : 0),
  );

  const overall = clamp(
    budgetFit * 0.2 +
      urgencyFit * 0.2 +
      problemClarity * 0.25 +
      authoritySignals * 0.2 +
      scores.trust * 0.15,
  );

  const isQualified =
    overall >= 0.55 &&
    (problemClarity >= 0.4 || sales.clarificationComplete) &&
    (buyingSignals.length >= 1 ||
      profile.urgency === "high" ||
      session.recommendationAccepted ||
      scores.conversionProbability >= 0.55);

  return {
    overall,
    budgetFit,
    urgencyFit,
    problemClarity,
    authoritySignals,
    isQualified,
  };
}

export function shouldSoftClose(session: ConsultantSessionState): boolean {
  return (
    session.leadQualification.isQualified ||
    session.recommendationAccepted ||
    (session.recommendedProductId !== undefined &&
      session.scores.conversionProbability >= 0.55 &&
      session.sales.teachingComplete)
  );
}

function clamp(value: number): number {
  return Math.min(1, Math.max(0, value));
}
