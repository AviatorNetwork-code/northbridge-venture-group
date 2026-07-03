import { determineStage, getStageLabel } from "./conversationStages";
import {
  captureConversationIntelligence,
  updateSessionScores,
} from "./conversationIntelligence";
import type {
  ConsultantSessionState,
  ProductRecommendation,
} from "./consultantTypes";
import { createInitialSessionState } from "./consultantTypes";
import {
  getNextDiscoveryQuestion,
  getRecommendationReason,
  getTeachingSnippet,
  updateDiscoveryProgress,
} from "./discoveryStrategy";
import {
  detectIntents,
  extractBuyingSignals,
  extractProfileSignals,
} from "./intentDetection";
import { scoreLeadQualification } from "./leadQualification";
import {
  detectObjection,
  formatObjectionMessage,
  type ObjectionType,
} from "./objectionHandling";
import { recommendProduct } from "./productRecommendationEngine";
import {
  canExposeRecommendation,
  selectConsultativeCtas,
} from "./softCloseSequencing";
import {
  buildReasoningExplanation,
  buildTrustStatement,
  reinforceExpertise,
} from "./trustFramework";
import { CAT_CTAS, KNOWLEDGE_TOPICS, type KnowledgeTopic } from "./websiteKnowledge";
import type {
  CatAnalyticsEventName,
  CatAssistantResponse,
  CatConversationContext,
} from "./websiteAssistantTypes";

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

function buildDiscoveryMessage(
  session: ConsultantSessionState,
  input: string,
): string {
  const question = getNextDiscoveryQuestion(session, input);
  if (question) {
    return question.question;
  }

  if (session.stage === "discover") {
    return "Tell me a bit about what you are trying to accomplish — I will ask a few questions before suggesting anything.";
  }

  return "What is the biggest challenge you are facing right now?";
}

function buildTeachMessage(session: ConsultantSessionState): string {
  const snippet = getTeachingSnippet(session.profile, session.sales.primaryChallenge);
  const trust = buildTrustStatement("teach", false);
  return [snippet, trust].join("\n\n");
}

function buildRecommendMessage(
  session: ConsultantSessionState,
  recommendation: ProductRecommendation,
  expose: boolean,
): string {
  if (!expose) {
    return buildTeachMessage(session);
  }

  if (recommendation.honestNoFit) {
    return [
      "Based on what you have shared, I am not seeing a strong product fit in our portfolio — and I would rather say that honestly than recommend something that will not help.",
      "A conversation with our team may still be useful to clarify options.",
    ].join(" ");
  }

  const reason = getRecommendationReason(
    session.sales.primaryChallenge,
    recommendation.productId,
  );

  return [
    `Based on what you have shared, ${recommendation.productName} is likely the best fit because ${reason}.`,
    buildReasoningExplanation(recommendation),
    buildTrustStatement("recommend", false),
  ].join("\n\n");
}

function buildCloseMessage(
  session: ConsultantSessionState,
  recommendation: ProductRecommendation,
): string {
  const parts = [
    "If you would like to explore this further, here are appropriate next steps — no pressure.",
  ];

  if (recommendation.productId !== "none" && !recommendation.honestNoFit) {
    parts.push(
      `A good path forward: review ${recommendation.productName}, then reach out for a brief consultation if you want to confirm scope.`,
    );
  } else {
    parts.push(
      "A brief consultation with Northbridge is the best way to clarify fit and timing.",
    );
  }

  if (session.leadQualification.isQualified) {
    parts.push("Based on our conversation, a conversation with our team could be worthwhile.");
  }

  return parts.join("\n\n");
}

function buildFollowUpMessage(): string {
  return "Happy to help you take the next step. You can reach our team through the contact page, or tell me what timing works for you.";
}

function trimToSentences(text: string, maxSentences: number): string {
  const sentences = text.match(/[^.!?]+[.!?]+/g) ?? [text];
  return sentences.slice(0, maxSentences).join(" ").trim();
}

function isInformationalQuery(input: string, topic: KnowledgeTopic | null): boolean {
  if (!topic) return false;
  const normalized = normalizeInput(input);
  return /what is|what are|tell me about|how does|explain|describe|who is/.test(normalized);
}

function buildInformationalMessage(
  session: ConsultantSessionState,
  input: string,
  topic: KnowledgeTopic,
): string {
  const parts = [trimToSentences(topic.message, 3), buildTrustStatement("teach", false)];
  const followUp = getNextDiscoveryQuestion(session, input);
  if (followUp && session.turnCount <= 2) {
    parts.push(`If you are evaluating fit for your situation: ${followUp.question}`);
  }
  return parts.join("\n\n");
}
function buildTrustDiscoveryMessage(
  session: ConsultantSessionState,
  input: string,
  topic: KnowledgeTopic | null,
): string {
  const parts: string[] = [
    "Thanks for sharing. I am here to understand your situation first — not to rush you toward a sale.",
  ];

  if (/trust|why should i|proof|credibility|different/.test(normalizeInput(input))) {
    parts.push(buildTrustStatement("teach", false));
    parts.push(reinforceExpertise(session.profile.industry));
  } else if (topic) {
    parts.push(trimToSentences(topic.message, 2));
  }

  const question = getNextDiscoveryQuestion(session, input);
  if (question) {
    parts.push(question.question);
  }

  return parts.join("\n\n");
}

function buildStageMessage(
  session: ConsultantSessionState,
  input: string,
  topic: KnowledgeTopic | null,
  recommendation: ProductRecommendation,
  exposeRecommendation: boolean,
  objectionMessage: string | null,
): string {
  if (objectionMessage) return objectionMessage;

  if (topic && isInformationalQuery(input, topic)) {
    return buildInformationalMessage(session, input, topic);
  }

  switch (session.stage) {
    case "discover":
    case "clarify":
      if (/trust|why should i|proof|credibility/.test(normalizeInput(input))) {
        return buildTrustDiscoveryMessage(session, input, topic);
      }
      return buildDiscoveryMessage(session, input);
    case "teach":
      return buildTeachMessage(session);
    case "recommend":
      return buildRecommendMessage(session, recommendation, exposeRecommendation);
    case "handle_objections":
      return objectionMessage ?? "What concerns can I address for you?";
    case "close_softly":
      return buildCloseMessage(session, recommendation);
    case "follow_up":
      return buildFollowUpMessage();
    default:
      return buildDiscoveryMessage(session, input);
  }
}

function collectSalesAnalyticsEvents(
  previous: ConsultantSessionState,
  current: ConsultantSessionState,
  exposeRecommendation: boolean,
  objectionDetected: boolean,
  objectionHandled: boolean,
): CatAnalyticsEventName[] {
  const events: CatAnalyticsEventName[] = [];

  if (!previous.sales.discoveryStarted && current.sales.discoveryStarted) {
    events.push("discovery_started");
  }
  if (
    current.stage === "clarify" &&
    current.sales.launchContext &&
    !current.sales.primaryChallenge
  ) {
    events.push("clarification_requested");
  }
  if (
    exposeRecommendation &&
    current.recommendedProductId &&
    !previous.sales.productFitDetected
  ) {
    events.push("product_fit_detected");
  }
  if (objectionDetected) {
    events.push("objection_detected");
  }
  if (objectionHandled && current.sales.objectionsHandled.length > previous.sales.objectionsHandled.length) {
    events.push("objection_handled");
  }
  if (current.stage === "close_softly" && !previous.sales.closeRecommended) {
    events.push("close_recommended");
  }
  if (current.leadQualification.isQualified && !previous.leadQualification.isQualified) {
    events.push("qualified_lead_detected");
  }

  return events;
}

export function runConsultantTurn(
  input: string,
  context?: CatConversationContext,
): CatAssistantResponse & {
  session: ConsultantSessionState;
  followUpQuestion?: string;
  productRecommendation?: ProductRecommendation;
  salesAnalyticsEvents?: CatAnalyticsEventName[];
} {
  const previousSession = context?.session ?? createInitialSessionState();
  const session: ConsultantSessionState = {
    ...previousSession,
    profile: { ...previousSession.profile },
    sales: { ...previousSession.sales, objectionsHandled: [...previousSession.sales.objectionsHandled] },
    leadQualification: { ...previousSession.leadQualification },
    scores: { ...previousSession.scores },
    intelligence: { ...previousSession.intelligence },
  };

  const previousScores = { ...session.scores };
  session.turnCount += 1;

  session.profile = extractProfileSignals(input, session.profile);
  const intents = detectIntents(input);
  const topic = findKnowledgeTopic(input);
  const buyingSignals = extractBuyingSignals(input);

  session.sales = updateDiscoveryProgress(session, input);

  const detectedObjection = detectObjection(input);
  if (detectedObjection) {
    session.sales.activeObjection = detectedObjection.type;
  } else if (session.stage === "handle_objections" && /ok|understand|makes sense|fair|thanks/.test(normalizeInput(input))) {
    if (session.sales.activeObjection) {
      session.sales.objectionsHandled.push(session.sales.activeObjection);
    }
    session.sales.activeObjection = undefined;
  }

  session.intelligence = captureConversationIntelligence(input, session, topic?.id);

  const recommendation = recommendProduct(session.profile, input);
  if (recommendation.productId !== "none" && recommendation.fitScore >= 0.45) {
    session.recommendedProductId = recommendation.productId;
  }

  if (/yes|sounds good|recommend|that works|let's do|agree|good fit/.test(normalizeInput(input))) {
    session.recommendationAccepted = true;
  }

  session.stage = determineStage(session);

  if (session.stage === "teach" || session.stage === "recommend") {
    session.sales.teachingComplete = true;
  }

  session.scores = updateSessionScores(
    session,
    session.profile,
    Boolean(session.recommendedProductId),
    buyingSignals.length,
  );

  session.leadQualification = scoreLeadQualification(session, input);

  if (session.leadQualification.isQualified) {
    session.sales.productFitDetected = Boolean(session.recommendedProductId);
  }
  if (session.stage === "close_softly") {
    session.sales.closeRecommended = true;
  }

  const exposeRecommendation = canExposeRecommendation(session);

  let objectionMessage: string | null = null;
  if (detectedObjection) {
    objectionMessage = formatObjectionMessage(detectedObjection);
  } else if (session.stage === "handle_objections" && session.sales.activeObjection) {
    objectionMessage = formatObjectionMessage({
      type: session.sales.activeObjection as ObjectionType,
      phrase: session.sales.activeObjection,
    });
  }

  const message = buildStageMessage(
    session,
    input,
    topic,
    recommendation,
    exposeRecommendation,
    objectionMessage,
  );

  const followUpQuestion = getNextDiscoveryQuestion(session, input)?.question;
  const ctas = selectConsultativeCtas(
    session.stage,
    session,
    exposeRecommendation ? recommendation : undefined,
  );

  const objectionHandled =
    Boolean(detectedObjection) &&
    session.sales.objectionsHandled.length > previousSession.sales.objectionsHandled.length;

  const salesAnalyticsEvents = collectSalesAnalyticsEvents(
    previousSession,
    session,
    exposeRecommendation,
    Boolean(detectedObjection),
    objectionHandled,
  );

  const primaryIntent = intents[0]?.intent ?? topic?.id ?? "general";

  return {
    message,
    ctas,
    recommendation: exposeRecommendation && session.recommendedProductId
      ? {
          action:
            session.stage === "close_softly" || session.stage === "follow_up"
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
    followUpQuestion:
      session.stage === "discover" || session.stage === "clarify"
        ? followUpQuestion
        : undefined,
    productRecommendation:
      exposeRecommendation && recommendation.productId !== "none"
        ? recommendation
        : undefined,
    session,
    sessionScoreDelta: {
      before: previousScores,
      after: session.scores,
    },
    qualifiedLead: session.leadQualification.isQualified,
    primaryIntent,
    salesAnalyticsEvents,
  };
}

export function getConsultantGreeting(): CatAssistantResponse & {
  session: ConsultantSessionState;
  followUpQuestion?: string;
} {
  const session = createInitialSessionState();

  return {
    message: [
      "Hello — I am your Northbridge digital solutions consultant.",
      "My goal is not to pitch products immediately. I will discover your situation, clarify priorities, share relevant context, and only then recommend what genuinely fits.",
      "What brings you here today?",
    ].join("\n\n"),
    ctas: [CAT_CTAS.about],
    recommendation: {
      action: "continue_browsing",
      summary: "Begin discovery conversation",
      reason: "New session — prioritize understanding visitor context.",
    },
    matchedTopic: "consultant-greeting",
    stage: "discover",
    stageLabel: getStageLabel("discover"),
    followUpQuestion: "What industry are you in, and what prompted you to explore Northbridge today?",
    session,
  };
}
