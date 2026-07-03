import type { CORE_INTENT_CATEGORIES, IntentDefinition } from "../types/intent.js";

/** Default core intent catalog — adapters may extend, not replace. */
export const DEFAULT_INTENT_CATALOG: IntentDefinition[] = [
  {
    id: "learn_about_company",
    label: "Learn about the company",
    description: "Visitor wants to understand Northbridge and its mission.",
    category: "learn_about_company",
    keywords: ["about", "northbridge", "who are you", "company", "venture group"],
  },
  {
    id: "explore_products",
    label: "Explore products",
    description: "Visitor is browsing offerings and platforms.",
    category: "explore_products",
    keywords: ["products", "ventures", "portfolio", "offerings", "platforms"],
  },
  {
    id: "compare_services",
    label: "Compare services",
    description: "Visitor is evaluating service tiers or options.",
    category: "compare_services",
    keywords: ["compare", "pricing", "services", "tiers", "options"],
  },
  {
    id: "evaluate_ai_capabilities",
    label: "Evaluate AI capabilities",
    description: "Visitor is exploring AI or automation support.",
    category: "evaluate_ai_capabilities",
    keywords: ["ai", "automation", "machine learning", "chatbot", "intelligent"],
  },
  {
    id: "request_software_development",
    label: "Request software development",
    description: "Visitor needs custom software or platform development.",
    category: "request_software_development",
    keywords: ["develop", "build", "software", "platform", "custom", "project"],
  },
  {
    id: "become_customer",
    label: "Become a customer",
    description: "Visitor intends to purchase or engage services.",
    category: "become_customer",
    keywords: ["buy", "hire", "customer", "consultation", "request"],
  },
  {
    id: "become_partner",
    label: "Become a partner",
    description: "Visitor explores partnership or collaboration.",
    category: "become_partner",
    keywords: ["partner", "partnership", "collaborate", "founder", "equity"],
  },
  {
    id: "career_exploration",
    label: "Career exploration",
    description: "Visitor is exploring career or hiring opportunities.",
    category: "career_exploration",
    keywords: ["career", "jobs", "hiring", "work with"],
  },
  {
    id: "flight_training",
    label: "Flight training",
    description: "Visitor is interested in flight training services.",
    category: "flight_training",
    keywords: ["flight training", "pilot training", "flight school", "cfi"],
  },
  {
    id: "find_instructor",
    label: "Find an instructor",
    description: "Visitor wants to connect with a flight instructor.",
    category: "find_instructor",
    keywords: ["instructor", "cfi", "find instructor", "flight instructor"],
  },
  {
    id: "find_flight_school",
    label: "Find a flight school",
    description: "Visitor is looking for a flight school.",
    category: "find_flight_school",
    keywords: ["flight school", "training school", "aviation school"],
  },
  {
    id: "learn_about_cat",
    label: "Learn about CAT",
    description: "Visitor wants to understand the assistant experience.",
    category: "learn_about_cat",
    keywords: ["cat", "assistant", "chat", "help bot"],
  },
  {
    id: "general_research",
    label: "General research",
    description: "Broad informational browsing without clear conversion intent.",
    category: "general_research",
    keywords: ["learn", "research", "information", "explore"],
  },
  {
    id: "unknown_intent",
    label: "Unknown intent",
    description: "Intent could not be determined with sufficient confidence.",
    category: "unknown_intent",
    keywords: [],
  },
];

export function mergeIntentCatalog(
  adapterIntents: IntentDefinition[],
): IntentDefinition[] {
  const byId = new Map<string, IntentDefinition>();
  for (const intent of DEFAULT_INTENT_CATALOG) {
    byId.set(intent.id, intent);
  }
  for (const intent of adapterIntents) {
    byId.set(intent.id, intent);
  }
  return [...byId.values()];
}

export type { CORE_INTENT_CATEGORIES };
