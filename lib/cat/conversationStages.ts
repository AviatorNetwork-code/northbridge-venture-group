import type { ConversationStage, ConsultantSessionState } from "./consultantTypes";
import { shouldSoftClose } from "./leadQualification";

const STAGE_ORDER: ConversationStage[] = [
  "discover",
  "clarify",
  "teach",
  "recommend",
  "handle_objections",
  "close_softly",
  "follow_up",
];

export function determineStage(session: ConsultantSessionState): ConversationStage {
  const { sales, profile, turnCount } = session;
  const hasContactIntent =
    profile.goals.some((g) => /contact|meeting|consultation/.test(g)) ||
    session.intelligence.buyingSignals.some((s) =>
      ["contact", "consultation", "meeting"].includes(s),
    );

  if (hasContactIntent && turnCount >= 2) return "follow_up";
  if (sales.activeObjection) return "handle_objections";
  if (shouldSoftClose(session) && session.recommendedProductId) return "close_softly";
  if (
    session.recommendedProductId &&
    sales.clarificationComplete &&
    sales.primaryChallenge
  ) {
    return "recommend";
  }
  if (sales.primaryChallenge && !sales.teachingComplete) return "teach";
  if (sales.launchContext && !sales.primaryChallenge) return "clarify";
  if (turnCount >= 1) return "discover";
  return "discover";
}

export function getStageLabel(stage: ConversationStage): string {
  const labels: Record<ConversationStage, string> = {
    discover: "Understanding your situation",
    clarify: "Clarifying priorities",
    teach: "Sharing relevant context",
    recommend: "Exploring fit",
    handle_objections: "Addressing your questions",
    close_softly: "Next steps",
    follow_up: "Following up",
  };
  return labels[stage];
}

export function hasStageProgressed(
  previous: ConversationStage,
  next: ConversationStage,
): boolean {
  return STAGE_ORDER.indexOf(next) > STAGE_ORDER.indexOf(previous);
}

export function isDiscoveryPhase(stage: ConversationStage): boolean {
  return stage === "discover" || stage === "clarify";
}

export function isRecommendationPhase(stage: ConversationStage): boolean {
  return stage === "recommend" || stage === "close_softly" || stage === "follow_up";
}

export function getStageProgress(stage: ConversationStage): number {
  const idx = STAGE_ORDER.indexOf(stage);
  return idx >= 0 ? Math.round(((idx + 1) / STAGE_ORDER.length) * 100) : 0;
}
