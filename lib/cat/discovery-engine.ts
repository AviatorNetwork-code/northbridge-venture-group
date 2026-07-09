import type { DiscoveryEngineResult, DiscoveryProfile } from "@/lib/cat/discovery-types";
import { getIndustryLabel, getNextIndustryQuestion, getIndustryQuestionsAnsweredCount } from "@/lib/cat/industry-questions";
import { buildRelationshipAcknowledgment } from "@/lib/nordi/relationship";
import {
  noticedLeadIn,
  pickAcknowledgment,
  pickIndustryAcknowledgment,
  pickReturningPrefix,
  softenTransition,
} from "@/lib/nordi/human-language";
import { extractWebsiteUrl } from "@/lib/cat/website-analysis";
import {
  buildMissingFieldPrompt,
  collectProfileText,
  diffProfileFields,
  getMissingDiscoveryFields,
  hasMinimumBusinessContext,
  logDiscoveryDecision,
  mergeProfile,
} from "@/lib/cat/discovery-profile-state";

function includesAny(text: string, terms: string[]): boolean {
  return terms.some((term) => text.includes(term));
}

function extractIndustry(text: string): string | undefined {
  const industries: Record<string, string[]> = {
    dental: ["dental", "dentist", "dental office", "dental clinic", "orthodont"],
    hvac: ["hvac", "heating and cooling", "heating", "air conditioning", "furnace"],
    aviation: ["flight school", "aviation", "pilot training", "flying school", "cfi"],
    healthcare: ["healthcare", "medical", "clinic", "hospital", "patient"],
    hospitality: ["restaurant", "restaurants", "hotel", "hospitality", "cafe", "bar"],
    retail: ["retail", "store", "shop", "ecommerce", "e-commerce"],
    "professional-services": [
      "law firm",
      "accounting",
      "consulting",
      "agency",
      "tax",
      "taxes",
      "cpa",
      "bookkeeping",
      "accountant",
      "tax preparer",
      "tax preparation",
    ],
    fitness: ["gym", "fitness", "studio", "yoga"],
    salon: ["salon", "spa", "beauty"],
  };

  for (const [industry, keywords] of Object.entries(industries)) {
    if (keywords.some((keyword) => text.includes(keyword))) return industry;
  }

  if (includesAny(text, ["business", "company", "firm", "practice", "shop", "store"])) {
    return "general";
  }

  return undefined;
}

function extractEmployeeCount(text: string): number | undefined {
  const match = text.match(/(\d+)\s*(employees|staff|people|team members|technicians|instructors|providers|workers)/i);
  if (match) return Number.parseInt(match[1], 10);

  const wordMatch = text.match(/\b(two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)\s+(restaurants|locations|offices|stores)/i);
  if (wordMatch) {
    const words: Record<string, number> = {
      two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12,
    };
    return words[wordMatch[1].toLowerCase()];
  }

  if (includesAny(text, ["just me", "solo", "one person", "only me"])) return 1;
  if (includesAny(text, ["small team", "few people"])) return 5;
  return undefined;
}

function extractLocationCount(text: string): number | undefined {
  const match = text.match(/(\d+)\s*(locations|restaurants|offices|stores|sites)/i);
  if (match) return Number.parseInt(match[1], 10);
  if (includesAny(text, ["two restaurants", "2 restaurants"])) return 2;
  return undefined;
}

function matchesWholeWord(text: string, words: string[]): boolean {
  return words.some((word) => new RegExp(`\\b${word}\\b`, "i").test(text));
}

function isAffirmative(text: string): boolean {
  return matchesWholeWord(text, ["yes", "yeah", "yep", "sure", "please", "ok", "okay", "absolutely"])
    || includesAny(text, ["go ahead"]);
}

function isNegative(text: string): boolean {
  return matchesWholeWord(text, ["no", "nope", "nah"])
    || includesAny(text, ["not now", "no website", "rather not", "skip"]);
}

function isSalesPressure(text: string): boolean {
  return includesAny(text, ["how much", "pricing", "price", "cost", "buy", "subscribe", "plan"]);
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

function hydrateProfileFromAccumulatedState(profile: DiscoveryProfile): DiscoveryProfile {
  const accumulatedText = collectProfileText(profile);
  if (!accumulatedText) return profile;

  let next = profile;

  if (!next.industry) {
    const industry = extractIndustry(accumulatedText);
    if (industry) next = mergeProfile(next, { industry });
  }

  if (next.employeeCount == null) {
    const employees = extractEmployeeCount(accumulatedText);
    if (employees) next = mergeProfile(next, { employeeCount: employees });
  }

  if (next.locationCount == null) {
    const locations = extractLocationCount(accumulatedText);
    if (locations) next = mergeProfile(next, { locationCount: locations });
  }

  return next;
}

function extractPassiveSignals(text: string, rawMessage: string, profile: DiscoveryProfile): DiscoveryProfile {
  let next = { ...profile };

  const industry = extractIndustry(text);
  const employees = extractEmployeeCount(text);
  const locations = extractLocationCount(text);

  if (industry) next = mergeProfile(next, { industry });
  if (employees) next = mergeProfile(next, { employeeCount: employees });
  if (locations) next = mergeProfile(next, { locationCount: locations });

  const channels = new Set(next.communicationChannels ?? []);
  if (includesAny(text, ["whatsapp"])) channels.add("WhatsApp");
  if (includesAny(text, ["phone", "call us", "by phone"])) channels.add("Phone");
  if (includesAny(text, ["text", "texts", "sms", "text message"])) channels.add("Text");
  if (includesAny(text, ["email", "gmail"])) channels.add("Email");
  if (includesAny(text, ["walk-in", "walk in"])) channels.add("Walk-ins");
  if (channels.size > 0) next = mergeProfile(next, { communicationChannels: Array.from(channels) });

  if (rawMessage.trim().length >= 8) {
    next = mergeProfile(next, { notes: [...(next.notes ?? []), rawMessage.trim()] });
  }

  return hydrateProfileFromAccumulatedState(next);
}

function acknowledgeIndustry(profile: DiscoveryProfile): string {
  const label = getIndustryLabel(profile.industry);
  return pickIndustryAcknowledgment(label, profile.userMessageCount ?? 0);
}

function shouldAskWebsitePermission(profile: DiscoveryProfile): boolean {
  if (profile.websitePermissionAsked || profile.website) return false;
  if (!hasMinimumBusinessContext(profile)) return false;

  const industryAnswered = getIndustryQuestionsAnsweredCount(profile);
  return industryAnswered >= 2 || getNextIndustryQuestion(profile) === null;
}

function websitePermissionPrompt(): string {
  return "Would you like me to take a quick look at your public website while we continue?";
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
  const seed = profile.userMessageCount ?? 0;

  return {
    thinkingContext: "preparing",
    progressiveReply: [
      noticedLeadIn(seed),
      "Based on what you've shared, a few areas stand out where extra operational support may matter.",
      [
        ...areas.map((area) => `• ${area.charAt(0).toUpperCase()}${area.slice(1)}`),
        "",
        "I'm not recommending products yet — just noting what I'm seeing.",
        "",
        "Tell me more about how your team handles these today.",
      ].join("\n"),
    ],
    reply: "",
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

function askNextQuestion(profile: DiscoveryProfile): DiscoveryEngineResult | null {
  const question = getNextIndustryQuestion(profile);
  if (!question) return null;

  const seed = profile.userMessageCount ?? 0;
  let prefix = `${pickAcknowledgment(seed)}\n\n`;

  if (profile.isReturningVisitor && profile.industry) {
    prefix = `${pickReturningPrefix(seed)}\n\n`;
  } else if (profile.userMessageCount === 1 && profile.industry) {
    prefix = `${acknowledgeIndustry(profile)}\n\n`;
  }

  const useProgressive = seed % 3 === 0 && question.prompt.length > 40;

  if (useProgressive) {
    return {
      thinkingContext: "analyzing-shared",
      progressiveReply: [softenTransition(seed), question.prompt],
      reply: "",
      profileUpdates: mergeProfile(profile, {
        pendingQuestionId: question.id,
        discoveryPhase: "learning",
      }),
    };
  }

  return {
    reply: `${prefix}${question.prompt}`,
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

function buildDiscoveryFallback(profile: DiscoveryProfile, messageCount: number): DiscoveryEngineResult | null {
  const missingFields = getMissingDiscoveryFields(profile);
  const missingFieldPrompt = buildMissingFieldPrompt(missingFields);

  if (!missingFieldPrompt) {
    return null;
  }

  return {
    thinkingContext: "analyzing-shared",
    reply: [pickAcknowledgment(messageCount), "", missingFieldPrompt].join("\n"),
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
  const extractedUrl = extractWebsiteUrl(rawMessage);

  if (nextProfile.pendingQuestionId) {
    nextProfile = recordAnswer(nextProfile, nextProfile.pendingQuestionId, rawMessage.trim());
  }

  nextProfile = extractPassiveSignals(text, rawMessage, nextProfile);

  const relationshipAck = buildRelationshipAcknowledgment(nextProfile, rawMessage);
  if (relationshipAck) {
    const nextQuestion = askNextQuestion(nextProfile);
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
    logTurnDecision(rawMessage, profileBeforeTurn, nextProfile, "sales-pressure-deflection");
    return {
      reply: [
        "I want to understand your business properly before we talk about solutions.",
        "",
        "Help me with one more operational detail — what part of the week feels most repetitive for your team?",
      ].join("\n"),
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

    const followUp = getNextIndustryQuestion(nextProfile);
    const continueLine = followUp
      ? `\n\nWhile that runs, ${followUp.prompt.charAt(0).toLowerCase()}${followUp.prompt.slice(1)}`
      : "\n\nWhile that runs, tell me more about how customers usually find you.";

    logTurnDecision(rawMessage, profileBeforeTurn, nextProfile, followUp?.id ?? null);
    return {
      reply: `Perfect — I'll review your public site while we keep talking.${continueLine}`,
      profileUpdates: mergeProfile(nextProfile, { pendingQuestionId: followUp?.id }),
      triggerWebsiteAnalysis: extractedUrl,
      showWebsiteAnalyzing: true,
    };
  }

  if (nextProfile.websitePermissionGranted && !nextProfile.website && isAffirmative(text)) {
    logTurnDecision(rawMessage, profileBeforeTurn, nextProfile, "awaiting-website-url");
    return {
      reply: "Great — paste your website URL whenever you're ready, and I'll review it while we keep talking.",
      profileUpdates: nextProfile,
    };
  }

  if (nextProfile.websitePermissionAsked && isNegative(text) && !extractedUrl) {
    nextProfile = mergeProfile(nextProfile, {
      websitePermissionGranted: false,
      discoveryPhase: "learning",
    });

    const nextQuestion = askNextQuestion(nextProfile);
    if (nextQuestion) {
      logTurnDecision(rawMessage, profileBeforeTurn, nextProfile, getNextIndustryQuestion(nextProfile)?.id ?? null);
      return nextQuestion;
    }

    logTurnDecision(rawMessage, profileBeforeTurn, nextProfile, "website-declined-follow-up");
    return {
      reply: [
        "No problem — we can keep learning from the conversation.",
        "",
        "What does a typical customer journey look like from first contact to completed service?",
      ].join("\n"),
      profileUpdates: nextProfile,
    };
  }

  if (shouldAskWebsitePermission(nextProfile) && !nextProfile.websitePermissionAsked) {
    nextProfile = mergeProfile(nextProfile, { websitePermissionAsked: true });
    const seed = nextProfile.userMessageCount ?? 0;
    logTurnDecision(rawMessage, profileBeforeTurn, nextProfile, "website-permission");
    return {
      thinkingContext: "reviewing-business",
      progressiveReply: [
        pickAcknowledgment(seed),
        websitePermissionPrompt(),
      ],
      reply: "",
      profileUpdates: nextProfile,
    };
  }

  if (nextProfile.websitePermissionAsked && !nextProfile.websitePermissionGranted && isAffirmative(text)) {
    nextProfile = mergeProfile(nextProfile, { websitePermissionGranted: true });
    logTurnDecision(rawMessage, profileBeforeTurn, nextProfile, "website-permission-granted");
    return {
      reply: "Great — paste your website URL whenever you're ready, and I'll review it while we keep talking.",
      profileUpdates: nextProfile,
    };
  }

  if (shouldOfferRecommendation(nextProfile)) {
    logTurnDecision(rawMessage, profileBeforeTurn, nextProfile, "recommendations");
    return buildRecommendationReply(nextProfile);
  }

  const nextQuestion = askNextQuestion(nextProfile);
  if (nextQuestion) {
    logTurnDecision(rawMessage, profileBeforeTurn, nextProfile, getNextIndustryQuestion(nextProfile)?.id ?? null);
    return nextQuestion;
  }

  const fallback = buildDiscoveryFallback(nextProfile, messageCount);
  if (fallback) {
    logTurnDecision(rawMessage, profileBeforeTurn, nextProfile, fallback.reply);
    return fallback;
  }

  logTurnDecision(rawMessage, profileBeforeTurn, nextProfile, "general-friction");
  return {
    thinkingContext: "reviewing-business",
    progressiveReply: [
      "I appreciate you walking me through that.",
      "What tends to create the most friction in a typical week — scheduling, follow-ups, staffing, or something else?",
    ],
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
