import type { DiscoveryProfile } from "@/lib/cat/discovery-types";
import { getIndustryLabel } from "@/lib/cat/industry-questions";
import type { WebsiteAnalysisResult } from "@/lib/cat/discovery-types";

export type ConsultantTurnInput = {
  profile: DiscoveryProfile;
  userMessage: string;
  answeredQuestionId?: string;
  nextQuestionId: string;
  nextQuestionPrompt: string;
};

export type ConsultantTurnOutput = {
  reply: string;
  progressiveReply?: string[];
};

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

function buildAnswerReasoning(input: ConsultantTurnInput): string | null {
  const text = input.userMessage.toLowerCase();
  const { answeredQuestionId, profile } = input;
  const seed = profile.userMessageCount ?? 0;

  if (
    answeredQuestionId === "general-team-size" ||
    (profile.employeeCount === 1 && includesAny(text, ["just me", "solo", "only me", "one person"]))
  ) {
    return [
      "Running everything yourself usually means every interruption affects the entire business.",
      "",
      "That helps me understand where operational improvements could have the biggest impact.",
    ].join("\n");
  }

  if (profile.employeeCount != null && profile.employeeCount > 1 && profile.employeeCount <= 8) {
    if (answeredQuestionId === "general-team-size") {
      return [
        "With a small team, coordination often lives in a few people's heads.",
        "",
        "That is usually where follow-ups and scheduling drift show up first.",
      ].join("\n");
    }
  }

  if (answeredQuestionId === "general-customer-contact") {
    const channelCount = profile.communicationChannels?.length ?? 0;
    if (channelCount > 1) {
      return [
        "When customers reach you through several channels, context scatters quickly unless there is a clear place to track open requests.",
        "",
        "That pattern shows up in a lot of owner-led businesses.",
      ].join("\n");
    }
    return "How customers reach you shapes where messages get dropped — especially when you are busy serving the customer in front of you.";
  }

  if (answeredQuestionId === "general-friction") {
    return "That kind of weekly friction is often where owners feel the business running them, not the other way around.";
  }

  if (includesAny(text, ["referral", "referrals", "word of mouth", "word-of-mouth"])) {
    return [
      "Referral-driven businesses usually win on trust.",
      "",
      "That makes responsiveness and scheduling reliability especially visible to new customers.",
    ].join("\n");
  }

  if (seed % 5 === 0 && profile.industry) {
    return `For a ${getIndustryLabel(profile.industry).toLowerCase()}, the operational details you are sharing matter more than generic software features.`;
  }

  return null;
}

function buildFactConnection(input: ConsultantTurnInput): string | null {
  const context = collectContextText(input.profile);
  const { nextQuestionId, profile } = input;

  const mentionsReferrals = includesAny(context, ["referral", "referrals", "word of mouth"]);
  const mentionsScheduling = includesAny(context, [
    "schedul",
    "appointment",
    "cancel",
    "book",
    "calendar",
  ]);

  if (mentionsReferrals && (nextQuestionId.includes("booking") || nextQuestionId.includes("scheduling") || mentionsScheduling)) {
    return [
      "That actually fits with what you have already told me.",
      "",
      "Referral businesses often depend heavily on responsiveness, so appointment scheduling becomes even more important.",
    ].join("\n");
  }

  if (mentionsScheduling && nextQuestionId === "general-customer-contact") {
    return "Given the scheduling pressure you mentioned, I want to understand how customers usually initiate contact today.";
  }

  if (profile.employeeCount === 1 && nextQuestionId === "general-friction") {
    return "As a solo operator, the friction you feel usually maps directly to how much context-switching you do in a day.";
  }

  return null;
}

function buildQuestionReason(input: ConsultantTurnInput): string | null {
  const reasons: Record<string, string> = {
    "general-team-size":
      "Scale changes where bottlenecks show up — I want to understand that before we go deeper.",
    "general-customer-contact":
      "How customers reach you tells me where follow-ups are most likely to get lost.",
    "general-friction":
      "I want to focus on the operational bottleneck that actually costs you time each week.",
    "dental-online-booking":
      "Online booking changes how much manual coordination happens at the front desk.",
    "dental-reminders":
      "Reminder follow-through is one of the clearest places patient experience and revenue meet.",
    "hvac-scheduling":
      "Scheduling is usually the hinge point between marketing promises and day-to-day service delivery.",
    "hvac-emergency":
      "After-hours demand is often where HVAC operations get expensive quickly.",
  };

  const reason = reasons[input.nextQuestionId];
  if (!reason) return null;

  if ((input.profile.userMessageCount ?? 0) % 3 === 1) return null;
  return reason;
}

function buildTrustSummary(profile: DiscoveryProfile): string | null {
  const bullets: string[] = [];
  const seed = profile.userMessageCount ?? 0;

  if (seed < 6 || seed % 6 !== 0) return null;

  if (profile.industry) {
    bullets.push(getIndustryLabel(profile.industry));
  }

  if (profile.employeeCount === 1) {
    bullets.push("Solo operator");
  } else if (profile.employeeCount) {
    bullets.push(`About ${profile.employeeCount} people involved day to day`);
  }

  if ((profile.communicationChannels?.length ?? 0) > 0) {
    bullets.push(`Customers reach you via ${profile.communicationChannels?.join(", ")}`);
  }

  const friction = profile.discoveryAnswers?.["general-friction"];
  if (friction) {
    bullets.push(friction.length > 72 ? `${friction.slice(0, 69)}...` : friction);
  }

  if (bullets.length < 3) return null;

  return [
    "So far, here is what I am seeing:",
    "",
    ...bullets.map((item) => `• ${item}`),
    "",
    "That gives me a much clearer picture.",
  ].join("\n");
}

export function buildConsultantQuestionTurn(input: ConsultantTurnInput): ConsultantTurnOutput {
  const segments: string[] = [];

  const summary = buildTrustSummary(input.profile);
  if (summary) segments.push(summary);

  const reasoning = buildAnswerReasoning(input);
  if (reasoning) segments.push(reasoning);

  const connection = buildFactConnection(input);
  if (connection && (input.profile.userMessageCount ?? 0) % 2 === 0) {
    segments.push(connection);
  }

  const questionReason = buildQuestionReason(input);
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

export function buildConsultantRecommendationReply(profile: DiscoveryProfile, areas: string[]): ConsultantTurnOutput {
  const seed = profile.userMessageCount ?? 0;
  const lead =
    seed % 2 === 0
      ? "A few patterns are starting to stand out in how the business runs day to day."
      : "Based on what you have shared, a few operational themes keep appearing.";

  return {
    reply: "",
    progressiveReply: [
      lead,
      [
        ...areas.map((area) => `• ${area.charAt(0).toUpperCase()}${area.slice(1)}`),
        "",
        "I would like to understand your current process a little better before we discuss possible improvements.",
      ].join("\n"),
    ],
  };
}

export function buildConsultantWebsitePermissionLead(profile: DiscoveryProfile): string {
  const seed = profile.userMessageCount ?? 0;
  const options = [
    "If you have a public website, reviewing it can help me connect what you are describing to what customers actually see.",
    "A quick look at your public website sometimes reveals gaps between how the business runs and how customers experience it.",
    "When owners describe operations well, I like to see whether the public website reflects that same clarity.",
  ];
  return options[Math.abs(seed) % options.length];
}

export function buildConsultantWebsiteUrlAck(continueLine: string): string {
  return `Good — I will review your public site while we keep talking.${continueLine}`;
}

export function buildWebsiteInsightNarrative(
  analysis: WebsiteAnalysisResult,
  profile: DiscoveryProfile,
): string[] {
  const paragraphs: string[] = ["I finished reviewing your website."];
  const observations: string[] = [];

  if (!analysis.hasAppointmentSystem && !analysis.hasBookingFlow) {
    observations.push("I could not find online appointment booking");
  }
  if (!analysis.hasContactForm) {
    observations.push("there is not an obvious contact form for new inquiries");
  }
  if (analysis.hasEmergencyMessaging && profile.industry === "hvac") {
    observations.push("emergency service is prominent, which usually means after-hours coordination matters");
  }

  if (observations.length > 0) {
    const joined =
      observations.length === 1
        ? observations[0]
        : `${observations.slice(0, -1).join(", ")}, and ${observations[observations.length - 1]}`;
    paragraphs.push(`One thing I noticed is that ${joined}.`);
  }

  const context = collectContextText(profile);
  if (
    includesAny(context, ["schedul", "appointment", "cancel", "book"]) &&
    !analysis.hasAppointmentSystem
  ) {
    paragraphs.push("That lines up with what you have been describing about scheduling.");
  } else if (observations.length > 0) {
    paragraphs.push("It may explain part of the friction you described — we can keep connecting the dots as we talk.");
  }

  return paragraphs;
}

export function buildConsultantIndustryOpening(industryLabel: string, seed: number): string {
  const options = [
    `A ${industryLabel.toLowerCase()} — that gives me a useful starting point.`,
    `${industryLabel} — that context helps me ask better questions.`,
    `Understood — ${industryLabel.toLowerCase()} businesses often share similar operational pressure points.`,
  ];
  return options[Math.abs(seed) % options.length];
}
