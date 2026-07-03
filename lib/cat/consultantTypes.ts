export type ConversationStage =
  | "understand"
  | "educate"
  | "discover_fit"
  | "build_trust"
  | "recommend"
  | "convert";

export type VisitorType =
  | "business_owner"
  | "founder"
  | "operator"
  | "pilot"
  | "student"
  | "enterprise"
  | "researcher"
  | "unknown";

export interface VisitorProfile {
  visitorType: VisitorType;
  industry?: string;
  companySize?: "solo" | "small" | "medium" | "enterprise" | "unknown";
  problems: string[];
  goals: string[];
  experienceLevel?: "new" | "intermediate" | "advanced";
  urgency?: "low" | "medium" | "high";
  budgetMentioned?: boolean;
  signals: string[];
}

export interface ProductRecommendation {
  productId: string;
  productName: string;
  fitScore: number;
  why: string;
  expectedBenefits: string[];
  expectedTimeline: string;
  expectedRoi: string;
  alternatives: string[];
  honestNoFit?: boolean;
}

export interface SessionScores {
  productUnderstanding: number;
  visitorConfidence: number;
  solutionClarity: number;
  trust: number;
  conversionProbability: number;
}

export interface ConversationIntelligenceCapture {
  frequentlyAskedQuestions: string[];
  confusingExplanations: string[];
  objections: string[];
  missingContent: string[];
  featureRequests: string[];
  competitiveMentions: string[];
  misconceptions: string[];
  unansweredQuestions: string[];
  frictionPoints: string[];
  buyingSignals: string[];
}

export interface ConsultantSessionState {
  profile: VisitorProfile;
  stage: ConversationStage;
  scores: SessionScores;
  intelligence: ConversationIntelligenceCapture;
  turnCount: number;
  recommendedProductId?: string;
  recommendationAccepted: boolean;
  ctaClicked: boolean;
}

export function createInitialSessionState(): ConsultantSessionState {
  return {
    profile: {
      visitorType: "unknown",
      problems: [],
      goals: [],
      signals: [],
    },
    stage: "understand",
    scores: {
      productUnderstanding: 0.1,
      visitorConfidence: 0.3,
      solutionClarity: 0.1,
      trust: 0.4,
      conversionProbability: 0.1,
    },
    intelligence: {
      frequentlyAskedQuestions: [],
      confusingExplanations: [],
      objections: [],
      missingContent: [],
      featureRequests: [],
      competitiveMentions: [],
      misconceptions: [],
      unansweredQuestions: [],
      frictionPoints: [],
      buyingSignals: [],
    },
    turnCount: 0,
    recommendationAccepted: false,
    ctaClicked: false,
  };
}
