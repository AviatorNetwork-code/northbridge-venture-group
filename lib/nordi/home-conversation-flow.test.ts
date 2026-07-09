import { describe, expect, it } from "vitest";
import {
  detectHumanAssistanceRequest,
  shouldOfferSavePrompt,
} from "@/lib/nordi/home-conversation-flow";
import { hasMeaningfulContextForSave } from "@/lib/nordi/consultant-voice/consultant-cadence";

describe("home conversation flow", () => {
  it("detects human assistance requests", () => {
    expect(detectHumanAssistanceRequest("I want to talk to someone.")).toBe(true);
    expect(detectHumanAssistanceRequest("Can I speak to a person?")).toBe(true);
    expect(detectHumanAssistanceRequest("I need a human.")).toBe(true);
    expect(detectHumanAssistanceRequest("Can someone contact me tomorrow?")).toBe(true);
    expect(detectHumanAssistanceRequest("Schedule a call please")).toBe(true);
  });

  it("does not misdetect normal discovery messages", () => {
    expect(detectHumanAssistanceRequest("Tax business with 3 employees")).toBe(false);
    expect(detectHumanAssistanceRequest("Too many messages on paper")).toBe(false);
  });

  it("requires meaningful context before offering save early", () => {
    expect(
      hasMeaningfulContextForSave({
        industry: "professional-services",
        employeeCount: 2,
      }),
    ).toBe(false);

    expect(
      hasMeaningfulContextForSave({
        industry: "professional-services",
        employeeCount: 2,
        communicationChannels: ["phone"],
      }),
    ).toBe(true);

    expect(
      hasMeaningfulContextForSave({
        industry: "professional-services",
        employeeCount: 2,
        discoveryAnswers: { "general-friction": "Follow-ups slip" },
      }),
    ).toBe(true);
  });

  it("delays save prompt until meaningful context or six messages", () => {
    expect(shouldOfferSavePrompt({ userMessageCount: 4 })).toBe(false);
    expect(shouldOfferSavePrompt({ userMessageCount: 5 })).toBe(false);
    expect(shouldOfferSavePrompt({ userMessageCount: 6 })).toBe(true);

    expect(
      shouldOfferSavePrompt({
        userMessageCount: 3,
        industry: "dental",
        employeeCount: 2,
        communicationChannels: ["phone"],
      }),
    ).toBe(true);

    expect(
      shouldOfferSavePrompt({
        userMessageCount: 3,
        industry: "dental",
        answeredQuestions: ["dental-online-booking"],
      }),
    ).toBe(false);
  });
});
