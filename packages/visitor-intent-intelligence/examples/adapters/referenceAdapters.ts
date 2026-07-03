/**
 * Reference adapter examples — NOT imported by the VII core engine.
 * Product teams copy or extend these in their own repositories.
 */
import type {
  AdapterContext,
  AdapterSignals,
  IntentEvidence,
  VisitorIntentAdapter,
  VIIEvent,
} from "../../src/types/adapter.js";
import type { IntentDefinition } from "../../src/types/intent.js";

function baseNormalize(
  productId: string,
  raw: unknown,
  sessionId: string,
): VIIEvent | null {
  if (!raw || typeof raw !== "object") return null;
  const event = raw as Record<string, unknown>;
  const type = String(event.type ?? "adapter");
  const timestamp = Number(event.timestamp ?? Date.now());

  const journeyTypeMap: Record<string, VIIEvent["type"]> = {
    page_view: "page_view",
    navigation: "navigation",
    cat_opened: "cat_opened",
    cat_message_sent: "cat_message",
    cat_question_selected: "cat_message",
    cat_cta_clicked: "cat_cta_clicked",
    cat_closed: "cat_closed",
    form_submit: "form_submit",
    search: "search",
  };

  return {
    productId,
    sessionId,
    rawType: type,
    type: journeyTypeMap[type] ?? "adapter",
    timestamp,
    path: event.path ? String(event.path) : undefined,
    label: event.label ? String(event.label) : undefined,
    metadata: (event.metadata as VIIEvent["metadata"]) ?? {},
  };
}

function baseExtractSignals(context: AdapterContext): AdapterSignals {
  const paths = context.events
    .map((e) => e.path)
    .filter((p): p is string => Boolean(p));

  const catMessages = context.events
    .filter((e) => e.type === "cat_message" && e.metadata?.role !== "cat")
    .map((e) => String(e.metadata?.content ?? e.label ?? ""));

  const searchQueries = context.events
    .filter((e) => e.type === "search")
    .map((e) => String(e.label ?? ""));

  const formActions = context.events
    .filter((e) => e.type === "form_submit")
    .map((e) => String(e.label ?? "form_submit"));

  return {
    paths,
    catMessages,
    searchQueries,
    formActions,
    metadata: {},
  };
}

function baseMapSignalsToEvidence(
  signals: AdapterSignals,
  catalog: IntentDefinition[],
): IntentEvidence[] {
  const evidence: IntentEvidence[] = [];
  const timestamp = Date.now();

  for (const path of signals.paths) {
    for (const intent of catalog) {
      for (const keyword of intent.keywords ?? []) {
        if (path.toLowerCase().includes(keyword.toLowerCase())) {
          evidence.push({
            source: "navigation",
            signal: path,
            weight: 0.75,
            timestamp,
            supports: intent.id,
          });
        }
      }
    }
  }

  for (const message of signals.catMessages) {
    for (const intent of catalog) {
      for (const keyword of intent.keywords ?? []) {
        if (message.toLowerCase().includes(keyword.toLowerCase())) {
          evidence.push({
            source: "cat",
            signal: message,
            weight: 1.25,
            timestamp,
            supports: intent.id,
          });
        }
      }
    }
  }

  return evidence;
}

/** Northbridge Website adapter example. */
export const northbridgeWebsiteAdapter: VisitorIntentAdapter = {
  productId: "northbridge-website",
  displayName: "Northbridge Website",

  getIntentCatalog(): IntentDefinition[] {
    return [
      {
        id: "northbridge-website.services_inquiry",
        label: "Services inquiry",
        description: "Visitor exploring Northbridge digital infrastructure services.",
        category: "compare_services",
        keywords: ["/services", "website development", "digital infrastructure"],
      },
    ];
  },

  normalizeEvent(raw, sessionId) {
    const event = baseNormalize("northbridge-website", raw, sessionId);
    if (event?.type === "cat_message" && event.rawType === "cat_message_sent") {
      event.metadata = { ...event.metadata, role: "visitor" };
    }
    return event;
  },

  extractSignals: baseExtractSignals,
  mapSignalsToEvidence: baseMapSignalsToEvidence,

  detectCompletedObjectives(context) {
    const completed: string[] = [];
    if (context.events.some((e) => e.type === "cat_cta_clicked")) {
      completed.push("cta_engaged");
    }
    if (context.events.some((e) => e.path === "/contact")) {
      completed.push("reached_contact");
    }
    return completed;
  },
};

/** Aviator Network adapter example. */
export const aviatorNetworkAdapter: VisitorIntentAdapter = {
  productId: "aviator-network",
  displayName: "Aviator Network",

  getIntentCatalog(): IntentDefinition[] {
    return [
      {
        id: "aviator-network.instructor_search",
        label: "Instructor search",
        description: "Pilot searching for a flight instructor.",
        category: "find_instructor",
        keywords: ["instructor", "cfi", "marketplace", "find instructor"],
      },
      {
        id: "aviator-network.student_onboarding",
        label: "Student onboarding",
        description: "Visitor beginning student onboarding flow.",
        category: "flight_training",
        keywords: ["onboard", "student", "sign up", "register"],
      },
    ];
  },

  normalizeEvent(raw, sessionId) {
    return baseNormalize("aviator-network", raw, sessionId);
  },

  extractSignals: baseExtractSignals,
  mapSignalsToEvidence: baseMapSignalsToEvidence,

  detectCompletedObjectives(context) {
    const completed: string[] = [];
    if (context.events.some((e) => String(e.path).includes("marketplace"))) {
      completed.push("entered_marketplace");
    }
    return completed;
  },

  extractBusinessSignals(context) {
    if (context.events.some((e) => e.type === "form_submit")) {
      return [
        {
          type: "lead_generated",
          timestamp: Date.now(),
          value: 10,
        },
      ];
    }
    return [];
  },
};

/** Quadrix adapter example. */
export const quadrixAdapter: VisitorIntentAdapter = {
  productId: "quadrix",
  displayName: "Quadrix",

  getIntentCatalog(): IntentDefinition[] {
    return [
      {
        id: "quadrix.assessment_start",
        label: "Assessment start",
        description: "Visitor beginning a Quadrix assessment flow.",
        category: "general_research",
        keywords: ["assessment", "quadrix", "evaluate", "readiness"],
      },
    ];
  },

  normalizeEvent(raw, sessionId) {
    return baseNormalize("quadrix", raw, sessionId);
  },

  extractSignals: baseExtractSignals,
  mapSignalsToEvidence: baseMapSignalsToEvidence,

  classifyOutcomeHints(context) {
    if (context.events.some((e) => String(e.path).includes("assessment"))) {
      return {
        classification: "started_onboarding",
        objectiveAchieved: false,
      };
    }
    return {};
  },
};
