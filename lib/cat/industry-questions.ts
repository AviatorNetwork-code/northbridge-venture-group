import type { DiscoveryProfile } from "@/lib/cat/discovery-types";

export type IndustryQuestion = {
  id: string;
  industries: string[];
  prompt: string;
  priority: number;
};

export const INDUSTRY_QUESTION_BANK: IndustryQuestion[] = [
  {
    id: "dental-online-booking",
    industries: ["dental"],
    prompt: "Do you currently have online appointment booking?",
    priority: 1,
  },
  {
    id: "dental-providers",
    industries: ["dental"],
    prompt: "Approximately how many providers work there?",
    priority: 2,
  },
  {
    id: "dental-reminders",
    industries: ["dental"],
    prompt: "Do you already send appointment reminders to patients?",
    priority: 3,
  },
  {
    id: "hvac-technicians",
    industries: ["hvac"],
    prompt: "How many technicians do you currently employ?",
    priority: 1,
  },
  {
    id: "hvac-scheduling",
    industries: ["hvac"],
    prompt: "How do customers schedule service today?",
    priority: 2,
  },
  {
    id: "hvac-emergency",
    industries: ["hvac"],
    prompt: "Do you provide emergency service?",
    priority: 3,
  },
  {
    id: "aviation-instructors",
    industries: ["aviation"],
    prompt: "Approximately how many instructors do you have?",
    priority: 1,
  },
  {
    id: "aviation-scheduling-software",
    industries: ["aviation"],
    prompt: "Which scheduling software do you currently use?",
    priority: 2,
  },
  {
    id: "aviation-online-booking",
    industries: ["aviation"],
    prompt: "Do students book lessons online?",
    priority: 3,
  },
  {
    id: "hospitality-locations",
    industries: ["hospitality"],
    prompt: "How many locations do you operate?",
    priority: 1,
  },
  {
    id: "hospitality-reservations",
    industries: ["hospitality"],
    prompt: "How do customers make reservations or place orders today?",
    priority: 2,
  },
  {
    id: "hospitality-staff",
    industries: ["hospitality"],
    prompt: "Roughly how many people work across your locations?",
    priority: 3,
  },
  {
    id: "healthcare-providers",
    industries: ["healthcare"],
    prompt: "How many providers or clinicians are on your team?",
    priority: 1,
  },
  {
    id: "healthcare-booking",
    industries: ["healthcare"],
    prompt: "Do patients book appointments online today?",
    priority: 2,
  },
  {
    id: "healthcare-reminders",
    industries: ["healthcare"],
    prompt: "Do you send automated appointment reminders?",
    priority: 3,
  },
  {
    id: "general-team-size",
    industries: ["general"],
    prompt: "Roughly how many people are involved in day-to-day operations?",
    priority: 1,
  },
  {
    id: "general-customer-contact",
    industries: ["general"],
    prompt: "How do customers usually reach you — phone, email, walk-ins, or something else?",
    priority: 2,
  },
  {
    id: "general-friction",
    industries: ["general"],
    prompt: "What creates the most friction in a typical week — scheduling, follow-ups, billing, or something else?",
    priority: 3,
  },
];

export function getNextIndustryQuestion(profile: DiscoveryProfile): IndustryQuestion | null {
  const answered = new Set(profile.answeredQuestions ?? []);
  const industry = profile.industry ?? "general";
  const candidates = INDUSTRY_QUESTION_BANK.filter(
    (question) =>
      (question.industries.includes(industry) || question.industries.includes("general")) &&
      !answered.has(question.id),
  );

  if (industry !== "general") {
    const industrySpecific = candidates
      .filter((question) => question.industries.includes(industry))
      .sort((a, b) => a.priority - b.priority);
    if (industrySpecific.length > 0) return industrySpecific[0];
  }

  const general = candidates
    .filter((question) => question.industries.includes("general"))
    .sort((a, b) => a.priority - b.priority);

  return general[0] ?? null;
}

export function getIndustryQuestionsAnsweredCount(profile: DiscoveryProfile): number {
  const industry = profile.industry;
  if (!industry) return 0;

  const answered = new Set(profile.answeredQuestions ?? []);
  return INDUSTRY_QUESTION_BANK.filter(
    (question) => question.industries.includes(industry) && answered.has(question.id),
  ).length;
}

export function getIndustryLabel(industry?: string): string {
  const labels: Record<string, string> = {
    dental: "Dental Office",
    hvac: "HVAC Company",
    aviation: "Flight School",
    healthcare: "Healthcare Practice",
    hospitality: "Restaurant / Hospitality",
    retail: "Retail Business",
    fitness: "Fitness Business",
    salon: "Salon / Spa",
    "professional-services": "Professional Services",
    general: "Business",
  };

  return labels[industry ?? ""] ?? "Business";
}
