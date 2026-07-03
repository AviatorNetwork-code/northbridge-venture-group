import type { VisitorProfile, VisitorType } from "./consultantTypes";

interface IntentMatch {
  intent: string;
  weight: number;
}

const VISITOR_TYPE_PATTERNS: Array<{ type: VisitorType; patterns: string[] }> = [
  { type: "founder", patterns: ["founder", "startup", "my idea", "co-build"] },
  { type: "business_owner", patterns: ["my business", "our company", "we run", "owner"] },
  { type: "operator", patterns: ["flight school", "fbo", "training organization", "operator"] },
  { type: "pilot", patterns: ["pilot", "cfi", "instructor", "student pilot"] },
  { type: "student", patterns: ["learning to fly", "student", "training for"] },
  { type: "enterprise", patterns: ["enterprise", "large organization", "corporation"] },
  { type: "researcher", patterns: ["research", "learning about", "just browsing"] },
];

const INDUSTRY_PATTERNS: Array<{ industry: string; patterns: string[] }> = [
  { industry: "aviation", patterns: ["aviation", "flight", "pilot", "aircraft", "fbo"] },
  { industry: "financial_services", patterns: ["financial", "tax", "accounting", "finance"] },
  { industry: "professional_services", patterns: ["consulting", "professional services", "agency"] },
  { industry: "transportation", patterns: ["transportation", "logistics", "fleet"] },
  { industry: "technology", patterns: ["software", "saas", "platform", "tech"] },
];

const PROBLEM_PATTERNS = [
  "need a website",
  "need help with",
  "struggling with",
  "problem is",
  "challenge",
  "can't find",
  "looking for",
  "want to build",
  "need automation",
  "need ai",
];

const GOAL_PATTERNS = [
  "want to",
  "trying to",
  "goal is",
  "need to",
  "grow",
  "launch",
  "scale",
  "improve",
  "convert",
  "get more leads",
];

const URGENCY_PATTERNS: Array<{ level: VisitorProfile["urgency"]; patterns: string[] }> = [
  { level: "high", patterns: ["urgent", "asap", "soon", "this month", "deadline"] },
  { level: "medium", patterns: ["next quarter", "planning", "evaluating"] },
  { level: "low", patterns: ["just exploring", "early stage", "no rush"] },
];

const BUYING_SIGNALS = [
  "pricing",
  "how much",
  "consultation",
  "meeting",
  "contact",
  "hire",
  "get started",
  "sign up",
  "demo",
];

const OBJECTIONS = [
  "too expensive",
  "not sure",
  "competitor",
  "already have",
  "don't need",
  "maybe later",
];

export function detectIntents(input: string): IntentMatch[] {
  const normalized = input.toLowerCase();
  const intents: IntentMatch[] = [];

  const catalog: Array<{ intent: string; keywords: string[] }> = [
    { intent: "learn_about_company", keywords: ["what is northbridge", "who are you", "tell me about"] },
    { intent: "explore_products", keywords: ["products", "services", "offerings", "what do you do"] },
    { intent: "aviation", keywords: ["flight school", "pilot", "aviation", "instructor", "cfi"] },
    { intent: "ai_automation", keywords: ["ai", "automation", "machine learning", "chatbot"] },
    { intent: "website_development", keywords: ["website", "web design", "online presence"] },
    { intent: "partnership", keywords: ["partner", "founder", "venture", "equity"] },
    { intent: "product_fit", keywords: ["right for me", "which product", "recommend", "best fit"] },
    { intent: "contact", keywords: ["contact", "email", "talk to", "consultation", "meeting"] },
    { intent: "trust_skepticism", keywords: ["why should i trust", "proof", "credentials", "different"] },
  ];

  for (const entry of catalog) {
    for (const keyword of entry.keywords) {
      if (normalized.includes(keyword)) {
        intents.push({ intent: entry.intent, weight: keyword.split(" ").length });
      }
    }
  }

  return intents.sort((a, b) => b.weight - a.weight);
}

export function extractProfileSignals(
  input: string,
  profile: VisitorProfile,
): VisitorProfile {
  const normalized = input.toLowerCase();
  const updated: VisitorProfile = {
    ...profile,
    problems: [...profile.problems],
    goals: [...profile.goals],
    signals: [...profile.signals, normalized.slice(0, 120)],
  };

  for (const { type, patterns } of VISITOR_TYPE_PATTERNS) {
    if (patterns.some((p) => normalized.includes(p))) {
      updated.visitorType = type;
    }
  }

  for (const { industry, patterns } of INDUSTRY_PATTERNS) {
    if (patterns.some((p) => normalized.includes(p))) {
      updated.industry = industry;
    }
  }

  for (const pattern of PROBLEM_PATTERNS) {
    if (normalized.includes(pattern) && !updated.problems.includes(pattern)) {
      updated.problems.push(pattern);
    }
  }

  for (const pattern of GOAL_PATTERNS) {
    if (normalized.includes(pattern) && !updated.goals.includes(pattern)) {
      updated.goals.push(pattern);
    }
  }

  for (const { level, patterns } of URGENCY_PATTERNS) {
    if (patterns.some((p) => normalized.includes(p))) {
      updated.urgency = level;
    }
  }

  if (/budget|cost|price|afford/.test(normalized)) {
    updated.budgetMentioned = true;
  }

  if (/beginner|new to|first time|never/.test(normalized)) {
    updated.experienceLevel = "new";
  } else if (/experienced|already|years/.test(normalized)) {
    updated.experienceLevel = "advanced";
  }

  if (/small team|solo|just me|startup/.test(normalized)) {
    updated.companySize = "solo";
  } else if (/enterprise|large company|corporation/.test(normalized)) {
    updated.companySize = "enterprise";
  } else if (/team|company|organization/.test(normalized)) {
    updated.companySize = "small";
  }

  return updated;
}

export function extractBuyingSignals(input: string): string[] {
  const normalized = input.toLowerCase();
  return BUYING_SIGNALS.filter((s) => normalized.includes(s));
}

export function extractObjections(input: string): string[] {
  const normalized = input.toLowerCase();
  return OBJECTIONS.filter((s) => normalized.includes(s));
}

export function isQuestion(input: string): boolean {
  return input.trim().includes("?");
}
