import type { CatCta } from "./websiteAssistantTypes";
import { CAT_CTAS } from "./websiteKnowledge";
import type { ConsultantSessionState, ConversationStage, ProductRecommendation } from "./consultantTypes";
import { getProductById } from "./productRecommendationEngine";
import { shouldSoftClose } from "./leadQualification";

/** Soft-close CTA sequencing — no pressure, stage-appropriate. */
export function selectConsultativeCtas(
  stage: ConversationStage,
  session: ConsultantSessionState,
  recommendation?: ProductRecommendation,
): CatCta[] {
  if (stage === "follow_up") {
    return [CAT_CTAS.contact];
  }

  if (stage === "close_softly" || (stage === "recommend" && shouldSoftClose(session))) {
    if (recommendation && !recommendation.honestNoFit) {
      const product = getProductById(recommendation.productId);
      const primary = product
        ? CAT_CTAS[product.ctaId as keyof typeof CAT_CTAS]
        : CAT_CTAS.contact;
      return [CAT_CTAS.contact, primary].filter(Boolean) as CatCta[];
    }
    return [CAT_CTAS.contact, CAT_CTAS.partner];
  }

  if (stage === "recommend" && recommendation && !recommendation.honestNoFit) {
    const product = getProductById(recommendation.productId);
    const primary = product
      ? CAT_CTAS[product.ctaId as keyof typeof CAT_CTAS]
      : CAT_CTAS.services;
    return [primary, CAT_CTAS.about];
  }

  if (stage === "handle_objections") {
    return [CAT_CTAS.contact, CAT_CTAS.about];
  }

  if (stage === "discover" || stage === "clarify") {
    return [CAT_CTAS.about];
  }

  if (stage === "teach") {
    return [CAT_CTAS.ventures, CAT_CTAS.services];
  }

  return [CAT_CTAS.services, CAT_CTAS.contact];
}

export function canExposeRecommendation(session: ConsultantSessionState): boolean {
  if (session.sales.activeObjection) return false;
  if (!session.sales.clarificationComplete) return false;
  if (session.stage === "discover" || session.stage === "clarify" || session.stage === "teach") {
    return false;
  }
  return (
    session.stage === "recommend" ||
    session.stage === "close_softly" ||
    session.stage === "follow_up"
  );
}
