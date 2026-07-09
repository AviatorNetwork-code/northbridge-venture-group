import { describe, expect, it } from "vitest";
import {
  buildConsultantQuestionTurn,
  buildConsultantRecommendationReply,
  buildWebsiteInsightNarrative,
} from "@/lib/nordi/consultant-voice";
import type { ConsultantTurnInput } from "@/lib/nordi/consultant-voice";

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
