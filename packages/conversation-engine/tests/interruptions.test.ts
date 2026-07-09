import { describe, expect, it } from "vitest";
import {
  buildInterruptionResumeLine,
  detectInterruption,
  handleInterruption,
} from "../src/interruptions/index.js";

describe("conversation interruption engine", () => {
  it("detects company knowledge questions during a pending discovery question", () => {
    const detection = detectInterruption({
      message: "What is Northbridge?",
      hasPendingQuestion: true,
      pendingQuestionId: "general-friction",
    });

    expect(detection.isInterruption).toBe(true);
    expect(detection.type).toBe("company");
  });

  it("does not treat a friction answer as an interruption", () => {
    const detection = detectInterruption({
      message: "Too many messages and everything is on paper",
      hasPendingQuestion: true,
      pendingQuestionId: "general-friction",
    });

    expect(detection.isInterruption).toBe(false);
  });

  it("answers completely and builds a resume line", () => {
    const detection = detectInterruption({
      message: "What is Northbridge?",
      hasPendingQuestion: true,
      pendingQuestionId: "general-friction",
    });

    const handled = handleInterruption({
      detection,
      language: "en",
      resume: {
        pendingQuestionId: "general-friction",
        pendingQuestionPrompt:
          "What creates the most friction in a typical week — scheduling, follow-ups, billing, or something else?",
        language: "en",
        questionStillPending: true,
      },
    });

    expect(handled.answer).toContain("Northbridge Digital");
    expect(handled.fullReply).toContain("back to your business");
    expect(handled.fullReply).toContain("friction");
  });

  it("skips resume when the pending question is already answered", () => {
    const resume = buildInterruptionResumeLine({
      pendingQuestionId: "general-friction",
      pendingQuestionPrompt: "What creates the most friction?",
      language: "en",
      questionStillPending: false,
    });

    expect(resume).toBeUndefined();
  });
});
