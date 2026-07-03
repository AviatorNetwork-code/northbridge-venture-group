/** Read-only integration surfaces for upstream NEOS capabilities. */
export interface CustomerExperienceIntelligenceInput {
  sessionId: string;
  experienceScore?: number;
  painPoints?: string[];
}

export interface ProductEvolutionSignal {
  productId: string;
  featureGap?: string;
  frictionPattern?: string;
}

export interface ContinuousLearningObservation {
  pattern: string;
  frequency: number;
  suggestedExperiment?: string;
}

export interface ConversationIntelligenceInput {
  sessionId: string;
  transcript: Array<{ role: "visitor" | "cat"; content: string; timestamp: number }>;
  matchedTopics?: string[];
}

export interface VIIIntegrationInputs {
  customerExperience?: CustomerExperienceIntelligenceInput;
  productEvolution?: ProductEvolutionSignal[];
  continuousLearning?: ContinuousLearningObservation[];
  conversationIntelligence?: ConversationIntelligenceInput;
}

/** Downstream output targets (recommendations only). */
export type VIIOutputTarget =
  | "founder_dashboard"
  | "executive_intelligence"
  | "customer_experience_intelligence"
  | "product_evolution_engine"
  | "cat_improvement_recommendations";

export interface VIIOutputEnvelope {
  target: VIIOutputTarget;
  generatedAt: number;
  payload: unknown;
  governance: {
    readOnly: true;
    requiresFounderApproval: true;
  };
}
