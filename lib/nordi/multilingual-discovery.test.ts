import { describe, expect, it } from "vitest";
import { processDiscoveryMessage, mergeProfile } from "@/lib/cat/discovery-engine";
import { getNextIndustryQuestion } from "@/lib/cat/industry-questions";
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
  const questionIds: string[] = [];

  for (const message of messages) {
    const result = processDiscoveryMessage(message, profile);
    profile = mergeProfile(profile, result.profileUpdates ?? {});
    replies.push(result.reply || result.progressiveReply?.join("\n") || "");
    const nextQuestion = getNextIndustryQuestion(profile);
    if (nextQuestion) questionIds.push(nextQuestion.id);
  }

  return { profile, replies, questionIds };
}

function assertTaxBusinessParity(
  english: ReturnType<typeof runConversation>,
  spanish: ReturnType<typeof runConversation>,
) {
  expect(english.profile.industry).toBe("professional-services");
  expect(spanish.profile.industry).toBe("professional-services");
  expect(english.profile.employeeCount).toBe(1);
  expect(spanish.profile.employeeCount).toBe(1);
  expect(english.profile.communicationChannels?.sort()).toEqual(spanish.profile.communicationChannels?.sort());
  expect(english.profile.answeredQuestions?.sort()).toEqual(spanish.profile.answeredQuestions?.sort());
  expect(getMissingDiscoveryFields(english.profile)).toEqual(getMissingDiscoveryFields(spanish.profile));
  expect(hasIndustry(english.profile)).toBe(true);
  expect(hasIndustry(spanish.profile)).toBe(true);
  expect(hasEmployeeCount(english.profile)).toBe(true);
  expect(hasEmployeeCount(spanish.profile)).toBe(true);
  expect(hasOperationalFriction(english.profile)).toBe(true);
  expect(hasOperationalFriction(spanish.profile)).toBe(true);
}

function assertRestaurantParity(
  english: ReturnType<typeof runConversation>,
  spanish: ReturnType<typeof runConversation>,
) {
  expect(english.profile.industry).toBe("hospitality");
  expect(spanish.profile.industry).toBe("hospitality");
  expect(english.profile.employeeCount).toBe(1);
  expect(spanish.profile.employeeCount).toBe(1);
  expect(english.profile.answeredQuestions?.sort()).toEqual(spanish.profile.answeredQuestions?.sort());
  expect(getMissingDiscoveryFields(english.profile)).toEqual(getMissingDiscoveryFields(spanish.profile));
}

describe("multilingual discovery regression", () => {
  it("English tax business and Spanish tax business share planner path and facts", () => {
    const english = runConversation([
      "Tax business",
      "Just me",
      "Phone + text",
      "Too many messages, everything on paper",
    ]);

    const spanish = runConversation([
      "Tengo un negocio de impuestos",
      "Solo yo",
      "Teléfono y texto",
      "Demasiados mensajes, todo en papel",
    ]);

    assertTaxBusinessParity(english, spanish);

    expect(english.profile.preferredLanguage).toBe("en");
    expect(spanish.profile.preferredLanguage).toBe("es");

    const englishCombined = english.replies.join("\n");
    const spanishCombined = spanish.replies.join("\n");

    expect(englishCombined).toMatch(/Running everything yourself|people are involved/i);
    expect(spanishCombined).toMatch(/lo manejas todo tú solo|personas participan/i);
    expect(spanishCombined).not.toContain("Running everything yourself");
    expect(englishCombined).not.toContain("lo manejas todo tú solo");
  });

  it("English restaurant and Spanish restaurant share planner path and facts", () => {
    const english = runConversation([
      "Restaurant",
      "Just me",
      "Phone and walk-ins",
      "Scheduling is hard",
    ]);

    const spanish = runConversation([
      "Tengo un restaurante",
      "Solo yo",
      "Teléfono y visitas",
      "La agenda es difícil",
    ]);

    assertRestaurantParity(english, spanish);

    expect(english.profile.preferredLanguage).toBe("en");
    expect(spanish.profile.preferredLanguage).toBe("es");

    const englishCombined = english.replies.join("\n");
    const spanishCombined = spanish.replies.join("\n");

    expect(englishCombined).toMatch(/customers usually reach you|people are involved/i);
    expect(spanishCombined).toMatch(/contactarlo los clientes|personas participan/i);
    expect(spanishCombined).not.toMatch(/customers usually reach you/i);
  });

  it("stores normalized industry facts, not Spanish literal strings", () => {
    const { profile } = runConversation(["Tengo un negocio de impuestos"]);
    expect(profile.industry).toBe("professional-services");
    expect(profile.industry).not.toContain("impuestos");
  });
});
