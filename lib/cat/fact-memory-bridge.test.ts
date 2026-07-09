import { describe, expect, it } from "vitest";
import type { DiscoveryProfile } from "@/lib/cat/discovery-types";
import {
  getMissingDiscoveryFields,
  runNordiDiscoveryPlanner,
  selectNextNordiQuestion,
} from "./fact-memory-bridge";

function baseProfile(overrides: Partial<DiscoveryProfile> = {}): DiscoveryProfile {
  return {
    industry: "professional-services",
    employeeCount: 1,
    communicationChannels: ["Phone"],
    answeredQuestions: ["general-team-size", "general-customer-contact"],
    discoveryAnswers: {
      "general-team-size": "Just me",
      "general-customer-contact": "Phone",
    },
    ...overrides,
  };
}

describe("fact-memory-bridge (conversation-state planner)", () => {
  it("selects general friction when core discovery fields are incomplete", () => {
    const profile = baseProfile({
      answeredQuestions: ["general-team-size", "general-customer-contact"],
      discoveryAnswers: {
        "general-team-size": "Just me",
        "general-customer-contact": "Phone",
      },
    });

    const question = selectNextNordiQuestion(profile);
    expect(question?.fieldId).toBe("general-friction");
  });

  it("does not re-ask answered team-size after tax business flow facts", () => {
    const profile: DiscoveryProfile = {
      industry: "professional-services",
      employeeCount: 1,
      communicationChannels: ["Phone", "Text"],
      answeredQuestions: [
        "industry",
        "general-team-size",
        "general-customer-contact",
        "general-friction",
      ],
      discoveryAnswers: {
        "general-team-size": "Just me",
        "general-customer-contact": "Phone + text",
        "general-friction": "Too many messages",
      },
    };

    const planner = runNordiDiscoveryPlanner(profile);
    expect(planner.selectedQuestion?.fieldId).not.toBe("general-team-size");
    expect(getMissingDiscoveryFields(profile)).not.toContain("employeeCount");
  });

  it("advances to the next unanswered industry question", () => {
    const profile: DiscoveryProfile = {
      industry: "dental",
      employeeCount: 4,
      communicationChannels: ["Phone"],
      answeredQuestions: [
        "general-team-size",
        "general-customer-contact",
        "general-friction",
        "dental-online-booking",
        "dental-providers",
      ],
      discoveryAnswers: {
        "general-team-size": "4",
        "general-customer-contact": "Phone",
        "general-friction": "Missed calls",
        "dental-online-booking": "Yes",
        "dental-providers": "3",
      },
    };

    const { selectedQuestion } = runNordiDiscoveryPlanner(profile);
    expect(selectedQuestion?.fieldId).toBe("dental-reminders");
  });
});
