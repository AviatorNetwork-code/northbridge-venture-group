import type { BusinessCorrelation } from "./business.js";
import type { ConfidenceAssessment } from "./confidence.js";
import type { ConversationEvaluation } from "./conversation.js";
import type { IntentInference } from "./intent.js";
import type { JourneyUnderstanding } from "./journey.js";
import type { OutcomeAssessment } from "./outcome.js";

export interface SessionIntelligence {
  schemaVersion: "1.0.0";
  sessionId: string;
  productId: string;
  startedAt: number;
  endedAt: number;
  intent: IntentInference;
  confidence: ConfidenceAssessment;
  journey: JourneyUnderstanding;
  conversation?: ConversationEvaluation;
  outcome: OutcomeAssessment;
  business?: BusinessCorrelation;
  catImprovementRecommendations: string[];
  productImprovementRecommendations: string[];
}

export interface ExecutiveReport {
  schemaVersion: "1.0.0";
  generatedAt: number;
  productId: string;
  sessionCount: number;
  intentDistribution: Record<string, number>;
  visitorSuccessScore: number;
  intentAccuracyScore: number;
  catGuidanceScore: number;
  journeyCompletionRate: number;
  topUnansweredQuestions: string[];
  highestFrictionIntentId?: string;
  highestValueIntentId?: string;
  recommendedCatImprovements: string[];
  recommendedProductImprovements: string[];
}

export interface ImprovementRecommendation {
  id: string;
  area: "cat" | "onboarding" | "content" | "navigation" | "workflow";
  priority: "high" | "medium" | "low";
  summary: string;
  rationale: string;
  requiresFounderApproval: true;
}
