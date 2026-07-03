export type AEEOutputTarget =
  | "executive_intelligence"
  | "founder_dashboard"
  | "customer_experience_intelligence"
  | "business_impact_engine"
  | "founder_decision_learning";

export interface AEEOutputEnvelope {
  target: AEEOutputTarget;
  generatedAt: number;
  payload: unknown;
  governance: {
    readOnly: true;
    requiresFounderApproval: true;
  };
}

export interface PersonalizationScore {
  overall: number;
  intentFit: number;
  journeyFit: number;
  businessFit: number;
  evidenceStrength: number;
}
