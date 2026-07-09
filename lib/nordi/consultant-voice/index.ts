import type { DiscoveryProfile } from "@/lib/cat/discovery-types";
import type { WebsiteAnalysisResult } from "@/lib/cat/discovery-types";
import { getLocalizedIndustryLabel } from "@/lib/nordi/localized-content";
import {
  decideConsultantCadence,
  isSoloOperatorProfile,
  shouldIncludeCadenceContent,
  shouldShowTrustSummary,
} from "@/lib/nordi/consultant-voice/consultant-cadence";
import { ENGLISH_COPY } from "@/lib/nordi/consultant-voice/english";
import { SPANISH_COPY } from "@/lib/nordi/consultant-voice/spanish";
import type {
  ConsultantTurnInput,
  ConsultantTurnOutput,
  ConsultantVoice,
  ConsultantVoiceCopy,
} from "@/lib/nordi/consultant-voice/types";
import type { NordiLanguage } from "@/lib/nordi/language/types";

function includesAny(text: string, terms: string[]): boolean {
  return terms.some((term) => text.includes(term));
}

function collectContextText(profile: DiscoveryProfile): string {
  return [
    ...(profile.notes ?? []),
    ...Object.values(profile.discoveryAnswers ?? {}),
  ]
    .join(" ")
    .toLowerCase();
}

function buildAnswerReasoning(
  copy: ConsultantVoiceCopy,
  language: NordiLanguage,
  input: ConsultantTurnInput,
): string | null {
  const text = input.userMessage.toLowerCase();
  const { answeredQuestionId, profile } = input;

  if (answeredQuestionId === "general-team-size") {
    if (profile.employeeCount === 1 && isSoloOperatorProfile(profile, input.userMessage)) {
      return copy.soloOperatorReasoning;
    }
    if (
      profile.employeeCount != null &&
      profile.employeeCount > 1 &&
      profile.employeeCount <= 8
    ) {
      return copy.smallTeamReasoning;
    }
    return null;
  }

  if (answeredQuestionId === "general-customer-contact") {
    const channelCount = profile.communicationChannels?.length ?? 0;
    if (channelCount > 1) {
      return copy.multiChannelReasoning;
    }
    if (text.length > 24) {
      return copy.singleChannelReasoning;
    }
    return null;
  }

  if (answeredQuestionId === "general-friction" && text.length > 30) {
    return copy.frictionReasoning;
  }

  if (
    includesAny(text, [
      "referral",
      "referrals",
      "word of mouth",
      "word-of-mouth",
      "referido",
      "referidos",
      "recomendación",
      "recomendaciones",
      "boca a boca",
    ])
  ) {
    return copy.referralReasoning;
  }

  const seed = profile.userMessageCount ?? 0;
  if (seed % 8 === 0 && profile.industry && text.length > 40) {
    const label = getLocalizedIndustryLabel(profile.industry, language);
    return copy.industryDetailReasoning(label);
  }

  return null;
}

function buildFactConnection(
  copy: ConsultantVoiceCopy,
  input: ConsultantTurnInput,
): string | null {
  const context = collectContextText(input.profile);
  const { nextQuestionId, profile } = input;

  const mentionsReferrals = includesAny(context, [
    "referral",
    "referrals",
    "word of mouth",
    "referido",
    "referidos",
    "recomendación",
    "recomendaciones",
    "boca a boca",
  ]);
  const mentionsScheduling = includesAny(context, [
    "schedul",
    "appointment",
    "cancel",
    "book",
    "calendar",
    "agenda",
    "cita",
    "cancelación",
  ]);

  if (
    mentionsReferrals &&
    (nextQuestionId.includes("booking") ||
      nextQuestionId.includes("scheduling") ||
      mentionsScheduling)
  ) {
    return copy.referralConnection[0];
  }

  if (mentionsScheduling && nextQuestionId === "general-customer-contact") {
    return copy.schedulingContactConnection;
  }

  if (profile.employeeCount === 1 && nextQuestionId === "general-friction") {
    return copy.soloFrictionConnection;
  }

  return null;
}

function buildQuestionReason(copy: ConsultantVoiceCopy, input: ConsultantTurnInput): string | null {
  const reason = copy.questionReasons[input.nextQuestionId];
  if (!reason) return null;
  return reason;
}

function buildTrustSummary(
  copy: ConsultantVoiceCopy,
  language: NordiLanguage,
  profile: DiscoveryProfile,
): string | null {
  if (!shouldShowTrustSummary(profile)) return null;

  const parts: string[] = [];

  if (profile.industry) {
    parts.push(getLocalizedIndustryLabel(profile.industry, language).toLowerCase());
  }

  if (profile.employeeCount === 1) {
    parts.push(copy.soloOperatorLabel.toLowerCase());
  } else if (profile.employeeCount) {
    parts.push(`about ${profile.employeeCount} people day to day`);
  }

  const friction = profile.discoveryAnswers?.["general-friction"];
  const channels = profile.communicationChannels?.join(", ");

  if (friction && channels) {
    return copy.trustSummaryProse(parts[0] ?? "your business", friction, channels);
  }

  if (parts.length < 2) return null;

  return copy.trustSummaryBulleted(parts, channels, friction);
}

function createConsultantQuestionTurn(
  copy: ConsultantVoiceCopy,
  language: NordiLanguage,
  input: ConsultantTurnInput,
): ConsultantTurnOutput {
  const cadenceMode = decideConsultantCadence(input);
  const segments: string[] = [];

  if (shouldIncludeCadenceContent(cadenceMode, "trust_summary", input)) {
    const summary = buildTrustSummary(copy, language, input.profile);
    if (summary) segments.push(summary);
  }

  const reasoning = buildAnswerReasoning(copy, language, input);
  if (reasoning && shouldIncludeCadenceContent(cadenceMode, "answer_reasoning", input)) {
    segments.push(reasoning);
  }

  const connection = buildFactConnection(copy, input);
  if (connection && shouldIncludeCadenceContent(cadenceMode, "fact_connection", input)) {
    segments.push(connection);
  }

  const questionReason = buildQuestionReason(copy, input);
  if (questionReason && shouldIncludeCadenceContent(cadenceMode, "question_reason", input)) {
    segments.push(questionReason);
  }

  const question = input.nextQuestionPrompt;

  if (segments.length === 0) {
    return { reply: question };
  }

  if (segments.length >= 2 || segments.join("\n\n").length > 140) {
    return {
      reply: "",
      progressiveReply: [...segments, question],
    };
  }

  return {
    reply: [...segments, question].join("\n\n"),
  };
}

function createConsultantRecommendationReply(
  copy: ConsultantVoiceCopy,
  language: NordiLanguage,
  profile: DiscoveryProfile,
  areas: string[],
): ConsultantTurnOutput {
  const seed = profile.userMessageCount ?? 0;
  const lead = copy.recommendationLeads[Math.abs(seed) % copy.recommendationLeads.length];

  const localizedAreas =
    language === "es"
      ? areas.map((area) => {
          const map: Record<string, string> = {
            "appointment reminder follow-through": "seguimiento de recordatorios de citas",
            "after-hours and emergency dispatch coordination":
              "coordinación de emergencias fuera de horario",
            "student scheduling visibility": "visibilidad de la agenda de estudiantes",
            "making scheduling clearer for new customers":
              "hacer la agenda más clara para clientes nuevos",
            "automated appointment reminders": "recordatorios automáticos de citas",
            "keeping customer messages organized across channels":
              "organizar mensajes de clientes entre canales",
            "operational follow-through": "seguimiento operativo",
            "customer communication consistency": "consistencia en la comunicación con clientes",
          };
          return map[area] ?? area;
        })
      : areas;

  return {
    reply: "",
    progressiveReply: [
      lead,
      [
        ...localizedAreas.map((area) => `• ${area.charAt(0).toUpperCase()}${area.slice(1)}`),
        "",
        copy.recommendationFooter,
      ].join("\n"),
    ],
  };
}

function createConsultantWebsitePermissionLead(
  copy: ConsultantVoiceCopy,
  profile: DiscoveryProfile,
): string {
  const seed = profile.userMessageCount ?? 0;
  return copy.websitePermissionLeads[Math.abs(seed) % copy.websitePermissionLeads.length];
}

function createConsultantWebsiteUrlAck(copy: ConsultantVoiceCopy, continueLine: string): string {
  return `${copy.websiteUrlAckPrefix}${continueLine}`;
}

function createWebsiteInsightNarrative(
  copy: ConsultantVoiceCopy,
  analysis: WebsiteAnalysisResult,
  profile: DiscoveryProfile,
): string[] {
  const paragraphs: string[] = [copy.websiteFinishedReview];
  const observations: string[] = [];

  if (!analysis.hasAppointmentSystem && !analysis.hasBookingFlow) {
    observations.push(copy.noOnlineBooking);
  }
  if (!analysis.hasContactForm) {
    observations.push(copy.noContactForm);
  }
  if (analysis.hasEmergencyMessaging && profile.industry === "hvac") {
    observations.push(copy.hvacEmergencyObs);
  }

  if (observations.length > 0) {
    const joined =
      observations.length === 1
        ? observations[0]
        : `${observations.slice(0, -1).join(", ")}, and ${observations[observations.length - 1]}`;
    const prefix = copy.websiteFinishedReview.includes("Terminé")
      ? "Una cosa que noté: "
      : "One thing I noticed: ";
    paragraphs.push(`${prefix}${joined}.`);
  }

  const context = collectContextText(profile);
  if (
    includesAny(context, ["schedul", "appointment", "cancel", "book", "agenda", "cita"]) &&
    !analysis.hasAppointmentSystem
  ) {
    paragraphs.push(copy.schedulingAlignment);
  }

  return paragraphs;
}

function createConsultantIndustryOpening(
  copy: ConsultantVoiceCopy,
  language: NordiLanguage,
  industry: string | undefined,
  seed: number,
): string {
  const label = getLocalizedIndustryLabel(industry, language);
  const options =
    language === "es"
      ? [
          `Un negocio de ${label.toLowerCase()} — eso me da un buen punto de partida.`,
          `${label} — ese contexto me ayuda a hacer mejores preguntas.`,
        ]
      : [
          `A ${label.toLowerCase()} business — that gives me a useful starting point.`,
          `${label} — that context helps me ask better questions.`,
        ];
  return options[Math.abs(seed) % options.length];
}

const VOICES: Record<NordiLanguage, ConsultantVoiceCopy> = {
  en: ENGLISH_COPY,
  es: SPANISH_COPY,
};

export function getConsultantVoice(language: NordiLanguage = "en"): ConsultantVoice {
  const copy = VOICES[language] ?? ENGLISH_COPY;

  return {
    language,
    copy,
    buildConsultantQuestionTurn: (input) => createConsultantQuestionTurn(copy, language, input),
    buildConsultantRecommendationReply: (profile, areas) =>
      createConsultantRecommendationReply(copy, language, profile, areas),
    buildConsultantWebsitePermissionLead: (profile) =>
      createConsultantWebsitePermissionLead(copy, profile),
    buildConsultantWebsiteUrlAck: (continueLine) => createConsultantWebsiteUrlAck(copy, continueLine),
    buildWebsiteInsightNarrative: (analysis, profile) =>
      createWebsiteInsightNarrative(copy, analysis, profile),
    getIndustryLabel: (industry) => getLocalizedIndustryLabel(industry, language),
  };
}

export function buildConsultantQuestionTurn(input: ConsultantTurnInput): ConsultantTurnOutput {
  const language = input.profile.preferredLanguage ?? "en";
  return getConsultantVoice(language).buildConsultantQuestionTurn(input);
}

export function buildConsultantRecommendationReply(
  profile: DiscoveryProfile,
  areas: string[],
): ConsultantTurnOutput {
  const language = profile.preferredLanguage ?? "en";
  return getConsultantVoice(language).buildConsultantRecommendationReply(profile, areas);
}

export function buildConsultantWebsitePermissionLead(profile: DiscoveryProfile): string {
  const language = profile.preferredLanguage ?? "en";
  return getConsultantVoice(language).buildConsultantWebsitePermissionLead(profile);
}

export function buildConsultantWebsiteUrlAck(profile: DiscoveryProfile, continueLine: string): string {
  const language = profile.preferredLanguage ?? "en";
  return getConsultantVoice(language).buildConsultantWebsiteUrlAck(continueLine);
}

export function buildWebsiteInsightNarrative(
  analysis: WebsiteAnalysisResult,
  profile: DiscoveryProfile,
): string[] {
  const language = profile.preferredLanguage ?? "en";
  return getConsultantVoice(language).buildWebsiteInsightNarrative(analysis, profile);
}

export function buildConsultantIndustryOpening(
  profile: DiscoveryProfile,
  industry: string | undefined,
  seed: number,
): string {
  const language = profile.preferredLanguage ?? "en";
  const copy = VOICES[language] ?? ENGLISH_COPY;
  return createConsultantIndustryOpening(copy, language, industry, seed);
}

export type { ConsultantTurnInput, ConsultantTurnOutput } from "@/lib/nordi/consultant-voice/types";
