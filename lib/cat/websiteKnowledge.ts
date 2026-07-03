import type { CatCta, CatQuickQuestion } from "./websiteAssistantTypes";

/** Public-safe CTAs mapped to existing site routes and external ventures. */
export const CAT_CTAS = {
  services: {
    id: "services",
    label: "Explore Services",
    href: "/services",
    kind: "internal",
    action: "explore_products",
  },
  ventures: {
    id: "ventures",
    label: "View Ventures",
    href: "/portfolio",
    kind: "internal",
    action: "explore_products",
  },
  contact: {
    id: "contact",
    label: "Contact Northbridge",
    href: "/contact",
    kind: "internal",
    action: "contact",
  },
  partner: {
    id: "partner",
    label: "Partner With Us",
    href: "/partner",
    kind: "internal",
    action: "book_meeting",
  },
  aviatorNetwork: {
    id: "aviator-network",
    label: "Visit Aviator Network",
    href: "https://aviatornetwork.com",
    kind: "external",
    action: "explore_products",
  },
  about: {
    id: "about",
    label: "About Northbridge",
    href: "/about",
    kind: "internal",
    action: "continue_browsing",
  },
} as const satisfies Record<string, CatCta>;

export const CAT_QUICK_QUESTIONS: CatQuickQuestion[] = [
  {
    id: "what-is-northbridge",
    label: "What does Northbridge do?",
    prompt: "What does Northbridge Venture Group do?",
  },
  {
    id: "right-product",
    label: "Which offering fits me?",
    prompt: "Which product or service is right for me?",
  },
  {
    id: "flight-school",
    label: "I run a flight school",
    prompt: "I run a flight school. Where should I go?",
  },
  {
    id: "ai-business",
    label: "AI for my business",
    prompt: "I want AI for my business. Can Northbridge help?",
  },
  {
    id: "aviator-network",
    label: "What is Aviator Network?",
    prompt: "What is Aviator Network?",
  },
  {
    id: "quadrix",
    label: "What is Quadrix?",
    prompt: "What is Quadrix?",
  },
  {
    id: "contact",
    label: "How do I contact you?",
    prompt: "How do I contact Northbridge?",
  },
];

export interface KnowledgeTopic {
  id: string;
  keywords: string[];
  message: string;
  ctas: CatCta[];
  recommendationAction?: CatCta["action"];
  recommendationReason?: string;
}

/** Deterministic, public-safe knowledge entries. No internal systems exposed. */
export const KNOWLEDGE_TOPICS: KnowledgeTopic[] = [
  {
    id: "northbridge-overview",
    keywords: [
      "what does northbridge",
      "what is northbridge",
      "northbridge do",
      "northbridge venture",
      "who is northbridge",
      "tell me about northbridge",
    ],
    message:
      "Northbridge Venture Group is a venture studio and digital infrastructure partner. We develop ventures, digital platforms, and infrastructure systems that help modern industries operate more efficiently. Northbridge builds and supports marketplace platforms, SaaS tools, business websites, automation systems, and mobile applications—primarily in aviation, financial services, transportation, and professional services.",
    ctas: [CAT_CTAS.about, CAT_CTAS.ventures, CAT_CTAS.services],
    recommendationAction: "continue_browsing",
    recommendationReason: "Visitor is learning about Northbridge at a high level.",
  },
  {
    id: "product-fit",
    keywords: [
      "which product",
      "which service",
      "right for me",
      "what should i choose",
      "recommend",
      "best option",
      "help me decide",
    ],
    message:
      "Northbridge offers two main paths: explore our ventures (like Aviator Network and AirTax Financial) or work with us on custom digital infrastructure—websites, mobile apps, lead systems, and platform development. If you are building or operating a business, our services page outlines structured development engagements. If you are exploring an existing platform, our ventures page is the best starting point.",
    ctas: [CAT_CTAS.services, CAT_CTAS.ventures, CAT_CTAS.contact],
    recommendationAction: "explore_products",
    recommendationReason: "Visitor is comparing offerings and needs guided discovery.",
  },
  {
    id: "flight-school",
    keywords: [
      "flight school",
      "flight training",
      "cfi",
      "flight instructor",
      "pilot training",
      "aviation school",
      "fbo",
    ],
    message:
      "For aviation training organizations, Northbridge can support your digital presence and operational systems—websites, lead capture, and platform development. Aviator Network is also relevant: it is a marketplace connecting pilots and flight instructors with profiles, messaging, and operational tools. Many aviation businesses start with a website or local presence project, then explore deeper platform needs.",
    ctas: [CAT_CTAS.services, CAT_CTAS.aviatorNetwork, CAT_CTAS.contact],
    recommendationAction: "contact",
    recommendationReason: "Aviation operator likely needs tailored guidance on services vs. platform tools.",
  },
  {
    id: "ai-business",
    keywords: [
      "ai for my business",
      "artificial intelligence",
      "machine learning",
      "automation",
      "ai help",
      "ai project",
      "chatbot",
    ],
    message:
      "Northbridge can help organizations apply practical digital automation—lead systems, dashboards, workflow tools, and custom software—not generic AI experiments. We focus on structured development engagements where goals, scope, and outcomes are clearly defined. Share your use case and we can recommend whether a website upgrade, automation system, or custom platform is the right fit.",
    ctas: [CAT_CTAS.services, CAT_CTAS.contact],
    recommendationAction: "contact",
    recommendationReason: "AI interest usually requires scoping through a consultation.",
  },
  {
    id: "aviator-network",
    keywords: [
      "aviator network",
      "aviatornetwork",
      "pilot marketplace",
      "instructor marketplace",
    ],
    message:
      "Aviator Network is a Northbridge venture—a digital marketplace connecting pilots and flight instructors. It includes instructor and student profiles, marketplace search, messaging, a digital logbook, wallet and credit features, and admin dashboards. It demonstrates Northbridge's ability to build and operate full platforms beyond brochure websites.",
    ctas: [CAT_CTAS.aviatorNetwork, CAT_CTAS.ventures],
    recommendationAction: "explore_products",
    recommendationReason: "Visitor is interested in a specific venture platform.",
  },
  {
    id: "quadrix",
    keywords: ["quadrix", "assessment", "evaluation", "readiness"],
    message:
      "Quadrix is a structured assessment approach Northbridge uses to help organizations evaluate digital opportunities, project readiness, and recommended next steps. It is designed to clarify whether you should explore services, pursue a platform build, or schedule a deeper conversation. Contact Northbridge to discuss whether an assessment conversation is appropriate for your situation.",
    ctas: [CAT_CTAS.contact, CAT_CTAS.services],
    recommendationAction: "complete_assessment",
    recommendationReason: "Visitor is asking about structured evaluation.",
  },
  {
    id: "services",
    keywords: [
      "services",
      "website development",
      "mobile app",
      "pricing",
      "how much",
      "build a website",
      "digital infrastructure",
    ],
    message:
      "Northbridge provides digital infrastructure services including website development (starter, business, and professional tiers), mobile applications, online presence setup, lead capture systems, CRM configuration, and integrations. Engagements are structured development projects with defined scope, timelines, and revision rounds—not automated purchases.",
    ctas: [CAT_CTAS.services, CAT_CTAS.contact],
    recommendationAction: "explore_products",
    recommendationReason: "Visitor is researching service offerings.",
  },
  {
    id: "partner",
    keywords: [
      "partner",
      "partnership",
      "founder",
      "venture",
      "collaborate",
      "co-build",
      "equity",
    ],
    message:
      "Northbridge partners with selected founders and organizations to build digital platforms through structured venture collaborations. Instead of charging full development cost upfront, Northbridge may contribute platform development and infrastructure in exchange for a structured partnership arrangement on qualified projects.",
    ctas: [CAT_CTAS.partner, CAT_CTAS.contact],
    recommendationAction: "book_meeting",
    recommendationReason: "Visitor expressed partnership or founder interest.",
  },
  {
    id: "contact",
    keywords: [
      "contact",
      "email",
      "reach",
      "talk to",
      "get in touch",
      "consultation",
      "meeting",
      "call",
    ],
    message:
      "You can reach Northbridge by email. General inquiries: info@northbridgeventuregroup.com. Partnerships: partnerships@northbridgeventuregroup.com. For website and digital infrastructure projects, contact@northbridgeventuregroup.com. Visit the contact page for full details.",
    ctas: [CAT_CTAS.contact, CAT_CTAS.partner],
    recommendationAction: "contact",
    recommendationReason: "Visitor wants direct next steps to connect.",
  },
  {
    id: "ventures",
    keywords: [
      "ventures",
      "portfolio",
      "airtax",
      "products",
      "platforms",
    ],
    message:
      "Northbridge ventures include Aviator Network (aviation marketplace), AirTax Financial (financial and tax services for aviation professionals), and Northbridge Digital (digital infrastructure services). Each venture addresses a specific industry need within the Northbridge ecosystem.",
    ctas: [CAT_CTAS.ventures, CAT_CTAS.aviatorNetwork, CAT_CTAS.services],
    recommendationAction: "explore_products",
    recommendationReason: "Visitor wants to browse ventures and platforms.",
  },
];

export const CAT_GREETING =
  "Hello — I'm the Northbridge website assistant. I can help you understand what we do, explore ventures and services, and point you to the right next step. What would you like to know?";

export const CAT_FALLBACK_MESSAGE =
  "I can help with questions about Northbridge, our ventures, services, and how to get in touch. Try one of the suggested questions below, or ask about a specific need—like a website project, aviation platform, or partnership.";
