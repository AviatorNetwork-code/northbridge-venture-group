import type { DiscoveryProfile } from "@/lib/cat/discovery-types";
import { INDUSTRY_QUESTION_BANK } from "@/lib/cat/industry-questions";
import {
  createEmptyFactMemory,
  mergeExtractedFacts,
  selectNextQuestion,
  syncMissingFields,
  type AccumulatedFact,
  type ConversationFactMemory,
  type ConversationFieldDefinition,
  type ExtractedFactInput,
} from "@northbridge/conversation-state";

export type DiscoveryField =
  | "industry"
  | "employeeCount"
  | "communicationChannels"
  | "operationalFriction";

const CORE_DISCOVERY_FIELDS: ConversationFieldDefinition[] = [
  {
    fieldId: "industry",
    semanticKey: "business-type",
    prompt: "What kind of business is it?",
    required: true,
    priority: 1,
    isAnswered: (facts, answered) =>
      answered.includes("industry") || Boolean(facts.industry?.value),
  },
  {
    fieldId: "general-team-size",
    semanticKey: "team-size",
    prompt: "Roughly how many people are involved in day-to-day operations?",
    required: true,
    priority: 2,
    isAnswered: (facts, answered) =>
      answered.includes("general-team-size") ||
      answered.includes("employeeCount") ||
      facts["general-team-size"] != null ||
      facts.employeeCount != null,
  },
  {
    fieldId: "general-customer-contact",
    semanticKey: "customer-contact",
    prompt: "How do customers usually reach you — phone, email, walk-ins, or something else?",
    required: true,
    priority: 3,
    isAnswered: (facts, answered) =>
      answered.includes("general-customer-contact") ||
      answered.includes("communicationChannels") ||
      facts["general-customer-contact"] != null ||
      facts.communicationChannels != null,
  },
  {
    fieldId: "general-friction",
    semanticKey: "operational-friction",
    prompt: "What creates the most friction in a typical week?",
    required: true,
    priority: 4,
    isAnswered: (facts, answered) =>
      answered.includes("general-friction") || facts["general-friction"] != null,
  },
];

const INDUSTRY_SEMANTIC_KEYS: Record<string, string> = {
  "dental-providers": "team-size",
  "hvac-technicians": "team-size",
  "aviation-instructors": "team-size",
  "healthcare-providers": "team-size",
  "hospitality-staff": "team-size",
  "general-team-size": "team-size",
  "general-customer-contact": "customer-contact",
  "hvac-scheduling": "customer-contact",
  "hospitality-reservations": "customer-contact",
  "general-friction": "operational-friction",
  "dental-online-booking": "online-booking",
  "aviation-online-booking": "online-booking",
  "healthcare-booking": "online-booking",
  "dental-reminders": "appointment-reminders",
  "healthcare-reminders": "appointment-reminders",
};

export function buildNordiFieldDefinitions(profile: DiscoveryProfile): ConversationFieldDefinition[] {
  const industry = profile.industry ?? "general";
  const industryQuestions = INDUSTRY_QUESTION_BANK.filter(
    (question) => question.industries.includes(industry) || question.industries.includes("general"),
  ).map((question) => ({
    fieldId: question.id,
    semanticKey: INDUSTRY_SEMANTIC_KEYS[question.id] ?? question.id,
    prompt: question.prompt,
    required: true,
    priority: 10 + question.priority,
    isAnswered: (
      _facts: Readonly<Record<string, AccumulatedFact>>,
      answered: readonly string[],
    ) => answered.includes(question.id),
  }));

  return [...CORE_DISCOVERY_FIELDS, ...industryQuestions];
}

function profileExtractedFacts(profile: DiscoveryProfile): ExtractedFactInput[] {
  const extracted: ExtractedFactInput[] = [];

  if (profile.industry) {
    extracted.push({ fieldId: "industry", value: profile.industry, confidence: "high" });
  }
  if (profile.employeeCount != null) {
    extracted.push({
      fieldId: "employeeCount",
      value: profile.employeeCount,
      confidence: "high",
      sourceMessageId: "general-team-size",
    });
    extracted.push({
      fieldId: "general-team-size",
      value: String(profile.employeeCount),
      confidence: "high",
    });
  }
  if (profile.communicationChannels?.length) {
    extracted.push({
      fieldId: "communicationChannels",
      value: profile.communicationChannels,
      confidence: "high",
    });
    extracted.push({
      fieldId: "general-customer-contact",
      value: profile.communicationChannels.join(", "),
      confidence: "high",
    });
  }

  for (const [questionId, answer] of Object.entries(profile.discoveryAnswers ?? {})) {
    extracted.push({ fieldId: questionId, value: answer, confidence: "high" });
  }

  for (const fieldId of profile.answeredQuestions ?? []) {
    const answer = profile.discoveryAnswers?.[fieldId];
    if (answer) {
      extracted.push({ fieldId, value: answer, confidence: "high" });
    } else {
      extracted.push({ fieldId, value: fieldId, confidence: "medium" });
    }
  }

  return extracted;
}

function buildAskedHistory(profile: DiscoveryProfile): ConversationFactMemory["askedQuestionHistory"] {
  const answered = new Set(profile.answeredQuestions ?? []);
  return INDUSTRY_QUESTION_BANK.filter((question) => answered.has(question.id)).map((question) => ({
    fieldId: question.id,
    semanticKey: question.id,
    prompt: question.prompt,
    askedAt: new Date(0).toISOString(),
  }));
}

export function profileToFactMemory(profile: DiscoveryProfile): ConversationFactMemory {
  const merged = mergeExtractedFacts(createEmptyFactMemory(), profileExtractedFacts(profile));
  const fieldDefinitions = buildNordiFieldDefinitions(profile);
  const synced = syncMissingFields(merged, fieldDefinitions);

  return {
    ...synced,
    lastAskedQuestion: profile.pendingQuestionId
      ? INDUSTRY_QUESTION_BANK.find((q) => q.id === profile.pendingQuestionId)?.prompt ?? null
      : null,
    askedQuestionHistory: buildAskedHistory(profile),
  };
}

export function getMissingDiscoveryFields(profile: DiscoveryProfile): DiscoveryField[] {
  const memory = profileToFactMemory(profile);
  const missing: DiscoveryField[] = [];

  if (memory.missingFields.includes("industry")) missing.push("industry");
  if (
    memory.missingFields.includes("general-team-size") ||
    memory.missingFields.includes("employeeCount")
  ) {
    missing.push("employeeCount");
  }
  if (
    memory.missingFields.includes("general-customer-contact") ||
    memory.missingFields.includes("communicationChannels")
  ) {
    missing.push("communicationChannels");
  }
  if (memory.missingFields.includes("general-friction")) {
    missing.push("operationalFriction");
  }

  return missing;
}

export function selectNextNordiQuestion(profile: DiscoveryProfile): ConversationFieldDefinition | null {
  const memory = profileToFactMemory(profile);
  const fieldDefinitions = buildNordiFieldDefinitions(profile);
  return selectNextQuestion(memory, fieldDefinitions).question;
}

export type DiscoveryDecisionLog = {
  message: string;
  extractedFields: Partial<DiscoveryProfile>;
  accumulatedProfile: DiscoveryProfile;
  missingFields: DiscoveryField[];
  nextSelectedQuestion: string | null;
};

export function logDiscoveryDecision(log: DiscoveryDecisionLog): void {
  if (process.env.NORDI_DEBUG !== "1" && process.env.NODE_ENV === "production") return;

  const memory = profileToFactMemory(log.accumulatedProfile);
  const fieldDefinitions = buildNordiFieldDefinitions(log.accumulatedProfile);
  const { skippedRepeatedQuestions } = selectNextQuestion(memory, fieldDefinitions);

  console.info("[Nordi Discovery]", {
    message: log.message,
    extractedFields: log.extractedFields,
    accumulatedFacts: memory.accumulatedFacts,
    answeredFields: memory.answeredFields,
    missingFields: log.missingFields,
    nextSelectedQuestion: log.nextSelectedQuestion,
    skippedRepeatedQuestions,
  });
}
