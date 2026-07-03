/** Per-screen scores — 0–100, customer-impact oriented. */
export interface ScreenScores {
  uxScore: number;
  productUnderstandingScore: number;
  trustScore: number;
  conversionScore: number;
  frictionScore: number;
  accessibilityScore: number;
}

export interface DimensionScore {
  dimension: import("./dimensions.js").ReviewDimension;
  score: number;
  rationale: string;
}

export type IssueSeverity = "critical" | "high" | "medium" | "low";

export interface ReviewIssue {
  issueId: string;
  dimension: import("./dimensions.js").ReviewDimension;
  screenshotLocation: import("./capture.js").ScreenshotLocation;
  severity: IssueSeverity;
  title: string;
  description: string;
  businessImpact: string;
  suggestedImprovement: string;
  evidence: string[];
  expectedConversionImprovement: string;
  businessImpactScore: number;
}

export interface ScreenReview {
  screenId: string;
  screenName: string;
  screenshotLocation: import("./capture.js").ScreenshotLocation;
  scores: ScreenScores;
  dimensionScores: DimensionScore[];
  issues: ReviewIssue[];
}
