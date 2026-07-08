// NEO Light Bridge — Northbridge Workforce Advisor domain logic.
//
// This is a local, dependency-free implementation of the workforce-sizing
// capability that will later live inside NEO as a reusable "workforce advisor"
// capability (see docs/CAT-WORKFORCE-ADVISOR-BRIDGE.md). It intentionally has
// NO side effects: no installs, no billing, no database. Given a description of
// a business it returns a structured, trust-first recommendation.
//
// Design rules encoded here:
//   1. Recommend the SMALLEST useful solution.
//   2. Never oversell — if the customer asks for more than they need, say so.
//   3. Explain when a request actually belongs to another Specialist/Team.

import { industries, pricingRegions, type Industry } from "@/lib/workforce";

export type WorkforceLevel = "Specialist" | "Team" | "Manager" | "Regional Manager";
export type Region = "CO" | "US";
export type Volume = "low" | "medium" | "high";

export type AdvisorInput = {
  message?: string;
  industry?: string;
  requestedPlan?: WorkforceLevel;
  locations?: number;
  teamsInUse?: number;
  volume?: Volume;
  region?: Region;
};

export type AdvisorRecommendation = {
  recommendedPlan: WorkforceLevel;
  requestedPlan: WorkforceLevel | null;
  why: string;
  notRecommended: string;
  nextStep: string;
  estimatedTeamTasks: string;
  scopeNote: string | null;
  industry: Industry | null;
  pricing: {
    region: string;
    regionCode: Region;
    startingPrice: string;
    note: string;
  };
  disclaimer: string;
};

const LEVEL_RANK: Record<WorkforceLevel, number> = {
  Specialist: 1,
  Team: 2,
  Manager: 3,
  "Regional Manager": 4,
};

const REGION_NAME: Record<Region, string> = {
  CO: "Colombia",
  US: "United States",
};

// Which Specialist "handles" a kind of task — used to explain scope/authority.
const SPECIALTY_KEYWORDS: Record<string, string[]> = {
  "Billing Specialist": ["invoice", "billing", "payment", "collections", "refund"],
  "Appointment Specialist": [
    "appointment",
    "schedule",
    "scheduling",
    "booking",
    "reservation",
    "calendar",
  ],
  "Support Specialist": ["question", "support", "complaint", "chat", "call", "phone"],
  "Marketing Specialist": ["promotion", "marketing", "campaign", "ad ", "ads", "social"],
};

function normalize(text: string): string {
  return ` ${text.toLowerCase()} `;
}

function detectIndustry(input: AdvisorInput): Industry | null {
  const hay = normalize(`${input.industry ?? ""} ${input.message ?? ""}`);
  // Prefer the longest industry name match so "dental clinic" wins over generic.
  const sorted = [...industries].sort((a, b) => b.name.length - a.name.length);
  for (const industry of sorted) {
    if (hay.includes(industry.name.toLowerCase())) return industry;
  }
  // A few common aliases.
  if (hay.includes("dental") || hay.includes("dentist")) {
    return industries.find((i) => i.name === "Dental Clinic") ?? null;
  }
  if (hay.includes("restaurant") || hay.includes("cafe") || hay.includes("diner")) {
    return industries.find((i) => i.name === "Restaurant") ?? null;
  }
  if (hay.includes("drug test") || hay.includes("testing facility")) {
    return industries.find((i) => i.name === "Drug Testing Facility") ?? null;
  }
  if (hay.includes("flight") || hay.includes("aviation") || hay.includes("pilot")) {
    return industries.find((i) => i.name === "Flight School") ?? null;
  }
  return null;
}

function detectVolume(input: AdvisorInput): Volume {
  if (input.volume) return input.volume;
  const hay = normalize(input.message ?? "");
  if (
    /slammed|overwhelmed|backed up|too many|high volume|busy|growing fast|can'?t keep up/.test(
      hay,
    )
  ) {
    return "high";
  }
  if (/slow|quiet|just start|brand new|small|low volume|part[- ]time/.test(hay)) {
    return "low";
  }
  return "medium";
}

function detectLocations(input: AdvisorInput): number {
  if (typeof input.locations === "number") return input.locations;
  const hay = normalize(input.message ?? "");
  const numeric = hay.match(/(\d+)\s*(locations|offices|clinics|branches|sites|stores)/);
  if (numeric) return Math.max(1, parseInt(numeric[1], 10));
  if (/multiple|several|various|many/.test(hay) && /location|office|clinic|branch|site|store/.test(hay)) {
    return 2;
  }
  return 1;
}

function detectSpecialties(message: string): string[] {
  const hay = normalize(message);
  const found: string[] = [];
  for (const [specialist, keywords] of Object.entries(SPECIALTY_KEYWORDS)) {
    if (keywords.some((k) => hay.includes(k))) found.push(specialist);
  }
  return found;
}

function estimatedTeamTasks(plan: WorkforceLevel): string {
  switch (plan) {
    case "Specialist":
      return "≈ 100–400 Team Tasks / month";
    case "Team":
      return "≈ 400–1,500 Team Tasks / month";
    case "Manager":
      return "≈ 1,500–5,000 Team Tasks / month";
    case "Regional Manager":
      return "≈ 5,000+ Team Tasks / month";
  }
}

function pricingFor(plan: WorkforceLevel, region: Region) {
  const regionData =
    pricingRegions.find((r) => r.region === REGION_NAME[region]) ?? pricingRegions[0];
  const row = regionData.rows.find((r) => r.tier === plan);
  return {
    region: regionData.region,
    regionCode: region,
    startingPrice: row?.price ?? "contact us",
    note: regionData.note,
  };
}

export function recommendWorkforce(input: AdvisorInput): AdvisorRecommendation {
  const region: Region = input.region === "US" ? "US" : input.region === "CO" ? "CO" : "US";
  const industry = detectIndustry(input);
  const volume = detectVolume(input);
  const locations = detectLocations(input);
  const teamsInUse = typeof input.teamsInUse === "number" ? input.teamsInUse : 0;
  const requestedPlan = input.requestedPlan ?? null;
  const specialties = detectSpecialties(input.message ?? "");

  // --- Smallest-useful-solution decision ---------------------------------
  let plan: WorkforceLevel = "Specialist";
  if (volume === "high") plan = "Team";
  // A Manager only earns its cost once at least one full Team/location exists.
  if (teamsInUse >= 1 && (volume === "high" || locations === 1)) plan = "Manager";
  // A Regional Manager only when supervising multiple locations/managers.
  if (locations >= 2) plan = "Regional Manager";

  // --- Why -----------------------------------------------------------------
  const starterName = industry ? industry.starter : "a single Specialist";
  const whyByPlan: Record<WorkforceLevel, string> = {
    Specialist: `Your workload points to one focused role. Starting with ${starterName} covers the task that's actually piling up, at the lowest cost, and you can grow later.`,
    Team: `Your volume is high enough that one Specialist would fall behind. ${
      industry ? `A ${industry.team} ` : "A Team led by a Team Leader "
    }keeps related work moving together without dropping details.`,
    Manager: `You're already running a full Team/location, so a Manager is justified to supervise the day-to-day and keep the work aligned to your goals.`,
    "Regional Manager": `With ${locations} locations to coordinate, a Regional Manager is the right layer to oversee your Managers consistently across sites.`,
  };

  // --- Anti-oversell -------------------------------------------------------
  let notRecommended: string;
  if (requestedPlan && LEVEL_RANK[requestedPlan] > LEVEL_RANK[plan]) {
    if (industry && industry.name === "Dental Clinic" && requestedPlan === "Team") {
      notRecommended = `You selected a full Dental Clinic Team, but based on what you've told me, I recommend starting with the Appointment Specialist and Billing Specialist first. You can add the rest of the Patient Team later if the volume calls for it.`;
    } else {
      notRecommended = `I don't recommend a ${requestedPlan} yet — that's more than your current workload justifies. Start with the ${plan} and upgrade only once it's consistently busy.`;
    }
  } else {
    const nextUp: Partial<Record<WorkforceLevel, WorkforceLevel>> = {
      Specialist: "Team",
      Team: "Manager",
      Manager: "Regional Manager",
    };
    const up = nextUp[plan];
    notRecommended = up
      ? `I won't push you to a ${up} yet. We'll only add that layer when your workload clearly needs it.`
      : `This is already the top coordination layer — there's nothing larger to upsell you into.`;
  }

  // --- Scope / authority ---------------------------------------------------
  let scopeNote: string | null = null;
  if (specialties.length >= 2) {
    scopeNote = `Heads up: ${specialties
      .slice(0, 3)
      .join(", ")} are handled by different Specialists. Start with the one that's busiest; the others belong to their own Specialist and can join later as a Team.`;
  } else if (plan === "Specialist" && industry) {
    scopeNote = `If a request falls outside your ${industry.starter}'s job, CAT will route it to the right Specialist rather than overload one role.`;
  }

  // --- Next step -----------------------------------------------------------
  const pricing = pricingFor(plan, region);
  const nextStep =
    plan === "Specialist"
      ? `Start your ${industry ? industry.starter : "first Specialist"} (${pricing.startingPrice}, ${pricing.region} early access). No billing is connected yet — talk to our team to activate.`
      : `Set up your ${plan} (${pricing.startingPrice}, ${pricing.region} early access). No billing is connected yet — talk to our team to activate.`;

  return {
    recommendedPlan: plan,
    requestedPlan,
    why: whyByPlan[plan],
    notRecommended,
    nextStep,
    estimatedTeamTasks: estimatedTeamTasks(plan),
    scopeNote,
    industry,
    pricing,
    disclaimer:
      "Recommendation generated by CAT using Northbridge workforce logic (NEO light bridge). Early access pricing; no real install or billing is performed.",
  };
}
