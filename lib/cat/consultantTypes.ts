export type ConversationStage =
  | "discover"
  | "clarify"
  | "teach"
  | "recommend"
  | "handle_objections"
  | "close_softly"
  | "follow_up";

export type VisitorType =
  | "business_owner"
  | "founder"
  | "operator"
  | "pilot"
  | "student"
  | "enterprise"
  | "researcher"
  | "unknown";

export type LaunchContext = "new" | "modernizing" | "exploring";

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

export interface SalesDiscoveryState {
  discoveryStarted: boolean;
  launchContext?: LaunchContext;
  primaryChallenge?: string;
  discoveryComplete: boolean;
  clarificationComplete: boolean;
  teachingComplete: boolean;
  activeObjection?: string;
  objectionsHandled: string[];
  productFitDetected: boolean;
  closeRecommended: boolean;
  intentCaptured: boolean;
}

export interface LeadQualificationScore {
  overall: number;
  budgetFit: number;
  urgencyFit: number;
  problemClarity: number;
  authoritySignals: number;
  isQualified: boolean;
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
  sales: SalesDiscoveryState;
  leadQualification: LeadQualificationScore;
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
    stage: "discover",
    sales: {
      discoveryStarted: false,
      discoveryComplete: false,
      clarificationComplete: false,
      teachingComplete: false,
      objectionsHandled: [],
      productFitDetected: false,
      closeRecommended: false,
      intentCaptured: false,
    },
    leadQualification: {
      overall: 0.1,
      budgetFit: 0,
      urgencyFit: 0,
      problemClarity: 0,
      authoritySignals: 0,
      isQualified: false,
    },
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

export function createInitialSalesState(): SalesDiscoveryState {
  return createInitialSessionState().sales;
}

export function createInitialLeadQualification(): LeadQualificationScore {
  return createInitialSessionState().leadQualification;
}
