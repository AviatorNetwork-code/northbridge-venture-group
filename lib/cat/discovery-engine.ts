import type { DiscoveryEngineResult, DiscoveryProfile } from "@/lib/cat/discovery-types";
import { getNextIndustryQuestion, getIndustryQuestionsAnsweredCount } from "@/lib/cat/industry-questions";
import { discoveryTurnWantsQuestion } from "@/lib/cat/platform-turn-policy";
import { buildRelationshipAcknowledgment } from "@/lib/nordi/relationship";
import {
  buildConsultantIndustryOpening,
  buildConsultantQuestionTurn,
  buildConsultantRecommendationReply,
  buildConsultantWebsitePermissionLead,
  buildConsultantWebsiteUrlAck,
  getConsultantVoice,
} from "@/lib/nordi/consultant-voice";
import { detectAndPersistLanguage } from "@/lib/nordi/language/detect-language";
import { extractBusinessSignals } from "@/lib/nordi/entity-extraction";
import type { NordiLanguage } from "@/lib/nordi/language/types";
import {
  buildLocalizedMissingFieldPrompt,
  getLocalizedQuestionPrompt,
} from "@/lib/nordi/localized-content";
import {
  resolvePendingQuestionPrompt,
  tryConversationInterruption,
} from "@/lib/cat/interruption-bridge";
import { extractWebsiteUrl } from "@/lib/cat/website-analysis";
import {
  collectProfileText,
  diffProfileFields,
  getMissingDiscoveryFields,
  hasMinimumBusinessContext,
  logDiscoveryDecision,
  mergeProfile,
} from "@/lib/cat/discovery-profile-state";

function getLanguage(profile: DiscoveryProfile): NordiLanguage {
  return profile.preferredLanguage ?? "en";
}

function includesAny(text: string, terms: string[]): boolean {
  return terms.some((term) => text.includes(term));
}

function matchesWholeWord(text: string, words: string[]): boolean {
  return words.some((word) => new RegExp(`\\b${word}\\b`, "i").test(text));
}

function recordAnswer(profile: DiscoveryProfile, questionId: string, answer: string): DiscoveryProfile {
  const answered = new Set(profile.answeredQuestions ?? []);
  answered.add(questionId);

  return mergeProfile(profile, {
    answeredQuestions: Array.from(answered),
    discoveryAnswers: { [questionId]: answer },
    pendingQuestionId: undefined,
  });
}

function isAffirmative(text: string): boolean {
  return matchesWholeWord(text, ["yes", "yeah", "yep", "sure", "please", "ok", "okay", "absolutely", "sí", "si", "claro", "vale", "por supuesto"])
    || includesAny(text, ["go ahead", "de acuerdo"]);
}

function isNegative(text: string): boolean {
  return matchesWholeWord(text, ["no", "nope", "nah"])
    || includesAny(text, ["not now", "no website", "rather not", "skip", "ahora no", "mejor no", "sin sitio"]);
}

function isSalesPressure(text: string): boolean {
  return includesAny(text, ["how much", "pricing", "price", "cost", "buy", "subscribe", "plan", "cuánto", "cuanto", "precio", "costo", "comprar"]);
}

function extractPassiveSignals(text: string, rawMessage: string, profile: DiscoveryProfile): DiscoveryProfile {
  return applyExtractedSignals(profile, text, rawMessage);
}

function applyExtractedSignals(
  profile: DiscoveryProfile,
  text: string,
  rawMessage: string,
): DiscoveryProfile {
  const signals = extractBusinessSignals(rawMessage);
  let next = profile;

  if (signals.industry) next = mergeProfile(next, { industry: signals.industry });
  if (signals.employeeCount != null) next = mergeProfile(next, { employeeCount: signals.employeeCount });
  if (signals.locationCount != null) next = mergeProfile(next, { locationCount: signals.locationCount });

  if (signals.communicationChannels?.length) {
    const channels = new Set([...(next.communicationChannels ?? []), ...signals.communicationChannels]);
    next = mergeProfile(next, { communicationChannels: Array.from(channels) });
  }

  if (rawMessage.trim().length >= 8) {
    next = mergeProfile(next, { notes: [...(next.notes ?? []), rawMessage.trim()] });
  }

  return hydrateProfileFromAccumulatedState(next);
}

function hydrateProfileFromAccumulatedState(profile: DiscoveryProfile): DiscoveryProfile {
  const accumulatedText = collectProfileText(profile);
  if (!accumulatedText) return profile;

  let next = profile;
  const signals = extractBusinessSignals(accumulatedText);

  if (!next.industry && signals.industry) {
    next = mergeProfile(next, { industry: signals.industry });
  }

  if (next.employeeCount == null && signals.employeeCount != null) {
    next = mergeProfile(next, { employeeCount: signals.employeeCount });
  }

  if (next.locationCount == null && signals.locationCount != null) {
    next = mergeProfile(next, { locationCount: signals.locationCount });
  }

  if (signals.communicationChannels?.length) {
    const channels = new Set([...(next.communicationChannels ?? []), ...signals.communicationChannels]);
    next = mergeProfile(next, { communicationChannels: Array.from(channels) });
  }

  return next;
}

function acknowledgeIndustry(profile: DiscoveryProfile): string {
  return buildConsultantIndustryOpening(profile, profile.industry, profile.userMessageCount ?? 0);
}

type DiscoveryTurnContext = {
  userMessage: string;
  answeredQuestionId?: string;
};

function shouldAskWebsitePermission(profile: DiscoveryProfile): boolean {
  if (profile.websitePermissionAsked || profile.website) return false;
  if (!hasMinimumBusinessContext(profile)) return false;

  const industryAnswered = getIndustryQuestionsAnsweredCount(profile);
  return industryAnswered >= 2 || getNextIndustryQuestion(profile) === null;
}

function websitePermissionPrompt(profile: DiscoveryProfile): string {
  return getConsultantVoice(getLanguage(profile)).copy.websitePermissionPrompt;
}

function buildSupportAreas(profile: DiscoveryProfile): string[] {
  const areas: string[] = [];

  if (profile.discoveryAnswers?.["dental-reminders"]?.toLowerCase().includes("no")) {
    areas.push("appointment reminder follow-through");
  }
  if (profile.discoveryAnswers?.["hvac-emergency"]?.toLowerCase().includes("yes")) {
    areas.push("after-hours and emergency dispatch coordination");
  }
  if (profile.discoveryAnswers?.["aviation-online-booking"]?.toLowerCase().includes("no")) {
    areas.push("student scheduling visibility");
  }
  if (profile.websiteAnalysis && !profile.websiteAnalysis.hasAppointmentSystem) {
    areas.push("making scheduling clearer for new customers");
  }
  if (profile.websiteAnalysis?.signals.some((signal) => signal.id === "reminder-gap")) {
    areas.push("automated appointment reminders");
  }
  if ((profile.communicationChannels?.length ?? 0) > 2) {
    areas.push("keeping customer messages organized across channels");
  }

  if (areas.length === 0 && profile.industry) {
    areas.push("operational follow-through", "customer communication consistency");
  }

  return Array.from(new Set(areas)).slice(0, 3);
}

function buildRecommendationReply(profile: DiscoveryProfile): DiscoveryEngineResult {
  const areas = buildSupportAreas(profile);
  const presentation = buildConsultantRecommendationReply(profile, areas);

  return {
    thinkingContext: "preparing",
    progressiveReply: presentation.progressiveReply,
    reply: presentation.reply,
    profileUpdates: mergeProfile(profile, {
      discoveryPhase: "recommendations",
      areasForSupport: areas,
    }),
  };
}

function shouldOfferRecommendation(profile: DiscoveryProfile): boolean {
  return (
    profile.discoveryPhase !== "recommendations" &&
    (profile.answeredQuestions?.length ?? 0) >= 3 &&
    Boolean(profile.websiteAnalysis || profile.websitePermissionAsked)
  );
}

function askNextQuestion(
  profile: DiscoveryProfile,
  turnContext?: DiscoveryTurnContext,
): DiscoveryEngineResult | null {
  if (!discoveryTurnWantsQuestion(profile)) return null;

  const question = getNextIndustryQuestion(profile);
  if (!question) return null;

  const language = getLanguage(profile);
  const localizedPrompt = getLocalizedQuestionPrompt(question.id, language, question.prompt);
  const seed = profile.userMessageCount ?? 0;
  const presentation = buildConsultantQuestionTurn({
    profile,
    userMessage: turnContext?.userMessage ?? "",
    answeredQuestionId: turnContext?.answeredQuestionId,
    nextQuestionId: question.id,
    nextQuestionPrompt: localizedPrompt,
  });

  let progressiveReply = presentation.progressiveReply;
  let reply = presentation.reply;

  if (profile.userMessageCount === 1 && profile.industry && !turnContext?.answeredQuestionId) {
    const opening = acknowledgeIndustry(profile);
    progressiveReply = progressiveReply
      ? [opening, ...progressiveReply]
      : [opening, reply];
    reply = "";
  }

  const useProgressive =
    Boolean(progressiveReply?.length) || (seed % 4 === 0 && localizedPrompt.length > 40);

  if (useProgressive && progressiveReply?.length) {
    return {
      thinkingContext: "analyzing-shared",
      progressiveReply,
      reply: "",
      profileUpdates: mergeProfile(profile, {
        pendingQuestionId: question.id,
        discoveryPhase: "learning",
      }),
    };
  }

  return {
    reply: reply || localizedPrompt,
    profileUpdates: mergeProfile(profile, {
      pendingQuestionId: question.id,
      discoveryPhase: "learning",
    }),
  };
}

function logTurnDecision(
  rawMessage: string,
  profileBeforeTurn: DiscoveryProfile,
  nextProfile: DiscoveryProfile,
  nextSelectedQuestion: string | null,
): void {
  logDiscoveryDecision({
    message: rawMessage,
    extractedFields: diffProfileFields(profileBeforeTurn, nextProfile),
    accumulatedProfile: nextProfile,
    missingFields: getMissingDiscoveryFields(nextProfile),
    nextSelectedQuestion,
  });
}

function buildDiscoveryFallback(profile: DiscoveryProfile): DiscoveryEngineResult | null {
  const missingFields = getMissingDiscoveryFields(profile);
  const missingFieldPrompt = buildLocalizedMissingFieldPrompt(missingFields, getLanguage(profile));

  if (!missingFieldPrompt) {
    return null;
  }

  return {
    thinkingContext: "analyzing-shared",
    reply: missingFieldPrompt,
    profileUpdates: profile,
  };
}

export function processDiscoveryMessage(
  rawMessage: string,
  profile: DiscoveryProfile,
): DiscoveryEngineResult {
  const text = rawMessage.trim().toLowerCase();
  const messageCount = (profile.userMessageCount ?? 0) + 1;
  const profileBeforeTurn = profile;
  let nextProfile = mergeProfile(profile, { userMessageCount: messageCount });

  if (!nextProfile.preferredLanguage && rawMessage.trim().length >= 8) {
    nextProfile = mergeProfile(nextProfile, {
      preferredLanguage: detectAndPersistLanguage(nextProfile, rawMessage),
    });
  }

  const extractedUrl = extractWebsiteUrl(rawMessage);
  const pendingQuestionId = nextProfile.pendingQuestionId;

  if (pendingQuestionId) {
    const interruption = tryConversationInterruption({
      message: rawMessage,
      pendingQuestionId,
      pendingQuestionPrompt: resolvePendingQuestionPrompt(pendingQuestionId, getLanguage(nextProfile)),
      language: getLanguage(nextProfile),
      answeredQuestions: nextProfile.answeredQuestions,
    });

    if (interruption) {
      logTurnDecision(rawMessage, profileBeforeTurn, profile, `interruption:${interruption.detection.type}`);
      const progressiveReply = interruption.resumeLine
        ? [interruption.answer, interruption.resumeLine]
        : [interruption.answer];

      return {
        thinkingContext: "general",
        reply: "",
        progressiveReply,
        profileUpdates: mergeProfile(nextProfile, {
          pendingQuestionId,
        }),
        humanAssistanceRequested: interruption.humanAssistanceRequested,
      };
    }
  }

  const answeredQuestionId = pendingQuestionId;

  if (answeredQuestionId) {
    nextProfile = recordAnswer(nextProfile, answeredQuestionId, rawMessage.trim());
  }

  nextProfile = extractPassiveSignals(text, rawMessage, nextProfile);
  const turnContext: DiscoveryTurnContext = {
    userMessage: rawMessage.trim(),
    answeredQuestionId,
  };

  const relationshipAck = buildRelationshipAcknowledgment(nextProfile, rawMessage);
  if (relationshipAck) {
    const nextQuestion = askNextQuestion(nextProfile, turnContext);
    if (nextQuestion) {
      logTurnDecision(rawMessage, profileBeforeTurn, nextProfile, getNextIndustryQuestion(nextProfile)?.id ?? null);
      return {
        reply: `${relationshipAck}\n\n${nextQuestion.reply}`,
        profileUpdates: nextQuestion.profileUpdates,
      };
    }
    logTurnDecision(rawMessage, profileBeforeTurn, nextProfile, null);
    return {
      reply: relationshipAck,
      profileUpdates: nextProfile,
    };
  }

  if (nextProfile.discoveryPhase !== "recommendations" && isSalesPressure(text)) {
    const voice = getConsultantVoice(getLanguage(nextProfile));
    logTurnDecision(rawMessage, profileBeforeTurn, nextProfile, "sales-pressure-deflection");
    return {
      reply: voice.copy.salesPressureDeflection.join("\n"),
      profileUpdates: nextProfile,
    };
  }

  if (extractedUrl && (nextProfile.websitePermissionGranted || nextProfile.websitePermissionAsked)) {
    nextProfile = mergeProfile(nextProfile, {
      website: extractedUrl,
      websitePermissionGranted: true,
      websiteAnalysisPending: true,
      discoveryPhase: "website_analyzing",
    });

    const language = getLanguage(nextProfile);
    const voice = getConsultantVoice(language);
    const followUp = getNextIndustryQuestion(nextProfile);
    const followUpPrompt = followUp
      ? getLocalizedQuestionPrompt(followUp.id, language, followUp.prompt)
      : null;
    const continueLine = followUpPrompt
      ? `\n\n${voice.copy.whileThatRunsPrefix} ${followUpPrompt.charAt(0).toLowerCase()}${followUpPrompt.slice(1)}`
      : `\n\n${voice.copy.whileThatRunsPrefix} ${voice.copy.customerFindYouFallback}`;

    logTurnDecision(rawMessage, profileBeforeTurn, nextProfile, followUp?.id ?? null);
    return {
      reply: buildConsultantWebsiteUrlAck(nextProfile, continueLine),
      profileUpdates: mergeProfile(nextProfile, { pendingQuestionId: followUp?.id }),
      triggerWebsiteAnalysis: extractedUrl,
      showWebsiteAnalyzing: true,
    };
  }

  if (nextProfile.websitePermissionGranted && !nextProfile.website && isAffirmative(text)) {
    const voice = getConsultantVoice(getLanguage(nextProfile));
    logTurnDecision(rawMessage, profileBeforeTurn, nextProfile, "awaiting-website-url");
    return {
      reply: voice.copy.websiteUrlReady,
      profileUpdates: nextProfile,
    };
  }

  if (nextProfile.websitePermissionAsked && isNegative(text) && !extractedUrl) {
    nextProfile = mergeProfile(nextProfile, {
      websitePermissionGranted: false,
      discoveryPhase: "learning",
    });

    const nextQuestion = askNextQuestion(nextProfile, turnContext);
    if (nextQuestion) {
      logTurnDecision(rawMessage, profileBeforeTurn, nextProfile, getNextIndustryQuestion(nextProfile)?.id ?? null);
      return nextQuestion;
    }

    logTurnDecision(rawMessage, profileBeforeTurn, nextProfile, "website-declined-follow-up");
    const voice = getConsultantVoice(getLanguage(nextProfile));
    return {
      reply: [voice.copy.websiteDeclinedLead, "", voice.copy.websiteDeclinedFollowUp].join("\n"),
      profileUpdates: nextProfile,
    };
  }

  if (shouldAskWebsitePermission(nextProfile) && !nextProfile.websitePermissionAsked) {
    nextProfile = mergeProfile(nextProfile, { websitePermissionAsked: true });
    logTurnDecision(rawMessage, profileBeforeTurn, nextProfile, "website-permission");
    return {
      thinkingContext: "reviewing-business",
      progressiveReply: [
        buildConsultantWebsitePermissionLead(nextProfile),
        websitePermissionPrompt(nextProfile),
      ],
      reply: "",
      profileUpdates: nextProfile,
    };
  }

  if (nextProfile.websitePermissionAsked && !nextProfile.websitePermissionGranted && isAffirmative(text)) {
    nextProfile = mergeProfile(nextProfile, { websitePermissionGranted: true });
    const voice = getConsultantVoice(getLanguage(nextProfile));
    logTurnDecision(rawMessage, profileBeforeTurn, nextProfile, "website-permission-granted");
    return {
      reply: voice.copy.websiteUrlReady,
      profileUpdates: nextProfile,
    };
  }

  if (shouldOfferRecommendation(nextProfile)) {
    logTurnDecision(rawMessage, profileBeforeTurn, nextProfile, "recommendations");
    return buildRecommendationReply(nextProfile);
  }

  const nextQuestion = askNextQuestion(nextProfile, turnContext);
  if (nextQuestion) {
    logTurnDecision(rawMessage, profileBeforeTurn, nextProfile, getNextIndustryQuestion(nextProfile)?.id ?? null);
    return nextQuestion;
  }

  const fallback = buildDiscoveryFallback(nextProfile);
  if (fallback) {
    logTurnDecision(rawMessage, profileBeforeTurn, nextProfile, fallback.reply);
    return fallback;
  }

  logTurnDecision(rawMessage, profileBeforeTurn, nextProfile, "general-friction");
  const voice = getConsultantVoice(getLanguage(nextProfile));
  return {
    thinkingContext: "reviewing-business",
    progressiveReply: [voice.copy.generalFrictionLead, voice.copy.generalFrictionQuestion],
    reply: "",
    profileUpdates: nextProfile,
  };
}

export function applyWebsiteInsight(
  profile: DiscoveryProfile,
  insight: string,
): DiscoveryEngineResult {
  return {
    reply: insight,
    profileUpdates: mergeProfile(profile, {
      insightDelivered: true,
      discoveryPhase: "insight_delivered",
      websiteAnalysisPending: false,
      pendingInsight: undefined,
    }),
    deliverPendingInsight: true,
  };
}

export { mergeProfile } from "@/lib/cat/discovery-profile-state";
