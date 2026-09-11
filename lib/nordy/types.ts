export type NordyEntryPath =
  | "HOME"
  | "EXPLORE"
  | "ENGINEERING_AI"
  | "DIGITAL"
  | "MOBILE_APPS"
  | "CAPABILITIES"
  | "VENTURES"
  | "GENERAL";

export type NordyFit =
  | "DIGITAL_FAST_PATH"
  | "DIGITAL_CUSTOM"
  | "ESCALATE_ENGINEERING_AI"
  | "ENGINEERING_AI"
  | "EXPLORE_ONLY"
  | "NOT_FIT"
  | "UNKNOWN";

export type NordyRecommendedDivision =
  | "VENTURES"
  | "ENGINEERING_AI"
  | "DIGITAL"
  | "OPERATING_VENTURES"
  | "HUMAN_FOLLOW_UP"
  | "UNCLEAR";

export type KnowledgeClassification =
  | "PUBLIC_VERIFIED"
  | "INTERNAL_APPROVED_FOR_PUBLIC"
  | "INTERNAL_ONLY"
  | "PLANNED"
  | "UNVERIFIED";

export type NordyAiGapClass =
  | "KNOWLEDGE_MISSING"
  | "CAPABILITY_UNKNOWN"
  | "INTENT_AMBIGUOUS"
  | "AI_REQUIRED_FOR_REASONING"
  | "PORTFOLIO_CONTEXT_MISSING"
  | "RETRIEVAL_MISS"
  | "NONE";

export type DeploymentEnvironment =
  | "LOCAL"
  | "TEST"
  | "DEVELOPMENT"
  | "PREVIEW"
  | "STAGING"
  | "PRODUCTION"
  | "UNKNOWN";

export type NordyLeadOpportunity = {
  visitorType?: string;
  entryPath: NordyEntryPath;
  company?: string;
  industry?: string;
  problem?: string;
  requestedSolution?: string;
  currentSystems?: string[];
  integrations?: string[];
  urgency?: string;
  budgetRange?: string;
  fit: NordyFit;
  recommendedDivision: NordyRecommendedDivision;
  recommendedNextStep?: string;
  summary: string;
};

export type NordyConversationFacts = {
  company?: string;
  industry?: string;
  problem?: string;
  requestedSolution?: string;
  currentSystems: string[];
  integrations: string[];
  platforms: string[];
  features: string[];
  urgency?: string;
  budgetRange?: string;
  employeeCount?: string;
  timeline?: string;
  needsPayments?: boolean;
  needsAuth?: boolean;
  needsBooking?: boolean;
  needsMobile?: boolean;
  needsWebsite?: boolean;
  needsEcommerce?: boolean;
  needsPortal?: boolean;
  securityConcerns?: string;
};

export type NordyTurnResult = {
  reply: string;
  entryPath: NordyEntryPath;
  facts: NordyConversationFacts;
  lead?: NordyLeadOpportunity;
  usedAi: boolean;
  aiGapClass: NordyAiGapClass;
  confidence: "high" | "medium" | "low";
  handoffSuggested: boolean;
  refusedSensitive: boolean;
  source:
    | "company_knowledge"
    | "capability_registry"
    | "conversation"
    | "neo_retrieval"
    | "neo_ai"
    | "uncertainty";
};
