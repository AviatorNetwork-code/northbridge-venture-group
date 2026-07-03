import type { ScreenReview, ReviewIssue, ScreenScores } from "../types/scores.js";
import type { ExecutiveUXReport } from "../types/report.js";
import type { VisualReviewRequest } from "../types/request.js";
import type { VisualReviewAdapter } from "../types/adapter.js";
import { prioritizeIssuesByBusinessImpact } from "./issueDetector.js";

function averageScores(reviews: ScreenReview[]): ScreenScores {
  if (reviews.length === 0) {
    return {
      uxScore: 0,
      productUnderstandingScore: 0,
      trustScore: 0,
      conversionScore: 0,
      frictionScore: 100,
      accessibilityScore: 0,
    };
  }

  const sum = reviews.reduce(
    (acc, review) => ({
      uxScore: acc.uxScore + review.scores.uxScore,
      productUnderstandingScore: acc.productUnderstandingScore + review.scores.productUnderstandingScore,
      trustScore: acc.trustScore + review.scores.trustScore,
      conversionScore: acc.conversionScore + review.scores.conversionScore,
      frictionScore: acc.frictionScore + review.scores.frictionScore,
      accessibilityScore: acc.accessibilityScore + review.scores.accessibilityScore,
    }),
    {
      uxScore: 0,
      productUnderstandingScore: 0,
      trustScore: 0,
      conversionScore: 0,
      frictionScore: 0,
      accessibilityScore: 0,
    },
  );

  const count = reviews.length;
  return {
    uxScore: Math.round(sum.uxScore / count),
    productUnderstandingScore: Math.round(sum.productUnderstandingScore / count),
    trustScore: Math.round(sum.trustScore / count),
    conversionScore: Math.round(sum.conversionScore / count),
    frictionScore: Math.round(sum.frictionScore / count),
    accessibilityScore: Math.round(sum.accessibilityScore / count),
  };
}

export function generateExecutiveUXReport(
  request: VisualReviewRequest,
  adapter: VisualReviewAdapter,
  screenReviews: ScreenReview[],
): ExecutiveUXReport {
  const allIssues = screenReviews.flatMap((review) => review.issues);
  const prioritizedIssues = prioritizeIssuesByBusinessImpact(allIssues);
  const overallScores = averageScores(screenReviews);

  const topOpportunities = prioritizedIssues.slice(0, 5).map(
    (issue) => `${issue.title}: ${issue.suggestedImprovement}`,
  );

  const contextPrefix = adapter.getExecutiveContext?.() ?? "";
  const executiveSummary = [
    contextPrefix,
    `Visual review of ${request.productName} across ${screenReviews.length} screen(s) from the customer's perspective.`,
    `Overall UX score: ${overallScores.uxScore}/100. Conversion score: ${overallScores.conversionScore}/100. Friction score: ${overallScores.frictionScore}/100 (lower is better).`,
    prioritizedIssues.length > 0
      ? `Top priority: ${prioritizedIssues[0]!.title} (${prioritizedIssues[0]!.severity}).`
      : "No critical visual UX issues detected from available captures.",
    "All findings are read-only recommendations requiring Founder approval before implementation.",
  ]
    .filter(Boolean)
    .join(" ");

  return {
    reportId: `vpre-${request.reviewId}`,
    productId: request.productId,
    productName: request.productName,
    generatedAt: Date.now(),
    executiveSummary,
    overallScores,
    screenReviews,
    prioritizedIssues,
    topOpportunities,
    governance: {
      readOnly: true,
      requiresFounderApproval: true,
    },
  };
}
