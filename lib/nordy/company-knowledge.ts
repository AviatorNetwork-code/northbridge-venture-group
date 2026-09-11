import type { KnowledgeClassification } from "@/lib/nordy/types";

export type CompanyKnowledgeEntry = {
  id: string;
  topic: string;
  keywords: string[];
  answer: string;
  classification: KnowledgeClassification;
};

/** Public-verified Northbridge company knowledge for Nordy. */
export const companyKnowledge: CompanyKnowledgeEntry[] = [
  {
    id: "what-northbridge-does",
    topic: "company",
    keywords: [
      "what does northbridge do",
      "who is northbridge",
      "what is northbridge",
      "about northbridge",
      "northbridge venture group",
    ],
    answer:
      "Northbridge Venture Group builds companies, software, and intelligent systems. We operate ventures, deliver Engineering & AI services for complex operational problems, and ship Digital products with predictable scope for growing businesses.",
    classification: "PUBLIC_VERIFIED",
  },
  {
    id: "ventures-owned",
    topic: "ventures",
    keywords: [
      "what companies do you own",
      "ventures",
      "portfolio",
      "what do you own",
      "companies you own",
    ],
    answer:
      "Public ventures include Aviator Network (aviation platform) and AirTax Financial (aviation tax and financial services). Northbridge Digital and Northbridge Engineering & AI are how we build software and intelligent systems for customers. We only list ventures with credible public evidence.",
    classification: "PUBLIC_VERIFIED",
  },
  {
    id: "aviator-network",
    topic: "ventures",
    keywords: ["aviator network", "what is aviator", "aviator"],
    answer:
      "Aviator Network is Northbridge's aviation platform for pilots, instructors, logbook workflows, and operational tools built around how flight businesses actually run.",
    classification: "PUBLIC_VERIFIED",
  },
  {
    id: "airtax",
    topic: "ventures",
    keywords: ["airtax", "air tax", "aviation tax"],
    answer:
      "AirTax Financial provides tax and financial services for aviation professionals, focused on the specialized compliance and planning needs of people who work in flight.",
    classification: "PUBLIC_VERIFIED",
  },
  {
    id: "quadrix",
    topic: "ventures",
    keywords: ["quadrix", "what is quadrix"],
    answer:
      "Quadrix is referenced as a Northbridge-related product surface. I only confirm public details that are verified for this site — if you need specifics, I can connect you with the team.",
    classification: "INTERNAL_APPROVED_FOR_PUBLIC",
  },
  {
    id: "mobile-apps",
    topic: "digital",
    keywords: [
      "mobile apps",
      "build mobile",
      "ios",
      "android",
      "can you build an app",
      "mobile application",
    ],
    answer:
      "Yes. Northbridge Digital builds production-ready mobile apps for iOS and Android — branding, auth, core screens, backend/API, analytics, and store submission preparation. App Store and Google review timing is controlled by Apple and Google, not Northbridge.",
    classification: "PUBLIC_VERIFIED",
  },
  {
    id: "websites",
    topic: "digital",
    keywords: [
      "websites",
      "build websites",
      "do you build websites",
      "landing page",
      "ecommerce",
    ],
    answer:
      "Yes. Northbridge Digital builds business websites, landing pages, ecommerce, client portals, booking systems, and lightweight SaaS with clear scope and predictable delivery.",
    classification: "PUBLIC_VERIFIED",
  },
  {
    id: "automation",
    topic: "engineering",
    keywords: [
      "automate my business",
      "business automation",
      "workflow automation",
      "automate",
    ],
    answer:
      "Yes. Northbridge Engineering & AI helps operators automate manual workflows, connect systems, and redesign operations around reliable software — including AI assistants and copilots when they create real leverage.",
    classification: "PUBLIC_VERIFIED",
  },
  {
    id: "ai",
    topic: "engineering",
    keywords: [
      "work with ai",
      "artificial intelligence",
      "ai integration",
      "copilot",
      "do you use ai",
    ],
    answer:
      "Yes. We integrate AI into operational systems — assistants, copilots, intelligent intake, and workflow automation — grounded in your real processes, not generic chatbot demos.",
    classification: "PUBLIC_VERIFIED",
  },
  {
    id: "digital-vs-engineering",
    topic: "routing",
    keywords: [
      "difference between digital and engineering",
      "digital vs engineering",
      "engineering & ai",
      "which division",
    ],
    answer:
      "Northbridge Digital is for clearly scoped websites, ecommerce, portals, and mobile apps with predictable delivery. Engineering & AI is for complex operational systems, automation, custom SaaS, integrations, and AI copilots. If scope is unclear, Nordi helps classify the right path.",
    classification: "PUBLIC_VERIFIED",
  },
  {
    id: "pricing",
    topic: "commercial",
    keywords: [
      "what does a project cost",
      "pricing",
      "how much",
      "budget",
      "cost",
    ],
    answer:
      "Project cost depends on scope, integrations, and whether the work fits Digital fast-path or Engineering & AI. I do not invent prices. Share what you need and I will recommend the right next step — including a project review when useful.",
    classification: "PUBLIC_VERIFIED",
  },
  {
    id: "process",
    topic: "process",
    keywords: [
      "how does a project work",
      "process",
      "how do you work",
      "project genesis",
    ],
    answer:
      "Simplified public process: understand the problem, design the system, reuse what already works, build, test, then deliver and operate. We move faster when internal capability and proven patterns apply.",
    classification: "PUBLIC_VERIFIED",
  },
  {
    id: "neo",
    topic: "neo",
    keywords: ["what is neo", "neo architecture", "engineering operating system"],
    answer:
      "NEO is Northbridge's shared engineering, intelligence, learning, and capability layer underneath our products and services. Public conversations stay focused on outcomes — not confidential internal architecture.",
    classification: "INTERNAL_APPROVED_FOR_PUBLIC",
  },
  {
    id: "hvac-app",
    topic: "digital",
    keywords: ["hvac", "app for my hvac", "service booking"],
    answer:
      "Yes — an HVAC booking and payments app is a common Digital path when features are clear (booking, account, payments, notifications). If workflows or integrations get complex, Engineering & AI may be the better fit.",
    classification: "PUBLIC_VERIFIED",
  },
];

const INTERNAL_ONLY_PATTERNS = [
  /internal.?only/i,
  /secret/i,
  /credential/i,
  /api.?key/i,
  /password/i,
  /private neo/i,
  /neo architecture detail/i,
  /customer data/i,
  /service.?role/i,
  /github.?app.?token/i,
];

export function isSensitiveProbe(text: string): boolean {
  return INTERNAL_ONLY_PATTERNS.some((pattern) => pattern.test(text));
}

export function findCompanyKnowledgeAnswer(
  text: string,
): CompanyKnowledgeEntry | null {
  const normalized = text.trim().toLowerCase();
  if (!normalized) return null;

  let best: { entry: CompanyKnowledgeEntry; score: number } | null = null;

  for (const entry of companyKnowledge) {
    if (entry.classification === "INTERNAL_ONLY") continue;
    let score = 0;
    for (const keyword of entry.keywords) {
      if (normalized.includes(keyword.toLowerCase())) {
        score += keyword.length;
      }
    }
    if (score > 0 && (!best || score > best.score)) {
      best = { entry, score };
    }
  }

  return best?.entry ?? null;
}
