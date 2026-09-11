import type { NordyFit, NordyRecommendedDivision } from "@/lib/nordy/types";

export type CapabilityOffering = {
  id: string;
  division: "ENGINEERING_AI" | "DIGITAL" | "VENTURES";
  title: string;
  summary: string;
  outcomes: string[];
  keywords: string[];
};

export const capabilityRegistry: CapabilityOffering[] = [
  {
    id: "systems-audit",
    division: "ENGINEERING_AI",
    title: "Business Systems Audit",
    summary: "Map workflows, systems, and friction before building.",
    outcomes: ["Clear systems map", "Prioritized automation opportunities"],
    keywords: ["audit", "systems audit", "assessment"],
  },
  {
    id: "ai-intelligent-systems",
    division: "ENGINEERING_AI",
    title: "AI & Intelligent Systems",
    summary: "Integrate AI into real operations with governed outcomes.",
    outcomes: ["AI copilots", "Intelligent intake", "Decision support"],
    keywords: ["ai", "copilot", "intelligent"],
  },
  {
    id: "business-automation",
    division: "ENGINEERING_AI",
    title: "Business Automation",
    summary: "Replace manual handoffs with reliable operational software.",
    outcomes: ["Fewer manual steps", "Connected workflows"],
    keywords: ["automation", "workflow", "manual"],
  },
  {
    id: "custom-software",
    division: "ENGINEERING_AI",
    title: "Custom Software & SaaS",
    summary: "Internal platforms and custom SaaS built for your operation.",
    outcomes: ["Custom platforms", "Operational SaaS"],
    keywords: ["custom software", "saas", "internal system"],
  },
  {
    id: "system-integration",
    division: "ENGINEERING_AI",
    title: "System Integration",
    summary: "Connect CRM, email, scheduling, invoicing, and data flows.",
    outcomes: ["Integrated systems", "Less duplicate entry"],
    keywords: ["integration", "crm", "connect"],
  },
  {
    id: "business-website",
    division: "DIGITAL",
    title: "Business Website",
    summary: "Premium websites with clear conversion paths.",
    outcomes: ["Launch-ready site", "Mobile-first experience"],
    keywords: ["website", "landing"],
  },
  {
    id: "ecommerce",
    division: "DIGITAL",
    title: "Ecommerce",
    summary: "Catalog, checkout, and payment-ready storefronts.",
    outcomes: ["Online sales", "Payment flows"],
    keywords: ["ecommerce", "store", "shop"],
  },
  {
    id: "client-portal",
    division: "DIGITAL",
    title: "Client Portal",
    summary: "Authenticated portals for customers and partners.",
    outcomes: ["Secure login", "Self-serve workflows"],
    keywords: ["portal", "client portal"],
  },
  {
    id: "booking-payments",
    division: "DIGITAL",
    title: "Booking & Payments",
    summary: "Scheduling and payment experiences for service businesses.",
    outcomes: ["Online booking", "Payment collection"],
    keywords: ["booking", "payments", "schedule"],
  },
  {
    id: "mobile-app-launch",
    division: "DIGITAL",
    title: "Mobile App Launch",
    summary: "Production-ready iOS and Android apps built in days, not months.",
    outcomes: ["iOS + Android", "Store submission prep"],
    keywords: ["mobile", "ios", "android", "app"],
  },
];

export function matchCapabilities(text: string): CapabilityOffering[] {
  const normalized = text.toLowerCase();
  return capabilityRegistry.filter((offering) =>
    offering.keywords.some((keyword) => normalized.includes(keyword)),
  );
}

/** True when the utterance is asking about offerings rather than narrating intake facts. */
export function isCapabilityInquiry(text: string): boolean {
  return /\b(can you|do you|offer|offers|capability|capabilities|services|what.*(build|provide|help)|tell me about|help with)\b/i.test(
    text,
  );
}

export function answerFromCapabilityRegistry(
  text: string,
): { reply: string; ids: string[] } | null {
  if (!isCapabilityInquiry(text)) return null;
  const matches = matchCapabilities(text);
  if (matches.length === 0) return null;

  const top = matches.slice(0, 3);
  const lines = top.map(
    (offering) =>
      `• ${offering.title} (${offering.division.replace("_", " ")}): ${offering.summary}`,
  );

  return {
    ids: top.map((offering) => offering.id),
    reply: `Here is what matches from our capability registry:\n${lines.join("\n")}\n\nI can go deeper on any of these, or help classify whether this is Digital or Engineering & AI.`,
  };
}

export function recommendDivisionFromText(text: string): {
  fit: NordyFit;
  division: NordyRecommendedDivision;
} {
  const normalized = text.toLowerCase();
  const engineeringSignals = [
    "automation",
    "crm",
    "integrate",
    "workflow",
    "30 employees",
    "employees",
    "invoicing",
    "scheduling",
    "manual",
    "copilot",
    "internal system",
    "saas platform",
  ];
  const digitalSignals = [
    "website",
    "landing",
    "ecommerce",
    "menu",
    "booking",
    "mobile app",
    "ios",
    "android",
    "restaurant",
    "payments",
    "portal",
  ];

  const engScore = engineeringSignals.filter((s) => normalized.includes(s)).length;
  const digScore = digitalSignals.filter((s) => normalized.includes(s)).length;

  if (engScore >= 3 && digScore <= 2) {
    return { fit: "ENGINEERING_AI", division: "ENGINEERING_AI" };
  }
  if (digScore >= 2 && engScore <= 1) {
    const complex =
      normalized.includes("enterprise") ||
      normalized.includes("warehouse") ||
      normalized.includes("multi-location erp");
    return complex
      ? { fit: "ESCALATE_ENGINEERING_AI", division: "ENGINEERING_AI" }
      : { fit: "DIGITAL_FAST_PATH", division: "DIGITAL" };
  }
  if (engScore > digScore) {
    return { fit: "ENGINEERING_AI", division: "ENGINEERING_AI" };
  }
  if (digScore > engScore) {
    return { fit: "DIGITAL_CUSTOM", division: "DIGITAL" };
  }
  return { fit: "UNKNOWN", division: "UNCLEAR" };
}
