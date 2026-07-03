import type { ConversationStage, ProductRecommendation } from "./consultantTypes";

export function buildTrustStatement(
  stage: ConversationStage,
  hasUncertainty: boolean,
): string {
  if (hasUncertainty) {
    return "I want to be transparent: I may not have every detail without learning more about your situation. I'll recommend only what genuinely fits.";
  }

  if (stage === "recommend" || stage === "convert") {
    return "Northbridge focuses on structured, practical outcomes—not hype. I'll explain my reasoning and alternatives so you can decide confidently.";
  }

  return "Northbridge builds and operates real platforms and infrastructure. I'll guide you based on what fits—not what sounds impressive.";
}

export function buildReasoningExplanation(recommendation: ProductRecommendation): string {
  if (recommendation.honestNoFit) {
    return "I'd rather be honest than recommend something that isn't the right fit. A brief conversation with our team may clarify the best path.";
  }

  return [
    `Why ${recommendation.productName}: ${recommendation.why}`,
    `Expected benefits: ${recommendation.expectedBenefits.slice(0, 2).join("; ")}.`,
    recommendation.alternatives.length > 0
      ? `Alternatives worth considering: ${recommendation.alternatives.join(", ")}.`
      : "",
  ]
    .filter(Boolean)
    .join(" ");
}

export function admitUncertainty(topic: string): string {
  return `I don't have enough verified detail about ${topic} to speak definitively. I can share what Northbridge publicly offers, or you can reach our team for specifics.`;
}

export function reinforceExpertise(industry?: string): string {
  if (industry === "aviation") {
    return "Northbridge has deep aviation experience—including building and operating Aviator Network, a full pilot-instructor marketplace.";
  }
  return "Northbridge develops ventures and digital infrastructure across aviation, financial services, and professional industries.";
}

export function avoidOversell(recommendation: ProductRecommendation): string {
  if (recommendation.fitScore >= 0.75) {
    return "This looks like a strong fit, but I'd still encourage a brief consultation to confirm scope and timeline.";
  }
  return "This is a reasonable starting point to explore—not a final commitment.";
}
