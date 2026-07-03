import { determineStage, getStageLabel } from "./conversationStages";
import {
  captureConversationIntelligence,
  isQualifiedLead,
  updateSessionScores,
} from "./conversationIntelligence";
import type {
  ConsultantSessionState,
  ConversationStage,
  ProductRecommendation,
} from "./consultantTypes";
import {
  detectIntents,
  extractBuyingSignals,
  extractProfileSignals,
  isQuestion,
} from "./intentDetection";
import { getProductById, recommendProduct } from "./productRecommendationEngine";
import {
  admitUncertainty,
  avoidOversell,
  buildReasoningExplanation,
  buildTrustStatement,
  reinforceExpertise,
} from "./trustFramework";
import {
  CAT_CTAS,
  KNOWLEDGE_TOPICS,
  type KnowledgeTopic,
} from "./websiteKnowledge";
import type { CatAssistantResponse, CatCta, CatConversationContext } from "./websiteAssistantTypes";

function normalizeInput(input: string): string {
  return input.trim().toLowerCase().replace(/\s+/g, " ");
}

function findKnowledgeTopic(input: string): KnowledgeTopic | null {
  const normalized = normalizeInput(input);
  let best: KnowledgeTopic | null = null;
  let bestScore = 0;

  for (const topic of KNOWLEDGE_TOPICS) {
    let score = 0;
    for (const keyword of topic.keywords) {
      if (normalized.includes(keyword)) score += keyword.split(" ").length;
    }
    if (score > bestScore) {
      bestScore = score;
      best = topic;
    }
  }

  return bestScore > 0 ? best : null;
}

function buildFollowUpQuestion(session: ConsultantSessionState): string | undefined {
  const { profile, stage } = session;

  if (stage === "understand") {
    if (!profile.industry) {
      return "What industry are you in, and what prompted you to explore Northbridge today?";
    }
    if (profile.problems.length === 0) {
      return "What's the main challenge you're trying to solve right now?";
    }
    if (profile.goals.length === 0) {
      return "What would a successful outcome look like for you in the next few months?";
    }
  }

  if (stage === "educate" && profile.visitorType === "unknown") {
    return "Are you exploring this as a business owner, founder, or operator?";
  }

  if (stage === "discover_fit" && !session.recommendedProductId) {
    return "Would you like me to recommend the Northbridge product that best fits your situation?";
  }

  return undefined;
}

function selectStageCtas(
  stage: ConversationStage,
  recommendation?: ProductRecommendation,
): CatCta[] {
  if (stage === "convert" || stage === "recommend") {
    if (recommendation && !recommendation.honestNoFit) {
      const product = getProductById(recommendation.productId);
      const primary = product ? CAT_CTAS[product.ctaId as keyof typeof CAT_CTAS] : CAT_CTAS.contact;
      return [primary, CAT_CTAS.contact].filter(Boolean) as CatCta[];
    }
    return [CAT_CTAS.contact, CAT_CTAS.services];
  }

  if (stage === "understand") {
    return [CAT_CTAS.about];
  }

  if (stage === "educate") {
    return [CAT_CTAS.ventures, CAT_CTAS.services];
  }

  return [CAT_CTAS.services, CAT_CTAS.contact];
}

function buildStageMessage(
  session: ConsultantSessionState,
  input: string,
  topic: KnowledgeTopic | null,
  recommendation: ProductRecommendation,
): string {
  const { stage, profile } = session;
  const parts: string[] = [];

  if (stage === "understand") {
    parts.push(
      "Thanks for sharing. I'm here to understand your situation first—not to rush you toward a sale.",
    );
    if (/trust|why should i|proof|credibility|different/.test(normalizeInput(input))) {
      parts.push(buildTrustStatement("build_trust", false));
      parts.push(reinforceExpertise(profile.industry));
    } else if (topic) {
      parts.push(trimToSentences(topic.message, 2));
    } else {
      parts.push(
        "Northbridge Venture Group builds ventures and digital infrastructure for industries like aviation, financial services, and professional services.",
      );
    }
  }

  if (stage === "educate") {
    parts.push(reinforceExpertise(profile.industry));
    if (topic) {
      parts.push(trimToSentences(topic.message, 2));
    } else {
      parts.push(
        "Our difference: we build and operate real platforms—not just brochure websites. Aviator Network is one example of a full marketplace we run.",
      );
    }
    parts.push(buildTrustStatement(stage, false));
  }

  if (stage === "discover_fit" || stage === "recommend") {
    if (recommendation.honestNoFit) {
      parts.push(
        "Based on what you've shared so far, I don't want to recommend a specific product prematurely.",
      );
      parts.push(admitUncertainty("the best product fit"));
    } else {
      parts.push(`My recommendation: ${recommendation.productName}.`);
      parts.push(buildReasoningExplanation(recommendation));
      parts.push(`Timeline: ${recommendation.expectedTimeline}`);
      parts.push(`Expected value: ${recommendation.expectedRoi}`);
      parts.push(avoidOversell(recommendation));
    }
    parts.push(buildTrustStatement(stage, recommendation.honestNoFit ?? false));
  }

  if (stage === "build_trust") {
    parts.push(buildTrustStatement(stage, false));
    if (recommendation.productId !== "none") {
      parts.push(buildReasoningExplanation(recommendation));
    }
  }

  if (stage === "convert") {
    parts.push("When you're ready, here are appropriate next steps—no pressure.");
    if (recommendation.productId !== "none" && !recommendation.honestNoFit) {
      parts.push(
        `I'd suggest starting with ${recommendation.productName}, then a brief consultation if you want to confirm scope.`,
      );
    } else {
      parts.push("A brief consultation with Northbridge is the best way to clarify fit and next steps.");
    }
  }

  const followUp = buildFollowUpQuestion(session);
  if (followUp && stage !== "convert") {
    parts.push(followUp);
  }

  return parts.join("\n\n");
}

function trimToSentences(text: string, maxSentences: number): string {
  const sentences = text.match(/[^.!?]+[.!?]+/g) ?? [text];
  return sentences.slice(0, maxSentences).join(" ").trim();
}

export function runConsultantTurn(
  input: string,
  context?: CatConversationContext,
): CatAssistantResponse & {
  session: ConsultantSessionState;
  followUpQuestion?: string;
  productRecommendation?: ProductRecommendation;
} {
  const session: ConsultantSessionState = context?.session
    ? { ...context.session, profile: { ...context.session.profile } }
    : {
        profile: { visitorType: "unknown", problems: [], goals: [], signals: [] },
        stage: "understand",
        scores: {
          productUnderstanding: 0.1,
          visitorConfidence: 0.3,
          solutionClarity: 0.1,
          trust: 0.4,
          conversionProbability: 0.1,
        },
        intelligence: {
          frequentlyAskedQuestions: [],
          confusingExplanations: [],
          objections: [],
          missingContent: [],
          featureRequests: [],
          competitiveMentions: [],
          misconceptions: [],
          unansweredQuestions: [],
          frictionPoints: [],
          buyingSignals: [],
        },
        turnCount: 0,
        recommendationAccepted: false,
        ctaClicked: false,
      };

  const previousScores = { ...session.scores };
  session.turnCount += 1;

  session.profile = extractProfileSignals(input, session.profile);
  const intents = detectIntents(input);
  const topic = findKnowledgeTopic(input);
  const buyingSignals = extractBuyingSignals(input);

  session.intelligence = captureConversationIntelligence(
    input,
    session,
    topic?.id,
  );

  const recommendation = recommendProduct(session.profile, input);
  if (recommendation.productId !== "none" && recommendation.fitScore >= 0.45) {
    session.recommendedProductId = recommendation.productId;
  }

  if (/yes|sounds good|recommend|that works|let's do|agree/.test(normalizeInput(input))) {
    session.recommendationAccepted = true;
  }

  session.stage = determineStage(session);
  session.scores = updateSessionScores(
    session,
    session.profile,
    Boolean(session.recommendedProductId),
    buyingSignals.length,
  );

  const followUpQuestion = buildFollowUpQuestion(session);
  const message = buildStageMessage(session, input, topic, recommendation);
  const ctas = selectStageCtas(session.stage, recommendation);

  const primaryIntent = intents[0]?.intent ?? topic?.id ?? "general";

  return {
    message,
    ctas,
    recommendation: session.recommendedProductId
      ? {
          action:
            session.stage === "convert"
              ? "contact"
              : session.stage === "recommend"
                ? "explore_products"
                : "continue_browsing",
          summary: `Recommended: ${recommendation.productName}`,
          reason: recommendation.why,
        }
      : undefined,
    matchedTopic: topic?.id,
    stage: session.stage,
    stageLabel: getStageLabel(session.stage),
    followUpQuestion,
    productRecommendation:
      recommendation.productId !== "none" ? recommendation : undefined,
    session,
    sessionScoreDelta: {
      before: previousScores,
      after: session.scores,
    },
    qualifiedLead: isQualifiedLead(session),
    primaryIntent,
  };
}

export function getConsultantGreeting(): CatAssistantResponse & {
  session: ConsultantSessionState;
  followUpQuestion?: string;
} {
  const session: ConsultantSessionState = {
    profile: { visitorType: "unknown", problems: [], goals: [], signals: [] },
    stage: "understand",
    scores: {
      productUnderstanding: 0.1,
      visitorConfidence: 0.35,
      solutionClarity: 0.05,
      trust: 0.45,
      conversionProbability: 0.08,
    },
    intelligence: {
      frequentlyAskedQuestions: [],
      confusingExplanations: [],
      objections: [],
      missingContent: [],
      featureRequests: [],
      competitiveMentions: [],
      misconceptions: [],
      unansweredQuestions: [],
      frictionPoints: [],
      buyingSignals: [],
    },
    turnCount: 0,
    recommendationAccepted: false,
    ctaClicked: false,
  };

  return {
    message: [
      "Hello — I'm your Northbridge digital solutions consultant.",
      "My goal isn't just to answer questions. I help you understand what Northbridge does, which product fits your needs, and what your best next step is.",
      "To start: what brings you here today?",
    ].join("\n\n"),
    ctas: [CAT_CTAS.about, CAT_CTAS.services],
    recommendation: {
      action: "continue_browsing",
      summary: "Begin discovery conversation",
      reason: "New session—prioritize understanding visitor context.",
    },
    matchedTopic: "consultant-greeting",
    stage: "understand",
    stageLabel: getStageLabel("understand"),
    followUpQuestion: "What industry are you in, and what are you hoping to accomplish?",
    session,
  };
}
