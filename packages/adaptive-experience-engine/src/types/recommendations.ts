export type RecommendationArea =
  | "onboarding"
  | "navigation"
  | "next_best_action"
  | "content_ordering"
  | "conversation_strategy"
  | "cta_placement"
  | "feature_discovery"
  | "education_flow"
  | "support"
  | "product_suggestion";

export type EngineeringEffort = "low" | "medium" | "high";

export interface EvidenceItem {
  source: string;
  signal: string;
  weight: number;
  timestamp?: number;
}

export interface ExperienceRecommendation {
  id: string;
  area: RecommendationArea;
  title: string;
  recommendation: string;
  reason: string;
  experienceScore: number;
  businessImpactScore: number;
  customerValueScore: number;
  engineeringEffort: EngineeringEffort;
  confidence: number;
  evidence: EvidenceItem[];
  expectedRoi: number;
  opportunityCost: string;
  strategicAlignment: number;
  requiresFounderApproval: true;
}

export interface ImpactSummary {
  score: number;
  summary: string;
  primaryDrivers: string[];
}

export interface RiskAssessment {
  overallRisk: "low" | "medium" | "high";
  factors: Array<{
    factor: string;
    severity: "low" | "medium" | "high";
    mitigation: string;
  }>;
}

export interface AdaptiveExperiencePlan {
  schemaVersion: "1.0.0";
  productId: string;
  generatedAt: number;
  recommendations: ExperienceRecommendation[];
  personalizationConfidence: number;
  expectedBusinessImpact: ImpactSummary;
  expectedCustomerImpact: ImpactSummary;
  executiveSummary: string;
  riskAssessment: RiskAssessment;
  evidenceQuality: number;
  dependencies: string[];
  requiredFounderApproval: true;
}
