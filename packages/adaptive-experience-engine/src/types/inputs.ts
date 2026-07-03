/** Upstream NEOS and product signals consumed by AEE. */
export interface VisitorIntentSignal {
  primaryIntent: string;
  secondaryIntent?: string;
  confidence: number;
  frictionIntentId?: string;
}

export interface CustomerExperienceSignal {
  experienceScore?: number;
  painPoints?: string[];
  frictionEvents?: string[];
}

export interface BusinessImpactSignal {
  estimatedValueScore?: number;
  leadGenerated?: boolean;
  conversionProbability?: number;
  retentionIndicator?: "positive" | "neutral" | "negative";
}

export interface ExecutivePrioritySignal {
  priorityId: string;
  label: string;
  weight: number;
}

export interface OrganizationContext {
  operatingCompany: string;
  strategicThemes?: string[];
}

export interface FounderDecisionPattern {
  approvedRecommendationAreas?: string[];
  rejectedRecommendationAreas?: string[];
}

export interface JourneyIntelligenceSignal {
  entryPoint?: string;
  repeatVisit?: boolean;
  daysSinceLastVisit?: number;
  completedObjectives?: string[];
  abandonedPages?: string[];
}

export interface TelemetryEvent {
  type: string;
  timestamp: number;
  path?: string;
  feature?: string;
  metadata?: Record<string, string | number | boolean>;
}

export interface ConversationAnalytics {
  catGuidanceScore?: number;
  unansweredQuestions?: string[];
  conversationLength?: number;
}

export interface SessionAnalytics {
  sessionId: string;
  durationMs?: number;
  pageViews?: number;
  featureAdoption?: string[];
}

export interface ExperimentOutcome {
  experimentId: string;
  variant: string;
  uplift?: number;
  confidence?: number;
}

export interface AEEInputBundle {
  productId: string;
  visitorIntent?: VisitorIntentSignal;
  customerExperience?: CustomerExperienceSignal;
  businessImpact?: BusinessImpactSignal;
  executivePriorities?: ExecutivePrioritySignal[];
  organization?: OrganizationContext;
  founderDecisionLearning?: FounderDecisionPattern;
  journeyIntelligence?: JourneyIntelligenceSignal;
  telemetry?: TelemetryEvent[];
  conversationAnalytics?: ConversationAnalytics;
  sessionAnalytics?: SessionAnalytics;
  experimentOutcomes?: ExperimentOutcome[];
}

export interface AnalyzedExperienceContext {
  visitorIntent: string;
  customerMaturity: "new" | "returning" | "engaged" | "at_risk";
  journeyFrictionLevel: "low" | "medium" | "high";
  conversationHealth: "healthy" | "neutral" | "degraded";
  featureAdoptionLevel: "none" | "partial" | "strong";
  navigationPattern: "exploratory" | "goal_directed" | "stalled";
  repeatVisit: boolean;
  businessGoalAlignment: number;
  customerGoalAlignment: number;
  executiveAlignment: number;
}
