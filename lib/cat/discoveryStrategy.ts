import type { ConsultantSessionState, LaunchContext, VisitorProfile } from "./consultantTypes";

export interface DiscoveryQuestion {
  id: string;
  question: string;
  purpose: "situation" | "challenge" | "goal" | "general";
}

const AVIATION_SITUATION_QUESTION: DiscoveryQuestion = {
  id: "aviation-situation",
  question:
    "Are you launching a new school, modernizing an existing one, or still exploring the idea?",
  purpose: "situation",
};

const AVIATION_CHALLENGE_QUESTION: DiscoveryQuestion = {
  id: "aviation-challenge",
  question:
    "What is your biggest challenge right now: student acquisition, operations, scheduling, instructor management, or training visibility?",
  purpose: "challenge",
};

const GENERAL_INDUSTRY_QUESTION: DiscoveryQuestion = {
  id: "general-industry",
  question: "What industry are you in, and what prompted you to explore Northbridge today?",
  purpose: "general",
};

const GENERAL_CHALLENGE_QUESTION: DiscoveryQuestion = {
  id: "general-challenge",
  question: "What's the main challenge you're trying to solve right now?",
  purpose: "challenge",
};

const GENERAL_GOAL_QUESTION: DiscoveryQuestion = {
  id: "general-goal",
  question: "What would a successful outcome look like over the next few months?",
  purpose: "goal",
};

export function isAviationContext(profile: VisitorProfile, input: string): boolean {
  const text = `${input} ${profile.signals.join(" ")}`.toLowerCase();
  return (
    profile.industry === "aviation" ||
    /flight school|flight training|aviation|pilot|cfi|fbo|instructor/.test(text)
  );
}

export function extractLaunchContext(
  input: string,
  allowInference = true,
): LaunchContext | undefined {
  const normalized = input.toLowerCase();

  if (/^launching|launching a new|opening a new|starting a new|new school/.test(normalized)) {
    return "new";
  }
  if (/moderniz|existing school|upgrade our|already run|existing one/.test(normalized)) {
    return "modernizing";
  }
  if (/just exploring|still exploring|exploring the idea|early idea|not sure yet/.test(normalized)) {
    return "exploring";
  }

  if (!allowInference) return undefined;

  if (/launching|starting|new school|opening|start a/.test(normalized)) return "new";
  if (/moderniz|existing|upgrade|improve our|already run/.test(normalized)) return "modernizing";
  if (/exploring|thinking about|considering|just looking/.test(normalized)) {
    return "exploring";
  }
  return undefined;
}

export function extractPrimaryChallenge(input: string): string | undefined {
  const normalized = input.toLowerCase();
  const challenges = [
    { key: "student acquisition", patterns: ["student acquisition", "find students", "enrollment"] },
    { key: "operations", patterns: ["operations", "operational"] },
    { key: "scheduling", patterns: ["scheduling", "schedule"] },
    { key: "instructor management", patterns: ["instructor management", "manage instructors", "cfi"] },
    { key: "training visibility", patterns: ["training visibility", "visibility", "tracking progress"] },
    { key: "website", patterns: ["website", "online presence"] },
    { key: "automation", patterns: ["automation", "workflow", "manual"] },
    { key: "lead generation", patterns: ["leads", "lead generation", "customers"] },
  ];

  for (const challenge of challenges) {
    if (challenge.patterns.some((p) => normalized.includes(p))) {
      return challenge.key;
    }
  }

  if (/biggest challenge|main problem|struggling with/.test(normalized)) {
    return normalized.slice(0, 80);
  }

  return undefined;
}

export function getNextDiscoveryQuestion(
  session: ConsultantSessionState,
  input: string,
): DiscoveryQuestion | undefined {
  const { profile, sales } = session;

  if (isAviationContext(profile, input)) {
    if (!sales.launchContext) return AVIATION_SITUATION_QUESTION;
    if (!sales.primaryChallenge && !sales.clarificationComplete) {
      return AVIATION_CHALLENGE_QUESTION;
    }
    return undefined;
  }

  if (!profile.industry && profile.visitorType === "unknown") {
    return GENERAL_INDUSTRY_QUESTION;
  }
  if (profile.problems.length === 0 && !sales.primaryChallenge) {
    return GENERAL_CHALLENGE_QUESTION;
  }
  if (profile.goals.length === 0) {
    return GENERAL_GOAL_QUESTION;
  }

  return undefined;
}

export function updateDiscoveryProgress(
  session: ConsultantSessionState,
  input: string,
): ConsultantSessionState["sales"] {
  const sales = { ...session.sales };
  const profile = session.profile;

  if (!sales.discoveryStarted && session.turnCount >= 1) {
    sales.discoveryStarted = true;
  }

  const launchContext = extractLaunchContext(input, session.turnCount > 1);
  if (launchContext) sales.launchContext = launchContext;

  const challenge = extractPrimaryChallenge(input);
  if (challenge) sales.primaryChallenge = challenge;

  const hasIndustry =
    Boolean(profile.industry) || profile.visitorType !== "unknown" || isAviationContext(profile, input);

  sales.discoveryComplete = Boolean(
    hasIndustry &&
      (sales.launchContext ||
        profile.problems.length > 0 ||
        (!isAviationContext(profile, input) && profile.goals.length > 0)),
  );

  sales.clarificationComplete = Boolean(
    sales.primaryChallenge || profile.problems.length > 0 || profile.goals.length > 0,
  );

  return sales;
}

export function getTeachingSnippet(profile: VisitorProfile, challenge?: string): string {
  if (profile.industry === "aviation" || challenge?.includes("instructor")) {
    return [
      "Northbridge builds and operates real aviation platforms—not just marketing sites.",
      "Aviator Network connects pilots, instructors, and training workflows through profiles, messaging, and operational tools.",
      "For schools modernizing operations, Northbridge Digital Services can also support websites, lead capture, and custom platform work.",
    ].join(" ");
  }

  if (profile.industry === "technology" || profile.problems.some((p) => p.includes("ai"))) {
    return [
      "Northbridge focuses on practical automation and custom software with defined scope—not open-ended AI experiments.",
      "Engagements are structured around clear business outcomes, timelines, and revision rounds.",
    ].join(" ");
  }

  return [
    "Northbridge Venture Group develops ventures and digital infrastructure across aviation, financial services, and professional industries.",
    "We build platforms, websites, automation systems, and mobile applications through structured engagements.",
  ].join(" ");
}

const CHALLENGE_RECOMMENDATION_REASONS: Record<string, Record<string, string>> = {
  "student acquisition": {
    "aviator-network":
      "it connects pilots, instructors, and training workflows in one marketplace — which supports visibility and enrollment for new schools",
    "northbridge-services":
      "Northbridge Digital Services can build lead capture, websites, and enrollment funnels tailored to your market",
  },
  scheduling: {
    "aviator-network":
      "it includes operational tools for coordinating instructors, students, and training sessions",
    "northbridge-services":
      "custom scheduling and workflow automation can be scoped to your school's process",
  },
  "instructor management": {
    "aviator-network":
      "it is built around instructor profiles, messaging, and training marketplace workflows",
  },
  operations: {
    "aviator-network":
      "it consolidates profiles, messaging, logbook, and operational tools for training organizations",
    "northbridge-services":
      "structured platform development can unify the systems your operation depends on",
  },
  "training visibility": {
    "aviator-network":
      "it gives instructors and schools structured profiles and progress-oriented workflows",
  },
};

export function getRecommendationReason(
  challenge: string | undefined,
  productId: string,
): string {
  if (!challenge) {
    return "it aligns with the aviation training workflows you described";
  }
  const normalized = challenge.toLowerCase();
  for (const [key, reasons] of Object.entries(CHALLENGE_RECOMMENDATION_REASONS)) {
    if (normalized.includes(key) && reasons[productId]) {
      return reasons[productId];
    }
  }
  return "it aligns with the challenge you described";
}
