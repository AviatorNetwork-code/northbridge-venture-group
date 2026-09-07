import { escalateToNeoAi } from "@/lib/nordy/ai-adapter";
import { recommendDivisionFromText } from "@/lib/nordy/capability-registry";
import {
  createEmptyFacts,
  factsSummary,
  mergeConversationFacts,
} from "@/lib/nordy/conversation-continuity";
import {
  findCompanyKnowledgeAnswer,
  isSensitiveProbe,
} from "@/lib/nordy/company-knowledge";
import { emitNordyLearningEvidence } from "@/lib/nordy/learning-emitter";
import { entryPathGreeting, retrieveFromNeo } from "@/lib/nordy/neo-retrieval";
import type {
  NordyConversationFacts,
  NordyEntryPath,
  NordyLeadOpportunity,
  NordyTurnResult,
} from "@/lib/nordy/types";

export type NordyEngineState = {
  entryPath: NordyEntryPath;
  facts: NordyConversationFacts;
  turns: number;
};

export function createNordyEngineState(
  entryPath: NordyEntryPath = "GENERAL",
): NordyEngineState {
  return {
    entryPath,
    facts: createEmptyFacts(),
    turns: 0,
  };
}

function nextIntakeQuestion(
  entryPath: NordyEntryPath,
  facts: NordyConversationFacts,
): string | null {
  if (entryPath === "EXPLORE") return null;

  if (entryPath === "ENGINEERING_AI") {
    if (!facts.industry && !facts.company) {
      return "What does your business do, and roughly how many people are involved in the workflow?";
    }
    if (!facts.problem && facts.currentSystems.length === 0) {
      return "What is the main operational friction today — manual work, disconnected systems, or something else?";
    }
    if (!facts.requestedSolution) {
      return "What outcome would make this project successful for you?";
    }
    return null;
  }

  if (entryPath === "DIGITAL") {
    if (!facts.requestedSolution && !facts.needsWebsite && !facts.needsMobile) {
      return "Are you looking for a website, ecommerce, client portal, booking system, or mobile app?";
    }
    if (facts.needsMobile && facts.features.length < 2) {
      return "Which capabilities matter most — auth, booking, payments, notifications, or something else?";
    }
    if (!facts.timeline && !facts.urgency) {
      return "Do you have a target timeline, or is scope clarity the first priority?";
    }
    return null;
  }

  if (!facts.requestedSolution && !facts.problem) {
    return "Are you exploring Northbridge, or do you already know whether you need Digital or Engineering & AI help?";
  }
  return null;
}

function buildLead(
  entryPath: NordyEntryPath,
  facts: NordyConversationFacts,
  utterance: string,
): NordyLeadOpportunity {
  const recommendation = recommendDivisionFromText(
    [utterance, factsSummary(facts), facts.problem, facts.requestedSolution]
      .filter(Boolean)
      .join(" "),
  );

  let fit = recommendation.fit;
  let division = recommendation.division;

  if (entryPath === "ENGINEERING_AI" && fit === "UNKNOWN") {
    fit = "ENGINEERING_AI";
    division = "ENGINEERING_AI";
  }
  if (entryPath === "DIGITAL" && fit === "UNKNOWN") {
    fit = facts.needsMobile || facts.needsWebsite ? "DIGITAL_FAST_PATH" : "DIGITAL_CUSTOM";
    division = "DIGITAL";
  }

  // Restaurant website + menu + booking + payments + basic mobile → fast-path Digital
  if (
    (facts.industry === "restaurant" || /restaurant/i.test(utterance)) &&
    (facts.needsWebsite || facts.needsMobile || facts.needsBooking || facts.needsPayments)
  ) {
    fit = "DIGITAL_FAST_PATH";
    division = "DIGITAL";
  }

  // 30 employees + manual lead intake + CRM + email + scheduling + invoicing → Engineering & AI
  if (
    facts.employeeCount &&
    Number(facts.employeeCount) >= 20 &&
    facts.currentSystems.length >= 2
  ) {
    fit = "ENGINEERING_AI";
    division = "ENGINEERING_AI";
  }

  const summary =
    factsSummary(facts) ||
    "Prospect conversation in progress — details still being collected.";

  return {
    visitorType: entryPath === "EXPLORE" ? "explorer" : "service_prospect",
    entryPath,
    company: facts.company,
    industry: facts.industry,
    problem: facts.problem,
    requestedSolution: facts.requestedSolution,
    currentSystems: facts.currentSystems,
    integrations: facts.integrations,
    urgency: facts.urgency,
    budgetRange: facts.budgetRange,
    fit,
    recommendedDivision: division,
    recommendedNextStep:
      division === "ENGINEERING_AI"
        ? "ENGINEERING_AUDIT"
        : division === "DIGITAL"
          ? "DIGITAL_PROJECT"
          : "HUMAN_FOLLOW_UP",
    summary,
  };
}

export function getNordyGreeting(entryPath: NordyEntryPath): string {
  return entryPathGreeting(entryPath);
}

export async function processNordyTurn(
  state: NordyEngineState,
  utterance: string,
): Promise<{ state: NordyEngineState; result: NordyTurnResult }> {
  const facts = mergeConversationFacts(state.facts, utterance);
  const turns = state.turns + 1;
  const entryPath = state.entryPath;

  if (isSensitiveProbe(utterance)) {
    const result: NordyTurnResult = {
      reply:
        "I cannot share internal secrets, credentials, private NEO architecture, or customer data. I can help with public Northbridge capabilities, ventures, and project intake instead.",
      entryPath,
      facts,
      usedAi: false,
      aiGapClass: "NONE",
      confidence: "high",
      handoffSuggested: false,
      refusedSensitive: true,
      source: "company_knowledge",
    };
    emitNordyLearningEvidence({
      entryPath,
      intent: "sensitive_probe",
      aiEscalated: false,
      gapClass: "NONE",
      retrievalPath: "company_knowledge",
      result: "refused",
      reusableGap: false,
      outcome: "security_refuse",
    });
    return { state: { entryPath, facts, turns }, result };
  }

  const knowledge = findCompanyKnowledgeAnswer(utterance);
  if (knowledge) {
    const question = nextIntakeQuestion(entryPath, facts);
    const reply = question ? `${knowledge.answer}\n\n${question}` : knowledge.answer;
    const lead = turns >= 2 ? buildLead(entryPath, facts, utterance) : undefined;
    const result: NordyTurnResult = {
      reply,
      entryPath,
      facts,
      lead,
      usedAi: false,
      aiGapClass: "NONE",
      confidence: "high",
      handoffSuggested: Boolean(lead && lead.fit !== "UNKNOWN" && lead.fit !== "EXPLORE_ONLY"),
      refusedSensitive: false,
      source: "company_knowledge",
    };
    emitNordyLearningEvidence({
      entryPath,
      intent: knowledge.topic,
      aiEscalated: false,
      gapClass: "NONE",
      retrievalPath: "company_knowledge",
      result: "answered",
      reusableGap: false,
      outcome: knowledge.id,
    });
    return { state: { entryPath, facts, turns }, result };
  }

  // Continue intake when we can ask one useful question
  const intakeQuestion = nextIntakeQuestion(entryPath, facts);
  const carried = factsSummary(facts);
  if (intakeQuestion && (entryPath === "ENGINEERING_AI" || entryPath === "DIGITAL" || carried)) {
    const prefix = carried
      ? `Understood — I am tracking ${carried}.`
      : entryPath === "ENGINEERING_AI"
        ? "Understood."
        : "Got it.";
    const lead = buildLead(entryPath, facts, utterance);
    const result: NordyTurnResult = {
      reply: `${prefix} ${intakeQuestion}`,
      entryPath,
      facts,
      lead,
      usedAi: false,
      aiGapClass: "NONE",
      confidence: "medium",
      handoffSuggested: false,
      refusedSensitive: false,
      source: "conversation",
    };
    emitNordyLearningEvidence({
      entryPath,
      intent: "intake",
      aiEscalated: false,
      gapClass: "NONE",
      retrievalPath: "none",
      result: "answered",
      reusableGap: false,
    });
    return { state: { entryPath, facts, turns }, result };
  }

  // Neo retrieval then AI fallback
  const retrieval = await retrieveFromNeo(utterance);
  if (retrieval.status === "ok" && retrieval.snippets[0]) {
    const result: NordyTurnResult = {
      reply: retrieval.snippets[0],
      entryPath,
      facts,
      lead: buildLead(entryPath, facts, utterance),
      usedAi: false,
      aiGapClass: "NONE",
      confidence: "medium",
      handoffSuggested: false,
      refusedSensitive: false,
      source: "neo_retrieval",
    };
    emitNordyLearningEvidence({
      entryPath,
      intent: "neo_retrieval",
      aiEscalated: false,
      gapClass: "NONE",
      retrievalPath: "neo_retrieval",
      result: "answered",
      reusableGap: false,
    });
    return { state: { entryPath, facts, turns }, result };
  }

  const gapClass =
    retrieval.status === "miss"
      ? "RETRIEVAL_MISS"
      : retrieval.status === "unavailable"
        ? "KNOWLEDGE_MISSING"
        : "AI_REQUIRED_FOR_REASONING";

  const ai = await escalateToNeoAi({
    prompt: utterance,
    contextSummary: carried,
    entryPath,
    gapClass,
  });

  const lead = buildLead(entryPath, facts, utterance);
  const result: NordyTurnResult = {
    reply: ai.text,
    entryPath,
    facts,
    lead,
    usedAi: true,
    aiGapClass: gapClass,
    confidence: "low",
    handoffSuggested: true,
    refusedSensitive: false,
    source: "neo_ai",
  };

  emitNordyLearningEvidence({
    entryPath,
    intent: "ai_escalation",
    aiEscalated: true,
    gapClass,
    retrievalPath: "neo_ai",
    result: "escalated",
    reusableGap: true,
    outcome: ai.provider,
  });

  return { state: { entryPath, facts, turns }, result };
}
