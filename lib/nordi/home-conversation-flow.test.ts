import { describe, expect, it } from "vitest";
import {
  detectHumanAssistanceRequest,
  shouldOfferSavePrompt,
} from "@/lib/nordi/home-conversation-flow";

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

  it("offers save after enough messages or business context", () => {
    expect(shouldOfferSavePrompt({ userMessageCount: 4 })).toBe(false);
    expect(shouldOfferSavePrompt({ userMessageCount: 5 })).toBe(true);
    expect(
      shouldOfferSavePrompt({
        userMessageCount: 3,
        industry: "dental",
        answeredQuestions: ["dental-online-booking"],
      }),
    ).toBe(true);
  });
});
