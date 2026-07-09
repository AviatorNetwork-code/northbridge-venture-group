import type { DiscoveryProfile } from "@/lib/cat/discovery-types";
import type { WebsiteAnalysisResult } from "@/lib/cat/discovery-types";
import { getLocalizedIndustryLabel } from "@/lib/nordi/localized-content";
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
  const seed = profile.userMessageCount ?? 0;

  if (
    answeredQuestionId === "general-team-size" ||
    (profile.employeeCount === 1 &&
      includesAny(text, [
        "just me",
        "solo",
        "only me",
        "one person",
        "solo yo",
        "sólo yo",
        "unicamente yo",
        "únicamente yo",
      ]))
  ) {
    return copy.soloOperatorReasoning;
  }

  if (profile.employeeCount != null && profile.employeeCount > 1 && profile.employeeCount <= 8) {
    if (answeredQuestionId === "general-team-size") {
      return copy.smallTeamReasoning;
    }
  }

  if (answeredQuestionId === "general-customer-contact") {
    const channelCount = profile.communicationChannels?.length ?? 0;
    if (channelCount > 1) {
      return copy.multiChannelReasoning;
    }
    return copy.singleChannelReasoning;
  }

  if (answeredQuestionId === "general-friction") {
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

  if (seed % 5 === 0 && profile.industry) {
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

  if ((input.profile.userMessageCount ?? 0) % 3 === 1) return null;
  return reason;
}

function buildTrustSummary(
  copy: ConsultantVoiceCopy,
  language: NordiLanguage,
  profile: DiscoveryProfile,
): string | null {
  const bullets: string[] = [];
  const seed = profile.userMessageCount ?? 0;

  if (seed < 6 || seed % 6 !== 0) return null;

  if (profile.industry) {
    bullets.push(getLocalizedIndustryLabel(profile.industry, language));
  }

  if (profile.employeeCount === 1) {
    bullets.push(copy.soloOperatorLabel);
  } else if (profile.employeeCount) {
    bullets.push(copy.employeeCountLabel(profile.employeeCount));
  }

  if ((profile.communicationChannels?.length ?? 0) > 0) {
    bullets.push(copy.customersViaLabel(profile.communicationChannels?.join(", ") ?? ""));
  }

  const friction = profile.discoveryAnswers?.["general-friction"];
  if (friction) {
    bullets.push(friction.length > 72 ? `${friction.slice(0, 69)}...` : friction);
  }

  if (bullets.length < 3) return null;

  return [copy.trustSummaryHeader, "", ...bullets.map((item) => `• ${item}`), "", copy.trustSummaryFooter].join(
    "\n",
  );
}

function createConsultantQuestionTurn(
  copy: ConsultantVoiceCopy,
  language: NordiLanguage,
  input: ConsultantTurnInput,
): ConsultantTurnOutput {
  const segments: string[] = [];

  const summary = buildTrustSummary(copy, language, input.profile);
  if (summary) segments.push(summary);

  const reasoning = buildAnswerReasoning(copy, language, input);
  if (reasoning) segments.push(reasoning);

  const connection = buildFactConnection(copy, input);
  if (connection && (input.profile.userMessageCount ?? 0) % 2 === 0) {
    segments.push(connection);
  }

  const questionReason = buildQuestionReason(copy, input);
  if (questionReason) segments.push(questionReason);

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
      ? "Una cosa que noté es que "
      : "One thing I noticed is that ";
    paragraphs.push(`${prefix}${joined}.`);
  }

  const context = collectContextText(profile);
  if (
    includesAny(context, ["schedul", "appointment", "cancel", "book", "agenda", "cita"]) &&
    !analysis.hasAppointmentSystem
  ) {
    paragraphs.push(copy.schedulingAlignment);
  } else if (observations.length > 0) {
    paragraphs.push(copy.websiteFrictionConnection);
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
          `Entendido — los negocios de ${label.toLowerCase()} suelen compartir presiones operativas similares.`,
        ]
      : [
          `A ${label.toLowerCase()} — that gives me a useful starting point.`,
          `${label} — that context helps me ask better questions.`,
          `Understood — ${label.toLowerCase()} businesses often share similar operational pressure points.`,
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
