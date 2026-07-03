import type { ProductRecommendation, VisitorProfile } from "./consultantTypes";

export interface NorthbridgeProduct {
  id: string;
  name: string;
  category: string;
  fitSignals: string[];
  industries: string[];
  visitorTypes: string[];
  benefits: string[];
  timeline: string;
  roiSummary: string;
  alternatives: string[];
  ctaId: string;
}

export const NORTHBRIDGE_PRODUCTS: NorthbridgeProduct[] = [
  {
    id: "aviator-network",
    name: "Aviator Network",
    category: "Aviation marketplace platform",
    fitSignals: ["flight school", "pilot", "instructor", "cfi", "aviation", "training", "marketplace"],
    industries: ["aviation"],
    visitorTypes: ["operator", "pilot", "student"],
    benefits: [
      "Connect pilots and instructors through a structured marketplace",
      "Profiles, messaging, logbook, and operational tools in one platform",
      "Supports real training workflows—not just marketing",
    ],
    timeline: "Explore immediately; onboarding depends on your role (school, instructor, or pilot)",
    roiSummary: "Strong fit when your goal is connecting training participants or operating an aviation marketplace",
    alternatives: ["Northbridge custom platform development", "Northbridge website services"],
    ctaId: "aviator-network",
  },
  {
    id: "northbridge-services",
    name: "Northbridge Digital Services",
    category: "Digital infrastructure and consulting",
    fitSignals: ["website", "automation", "platform", "development", "digital", "infrastructure", "business"],
    industries: ["professional_services", "transportation", "technology", "financial_services"],
    visitorTypes: ["business_owner", "operator", "enterprise"],
    benefits: [
      "Structured development engagements with clear scope and timelines",
      "Websites, mobile apps, lead systems, CRM, and integrations",
      "Practical outcomes—not open-ended experiments",
    ],
    timeline: "Starter websites: days. Business platforms: weeks. Scoped during consultation.",
    roiSummary: "Best when you need reliable digital infrastructure built to defined requirements",
    alternatives: ["Venture partnership (for platform founders)", "Aviator Network (if aviation marketplace fit)"],
    ctaId: "services",
  },
  {
    id: "ai-solutions",
    name: "AI & Automation Solutions",
    category: "Practical automation and intelligent workflows",
    fitSignals: ["ai", "automation", "workflow", "chatbot", "machine learning", "intelligent"],
    industries: ["technology", "professional_services"],
    visitorTypes: ["business_owner", "enterprise", "founder"],
    benefits: [
      "Practical automation—dashboards, lead systems, workflow tools",
      "Defined scope aligned to business outcomes",
      "No generic AI experiments without clear ROI",
    ],
    timeline: "Scoped during consultation; typically weeks depending on complexity",
    roiSummary: "Best when automation solves a specific operational or customer workflow problem",
    alternatives: ["Northbridge Digital Services (broader build)", "Quadrix assessment (if readiness unclear)"],
    ctaId: "contact",
  },
  {
    id: "partnership",
    name: "Venture Partnership",
    category: "Co-build platform ventures with Northbridge",
    fitSignals: ["partner", "founder", "venture", "equity", "co-build", "startup idea"],
    industries: ["technology"],
    visitorTypes: ["founder"],
    benefits: [
      "Northbridge contributes platform development on qualified projects",
      "Structured collaboration instead of full upfront cost",
      "Built for founders with strong concepts but limited technical resources",
    ],
    timeline: "Initial conversation → qualification → structured proposal",
    roiSummary: "Best for founders building platform ventures, not one-off websites",
    alternatives: ["Northbridge Digital Services (fee-based projects)"],
    ctaId: "partner",
  },
  {
    id: "quadrix",
    name: "Quadrix Assessment",
    category: "Structured readiness evaluation",
    fitSignals: ["assessment", "evaluate", "readiness", "not sure", "which path"],
    industries: [],
    visitorTypes: ["business_owner", "founder", "enterprise", "researcher"],
    benefits: [
      "Clarify whether to explore services, build a platform, or schedule deeper conversation",
      "Reduces guesswork before committing to a project path",
    ],
    timeline: "Assessment conversation scheduled through Northbridge contact",
    roiSummary: "Best when you need clarity before choosing a product or service path",
    alternatives: ["Direct consultation", "Self-guided exploration of services and ventures"],
    ctaId: "contact",
  },
  {
    id: "airtax-financial",
    name: "AirTax Financial",
    category: "Financial and tax services for aviation professionals",
    fitSignals: ["tax", "financial", "accounting", "airtax"],
    industries: ["aviation", "financial_services"],
    visitorTypes: ["pilot", "business_owner"],
    benefits: [
      "Financial and tax services designed for aviation professionals",
      "Specialized support beyond generic accounting",
    ],
    timeline: "Engagement begins through AirTax Financial directly",
    roiSummary: "Best for aviation professionals needing specialized financial services",
    alternatives: ["Northbridge Digital Services (if primary need is software)"],
    ctaId: "ventures",
  },
];

export function recommendProduct(profile: VisitorProfile, input: string): ProductRecommendation {
  const normalized = `${input} ${profile.signals.join(" ")} ${profile.problems.join(" ")} ${profile.goals.join(" ")}`.toLowerCase();

  const scored = NORTHBRIDGE_PRODUCTS.map((product) => {
    let score = 0;

    for (const signal of product.fitSignals) {
      if (normalized.includes(signal)) score += 2;
    }
    if (profile.industry && product.industries.includes(profile.industry)) score += 3;
    if (profile.visitorType !== "unknown" && product.visitorTypes.includes(profile.visitorType)) {
      score += 2;
    }

    return { product, score };
  }).sort((a, b) => b.score - a.score);

  const best = scored[0];
  const second = scored[1];

  if (!best || best.score < 2) {
    return {
      productId: "none",
      productName: "No strong product fit yet",
      fitScore: 0.2,
      why: "I do not have enough context to recommend a specific product confidently.",
      expectedBenefits: [],
      expectedTimeline: "N/A",
      expectedRoi: "More discovery needed before recommending",
      alternatives: ["Share more about your industry and goals", "Explore Northbridge services and ventures"],
      honestNoFit: true,
    };
  }

  const fitScore = Math.min(0.95, best.score / 10);

  return {
    productId: best.product.id,
    productName: best.product.name,
    fitScore,
    why: buildWhyStatement(best.product, profile),
    expectedBenefits: best.product.benefits,
    expectedTimeline: best.product.timeline,
    expectedRoi: best.product.roiSummary,
    alternatives: [
      ...(second && second.score >= 2 ? [second.product.name] : []),
      ...best.product.alternatives,
    ].slice(0, 3),
    honestNoFit: fitScore < 0.35,
  };
}

function buildWhyStatement(product: NorthbridgeProduct, profile: VisitorProfile): string {
  const parts = [`Based on what you've shared`];
  if (profile.industry) parts.push(`(${profile.industry})`);
  parts.push(`${product.name} appears to be the strongest fit because it directly addresses your type of need.`);
  return parts.join(" ");
}

export function getProductById(id: string): NorthbridgeProduct | undefined {
  return NORTHBRIDGE_PRODUCTS.find((p) => p.id === id);
}
