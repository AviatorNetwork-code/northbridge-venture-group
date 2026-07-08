export interface OnboardingRequirement {
  id: string;
  label: string;
  completed: boolean;
  category: "discovery" | "connector" | "workforce" | "launch";
}

export interface OnboardingRecommendation {
  id: string;
  type: "connector" | "specialist" | "workflow";
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
}

export interface OnboardingSnapshot {
  readinessPercent: number;
  discoveryComplete: boolean;
  discoveryProgress: number;
  launchReadiness: number;
  estimatedSetupMinutes: number;
  requirements: OnboardingRequirement[];
  connectorRecommendations: OnboardingRecommendation[];
  workforceRecommendations: OnboardingRecommendation[];
  lastUpdated: string;
}
