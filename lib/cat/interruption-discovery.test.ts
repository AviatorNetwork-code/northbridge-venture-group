import { describe, expect, it } from "vitest";
import { processDiscoveryMessage, mergeProfile } from "@/lib/cat/discovery-engine";
import { processCatMessage } from "@/lib/cat/engine";
import type { DiscoveryProfile } from "@/lib/cat/discovery-types";
import type { CatEngineContext } from "@/lib/cat/types";

describe("conversation interruption integration", () => {
  it("answers a Northbridge question and resumes the pending Nordi discovery question", () => {
    const profile: DiscoveryProfile = {
      industry: "professional-services",
      employeeCount: 1,
      communicationChannels: ["Phone", "Text"],
      answeredQuestions: ["general-team-size", "general-customer-contact"],
      pendingQuestionId: "general-friction",
      userMessageCount: 3,
    };

    const result = processDiscoveryMessage("What is Northbridge?", profile);
    const nextProfile = mergeProfile(profile, result.profileUpdates ?? {});

    expect(result.reply).toContain("Northbridge Digital");
    expect(result.reply).toMatch(/back to your business/i);
    expect(result.reply).toMatch(/friction/i);
    expect(nextProfile.pendingQuestionId).toBe("general-friction");
    expect(nextProfile.answeredQuestions).not.toContain("general-friction");
    expect(nextProfile.discoveryAnswers?.["general-friction"]).toBeUndefined();
  });

  it("records a normal discovery answer after an interruption resume", () => {
    const profile: DiscoveryProfile = {
      industry: "professional-services",
      employeeCount: 1,
      communicationChannels: ["Phone", "Text"],
      answeredQuestions: ["general-team-size", "general-customer-contact"],
      pendingQuestionId: "general-friction",
      userMessageCount: 3,
    };

    const interruption = processDiscoveryMessage("What is Northbridge?", profile);
    let nextProfile = mergeProfile(profile, interruption.profileUpdates ?? {});

    const answer = processDiscoveryMessage("Too many messages and everything is on paper", nextProfile);
    nextProfile = mergeProfile(nextProfile, answer.profileUpdates ?? {});

    expect(nextProfile.answeredQuestions).toContain("general-friction");
    expect(nextProfile.discoveryAnswers?.["general-friction"]).toBe(
      "Too many messages and everything is on paper",
    );
  });

  it("answers a Northbridge question and resumes the pending CAT discovery question", () => {
    const context: CatEngineContext = {
      currentModule: "dashboard",
      session: {
        id: "cat-test",
        messages: [],
        businessProfile: {
          industry: "dental",
          pendingQuestionId: "cat-team-size",
          pendingQuestionPrompt: "How many employees do you have?",
        },
      },
    };

    const result = processCatMessage("What is Northbridge?", context);

    expect(result.reply).toContain("Northbridge Digital");
    expect(result.reply).toMatch(/back to your business/i);
    expect(result.reply).toContain("How many employees do you have?");
    expect(result.profileUpdates?.employeeCount).toBeUndefined();
    expect(result.profileUpdates?.pendingQuestionId).toBeUndefined();
  });

  it("records a normal CAT answer when the message is not an interruption", () => {
    const context: CatEngineContext = {
      currentModule: "dashboard",
      session: {
        id: "cat-test",
        messages: [],
        businessProfile: {
          industry: "dental",
          pendingQuestionId: "cat-team-size",
          pendingQuestionPrompt: "How many employees do you have?",
        },
      },
    };

    const result = processCatMessage("About 8 employees", context);

    expect(result.profileUpdates?.employeeCount).toBe(8);
    expect(result.profileUpdates?.answeredQuestions).toContain("cat-team-size");
  });
});
