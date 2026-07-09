import { describe, expect, it } from "vitest";
import {
  buildConsultantQuestionTurn,
  buildConsultantRecommendationReply,
  buildWebsiteInsightNarrative,
} from "@/lib/nordi/consultant-voice";
import type { ConsultantTurnInput } from "@/lib/nordi/consultant-voice";
import {
  decideConsultantCadence,
  shouldShowTrustSummary,
} from "@/lib/nordi/consultant-voice/consultant-cadence";

describe("consultant voice", () => {
  it("reasons before asking after a solo operator answer", () => {
    const input: ConsultantTurnInput = {
      profile: { userMessageCount: 2, employeeCount: 1, industry: "professional-services" },
      userMessage: "Just me",
      answeredQuestionId: "general-team-size",
      nextQuestionId: "general-customer-contact",
      nextQuestionPrompt: "How do customers usually reach you?",
    };

    const turn = buildConsultantQuestionTurn(input);
    const combined = turn.reply || turn.progressiveReply?.join("\n") || "";

    expect(combined).toContain("Running everything yourself");
    expect(combined).toContain("How do customers usually reach you?");
    expect(combined).not.toContain("Perfect.");
    expect(combined).not.toContain("Thank you.");
    expect(combined).not.toContain("That helps me understand");
  });

  it("does not use solo-operator reasoning for a two-person team", () => {
    const input: ConsultantTurnInput = {
      profile: {
        userMessageCount: 3,
        employeeCount: 2,
        industry: "professional-services",
      },
      userMessage: "2",
      answeredQuestionId: "general-team-size",
      nextQuestionId: "general-customer-contact",
      nextQuestionPrompt: "How do customers usually reach you — phone, email, walk-ins, or something else?",
    };

    const turn = buildConsultantQuestionTurn(input);
    const combined = turn.reply || turn.progressiveReply?.join("\n") || "";

    expect(combined).not.toContain("Running everything yourself");
    expect(combined).not.toContain("With a small team");
    expect(combined).toBe(
      "How do customers usually reach you — phone, email, walk-ins, or something else?",
    );
  });

  it("keeps short factual answers direct across consecutive turns", () => {
    const turns: ConsultantTurnInput[] = [
      {
        profile: { userMessageCount: 2, industry: "professional-services", employeeCount: 2 },
        userMessage: "2",
        answeredQuestionId: "general-team-size",
        nextQuestionId: "general-customer-contact",
        nextQuestionPrompt: "How do customers usually reach you?",
      },
      {
        profile: {
          userMessageCount: 3,
          industry: "professional-services",
          employeeCount: 2,
          communicationChannels: ["phone"],
        },
        userMessage: "phone",
        answeredQuestionId: "general-customer-contact",
        nextQuestionId: "general-friction",
        nextQuestionPrompt: "What creates the most friction in a typical week?",
      },
      {
        profile: {
          userMessageCount: 4,
          industry: "professional-services",
          employeeCount: 2,
          communicationChannels: ["phone"],
        },
        userMessage: "email too",
        answeredQuestionId: "general-customer-contact",
        nextQuestionId: "general-friction",
        nextQuestionPrompt: "What creates the most friction in a typical week?",
      },
    ];

    for (const input of turns) {
      const turn = buildConsultantQuestionTurn(input);
      const combined = turn.reply || turn.progressiveReply?.join("\n") || "";
      expect(combined).not.toContain("Running everything yourself");
      expect(combined).not.toContain("Scale changes where bottlenecks");
      expect(combined).not.toContain("How customers reach you tells me");
      expect(combined).not.toContain("That helps me understand");
    }
  });

  it("shows consultant summaries only after enough context", () => {
    expect(
      shouldShowTrustSummary({
        userMessageCount: 4,
        industry: "professional-services",
        employeeCount: 2,
        communicationChannels: ["phone"],
      }),
    ).toBe(false);

    expect(
      shouldShowTrustSummary({
        userMessageCount: 7,
        industry: "professional-services",
        employeeCount: 2,
        communicationChannels: ["phone"],
        discoveryAnswers: { "general-friction": "Scheduling follow-ups slip" },
      }),
    ).toBe(true);

    const input: ConsultantTurnInput = {
      profile: {
        userMessageCount: 7,
        industry: "professional-services",
        employeeCount: 2,
        communicationChannels: ["phone"],
        discoveryAnswers: { "general-friction": "Scheduling follow-ups slip" },
      },
      userMessage: "Scheduling follow-ups slip",
      answeredQuestionId: "general-friction",
      nextQuestionId: "dental-online-booking",
      nextQuestionPrompt: "Do you offer online booking today?",
    };

    const turn = buildConsultantQuestionTurn(input);
    const combined = turn.reply || turn.progressiveReply?.join("\n") || "";
    expect(combined).toContain("So far");
    expect(combined).toContain("Do you offer online booking today?");
  });

  it("uses direct cadence for numeric employee answers", () => {
    const input: ConsultantTurnInput = {
      profile: { userMessageCount: 3, employeeCount: 2, industry: "professional-services" },
      userMessage: "2",
      answeredQuestionId: "general-team-size",
      nextQuestionId: "general-customer-contact",
      nextQuestionPrompt: "How do customers usually reach you?",
    };

    expect(decideConsultantCadence(input)).toBe("direct");
  });

  it("uses natural recommendation language", () => {
    const output = buildConsultantRecommendationReply(
      { userMessageCount: 6, industry: "dental" },
      ["appointment reminder follow-through"],
    );

    const combined = output.progressiveReply?.join("\n") ?? output.reply;
    expect(combined).toContain("understand your current process");
    expect(combined).not.toContain("not recommending products yet");
  });

  it("weaves website observations into prose instead of report-card language", () => {
    const narrative = buildWebsiteInsightNarrative(
      {
        url: "https://example.com",
        services: [],
        contactMethods: [],
        hasBookingFlow: false,
        hasAppointmentSystem: false,
        hasBusinessHours: false,
        hasContactForm: false,
        hasEmergencyMessaging: false,
        phoneProminent: false,
        hasGoogleBusinessProfile: false,
        technologies: [],
        signals: [],
        analyzedAt: new Date().toISOString(),
      },
      {
        preferredLanguage: "en",
        discoveryAnswers: { "general-friction": "Scheduling cancellations are tough" },
        notes: ["Scheduling cancellations are tough"],
      },
    );

    expect(narrative.join(" ")).toContain("finished reviewing your website");
    expect(narrative.join(" ")).toContain("online appointment booking");
    expect(narrative.join(" ")).not.toContain("OBSERVATION");
    expect(narrative.join(" ")).not.toContain("Not detected");
    expect(narrative.join(" ")).not.toContain("connecting the dots");
  });

  it("localizes website insight narrative in Spanish", () => {
    const narrative = buildWebsiteInsightNarrative(
      {
        url: "https://example.com",
        services: [],
        contactMethods: [],
        hasBookingFlow: false,
        hasAppointmentSystem: false,
        hasBusinessHours: false,
        hasContactForm: false,
        hasEmergencyMessaging: false,
        phoneProminent: false,
        hasGoogleBusinessProfile: false,
        technologies: [],
        signals: [],
        analyzedAt: new Date().toISOString(),
      },
      {
        preferredLanguage: "es",
        discoveryAnswers: { "general-friction": "La agenda es difícil" },
        notes: ["La agenda es difícil"],
      },
    );

    expect(narrative.join(" ")).toContain("Terminé de revisar tu sitio web");
    expect(narrative.join(" ")).not.toContain("finished reviewing your website");
  });
});
