import type { ConversationStage, ConsultantSessionState } from "./consultantTypes";

const STAGE_ORDER: ConversationStage[] = [
  "understand",
  "educate",
  "discover_fit",
  "build_trust",
  "recommend",
  "convert",
];

export function determineStage(session: ConsultantSessionState): ConversationStage {
  const { profile, turnCount, recommendedProductId } = session;
  const hasContext =
    profile.industry ||
    profile.problems.length > 0 ||
    profile.goals.length > 0 ||
    profile.visitorType !== "unknown";

  if (turnCount === 0) return "understand";
  if (!hasContext && turnCount <= 2) return "understand";
  if (turnCount <= 2 && !profile.industry && profile.visitorType === "unknown") {
    return "understand";
  }
  if (!recommendedProductId && turnCount <= 4) return "educate";
  if (!recommendedProductId) return "discover_fit";
  if (session.scores.trust < 0.65) return "build_trust";
  if (session.scores.conversionProbability >= 0.6) return "convert";
  if (recommendedProductId) return "recommend";
  return "discover_fit";
}

export function getStageLabel(stage: ConversationStage): string {
  const labels: Record<ConversationStage, string> = {
    understand: "Understanding your needs",
    educate: "Sharing how Northbridge helps",
    discover_fit: "Finding the right fit",
    build_trust: "Building clarity and trust",
    recommend: "Recommending a solution",
    convert: "Next steps",
  };
  return labels[stage];
}

export function hasStageProgressed(
  previous: ConversationStage,
  next: ConversationStage,
): boolean {
  return STAGE_ORDER.indexOf(next) > STAGE_ORDER.indexOf(previous);
}
