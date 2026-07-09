import { describe, expect, it } from "vitest";
import { processDiscoveryMessage, mergeProfile } from "@/lib/cat/discovery-engine";
import type { DiscoveryProfile } from "@/lib/cat/discovery-types";
import {
  getMissingDiscoveryFields,
  hasEmployeeCount,
  hasIndustry,
  hasOperationalFriction,
} from "@/lib/cat/discovery-profile-state";

function runConversation(messages: string[], initialProfile: DiscoveryProfile = {}) {
  let profile = initialProfile;
  const replies: string[] = [];

  for (const message of messages) {
    const result = processDiscoveryMessage(message, profile);
    profile = mergeProfile(profile, result.profileUpdates ?? {});
    replies.push(result.reply || result.progressiveReply?.join("\n") || "");
  }

  return { profile, replies };
}

describe("Nordi discovery orchestration", () => {
  it("does not re-ask business type or team size after the tax business conversation", () => {
    const { profile, replies } = runConversation([
      "Tax business",
      "Just me",
      "Phone + text",
      "Too many messages, everything on paper",
    ]);

    const finalReply = replies[3];

    expect(finalReply).not.toContain("What kind of business is it");
    expect(finalReply).not.toContain("how many people are involved in day-to-day operations");
    expect(hasIndustry(profile)).toBe(true);
    expect(hasEmployeeCount(profile)).toBe(true);
    expect(hasOperationalFriction(profile)).toBe(true);
    expect(profile.employeeCount).toBe(1);
    expect(profile.industry).toBe("professional-services");
    expect(profile.communicationChannels).toEqual(expect.arrayContaining(["Phone", "Text"]));
    expect(profile.answeredQuestions).toEqual(
      expect.arrayContaining(["general-team-size", "general-customer-contact", "general-friction"]),
    );
    expect(getMissingDiscoveryFields(profile)).toEqual([]);
  });

  it("merges newly extracted entities without replacing accumulated profile state", () => {
    let profile: DiscoveryProfile = {
      industry: "dental",
      employeeCount: 4,
      answeredQuestions: ["dental-online-booking"],
      discoveryAnswers: { "dental-online-booking": "Yes" },
      communicationChannels: ["Phone"],
      notes: ["We run a busy dental office"],
    };

    const result = processDiscoveryMessage("Email works too for reminders", profile);
    profile = mergeProfile(profile, result.profileUpdates ?? {});

    expect(profile.industry).toBe("dental");
    expect(profile.employeeCount).toBe(4);
    expect(profile.answeredQuestions).toContain("dental-online-booking");
    expect(profile.discoveryAnswers?.["dental-online-booking"]).toBe("Yes");
    expect(profile.communicationChannels).toEqual(expect.arrayContaining(["Phone", "Email"]));
  });

  it("uses accumulated state when deciding missing fields", () => {
    const profile: DiscoveryProfile = {
      discoveryAnswers: {
        "general-team-size": "Just me",
        "general-customer-contact": "Phone + text",
        "general-friction": "Too many messages",
      },
      answeredQuestions: ["general-team-size", "general-customer-contact", "general-friction"],
      employeeCount: 1,
      communicationChannels: ["Phone", "Text"],
      industry: "professional-services",
    };

    expect(getMissingDiscoveryFields(profile)).toEqual([]);
  });

  it("asks website permission after general questions instead of repeating discovery prompts", () => {
    const { replies } = runConversation([
      "Tax business",
      "Just me",
      "Phone + text",
      "Too many messages, everything on paper",
    ]);

    expect(replies[3]).toContain("website");
  });
});
