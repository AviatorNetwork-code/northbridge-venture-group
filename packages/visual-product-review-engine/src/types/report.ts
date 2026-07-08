import type { ScreenReview } from "./scores.js";
import type { ScreenScores } from "./scores.js";
import type { ReviewIssue } from "./scores.js";

export interface ExecutiveUXReport {
  reportId: string;
  productId: string;
  productName: string;
  generatedAt: number;
  executiveSummary: string;
  overallScores: ScreenScores;
  screenReviews: ScreenReview[];
  prioritizedIssues: ReviewIssue[];
  topOpportunities: string[];
  governance: {
    readOnly: true;
    requiresFounderApproval: true;
  };
}
