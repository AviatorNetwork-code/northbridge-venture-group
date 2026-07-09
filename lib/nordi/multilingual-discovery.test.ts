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
import { extractBusinessSignals } from "@/lib/nordi/entity-extraction";

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

function assertPlannerParity(
  english: ReturnType<typeof runConversation>,
  spanish: ReturnType<typeof runConversation>,
  expectedIndustry: string,
  options: { requireFriction?: boolean } = {},
) {
  expect(english.profile.industry).toBe(expectedIndustry);
  expect(spanish.profile.industry).toBe(expectedIndustry);
  expect(english.profile.employeeCount).toBe(spanish.profile.employeeCount);
  expect(english.profile.communicationChannels?.sort()).toEqual(
    spanish.profile.communicationChannels?.sort(),
  );
  expect(english.profile.answeredQuestions?.sort()).toEqual(spanish.profile.answeredQuestions?.sort());
  expect(getMissingDiscoveryFields(english.profile)).toEqual(getMissingDiscoveryFields(spanish.profile));
  expect(hasIndustry(english.profile)).toBe(true);
  expect(hasIndustry(spanish.profile)).toBe(true);
  expect(hasEmployeeCount(english.profile)).toBe(true);
  expect(hasEmployeeCount(spanish.profile)).toBe(true);

  if (options.requireFriction ?? true) {
    expect(hasOperationalFriction(english.profile)).toBe(true);
    expect(hasOperationalFriction(spanish.profile)).toBe(true);
  }
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
      "Soy contador",
      "Trabajo solo",
      "Teléfono y texto",
      "Demasiados mensajes, todo en papel",
    ]);

    assertPlannerParity(english, spanish, "professional-services");
    expect(english.profile.preferredLanguage).toBe("en");
    expect(spanish.profile.preferredLanguage).toBe("es");
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
      "Trabajo solo",
      "Teléfono y visitas",
      "La agenda es difícil",
    ]);

    assertPlannerParity(english, spanish, "hospitality");
    expect(english.profile.preferredLanguage).toBe("en");
    expect(spanish.profile.preferredLanguage).toBe("es");
  });

  it("English law firm and Spanish law firm share planner path and facts", () => {
    const english = runConversation([
      "Law firm",
      "Just me",
      "Phone and email",
      "Follow-ups fall through the cracks",
    ]);

    const spanish = runConversation([
      "Soy abogado",
      "Trabajo solo",
      "Teléfono y correo",
      "Se pierden los seguimientos",
    ]);

    assertPlannerParity(english, spanish, "professional-services");
  });

  it("English contractor and Spanish contractor share planner path and facts", () => {
    const english = runConversation([
      "General contractor",
      "Just me",
      "Phone and text",
      "No website",
      "Scheduling is chaos",
    ]);

    const spanish = runConversation([
      "Soy contratista",
      "Trabajo solo",
      "Teléfono y texto",
      "Sin sitio web",
      "La agenda es un caos",
    ]);

    assertPlannerParity(english, spanish, "general", { requireFriction: false });
  });

  it("English flight school and Spanish flight school share planner path and facts", () => {
    const english = runConversation([
      "Flight school",
      "Just me",
      "Phone and email",
      "Student scheduling is hard",
    ]);

    const spanish = runConversation([
      "Escuela de vuelo",
      "Trabajo solo",
      "Teléfono y correo",
      "La agenda de estudiantes es difícil",
    ]);

    assertPlannerParity(english, spanish, "aviation");
  });

  it("stores normalized industry facts, not Spanish literal strings", () => {
    const { profile } = runConversation(["Tengo un negocio de impuestos"]);
    expect(profile.industry).toBe("professional-services");
    expect(profile.industry).not.toContain("impuestos");
  });

  it("extracts natural Spanish operational phrases", () => {
    expect(extractBusinessSignals("Atiendo por WhatsApp.").communicationChannels).toContain("WhatsApp");
    expect(extractBusinessSignals("Mis clientes llegan por recomendaciones.").referralMentioned).toBe(true);
    expect(extractBusinessSignals("Me cancelan las citas.").schedulingFrictionMentioned).toBe(true);
    expect(extractBusinessSignals("Tengo dos oficinas.").locationCount).toBe(2);
    expect(extractBusinessSignals("Quiero crecer.").growthIntentMentioned).toBe(true);
  });
});
