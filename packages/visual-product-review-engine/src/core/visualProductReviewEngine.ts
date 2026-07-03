import { DEFAULT_REVIEW_ADAPTERS } from "../adapters/defaultProductReviewAdapters.js";
import {
  aggregateScreenScores,
  evaluateAllDimensions,
} from "../engines/dimensionEvaluators.js";
import { detectScreenIssues } from "../engines/issueDetector.js";
import { generateExecutiveUXReport } from "../engines/executiveReportGenerator.js";
import {
  assertReadOnlyOperation,
  wrapExecutiveReport,
  VPRE_GOVERNANCE,
} from "../governance/readOnlyPolicy.js";
import {
  createDefaultReviewRegistry,
  ReviewSourceRegistry,
} from "../registry/reviewSourceRegistry.js";
import type { VisualReviewAdapter } from "../types/adapter.js";
import type { ScreenCapture } from "../types/capture.js";
import type { ExecutiveUXReport } from "../types/report.js";
import type { VisualReviewRequest } from "../types/request.js";
import type { ScreenReview } from "../types/scores.js";

export interface VisualProductReviewEngineOptions {
  registry?: ReviewSourceRegistry;
  adapters?: VisualReviewAdapter[];
}

export class VisualProductReviewEngine {
  readonly registry: ReviewSourceRegistry;

  constructor(options: VisualProductReviewEngineOptions = {}) {
    this.registry =
      options.registry ??
      createDefaultReviewRegistry(options.adapters ?? DEFAULT_REVIEW_ADAPTERS);
  }

  /** Read-only visual review — analyzes rendered UI signals, never modifies products. */
  reviewScreens(request: VisualReviewRequest): ExecutiveUXReport {
    assertReadOnlyOperation("visual_review");

    const adapter = this.registry.requireAdapter(request.productId);
    const expectations = adapter.getReviewExpectations();

    const screenReviews: ScreenReview[] = request.screens.map((capture) =>
      this.reviewSingleScreen(capture, adapter, expectations),
    );

    const report = generateExecutiveUXReport(request, adapter, screenReviews);
    return wrapExecutiveReport(report);
  }

  private reviewSingleScreen(
    capture: ScreenCapture,
    adapter: VisualReviewAdapter,
    expectations: ReturnType<VisualReviewAdapter["getReviewExpectations"]>,
  ): ScreenReview {
    const signals = adapter.enrichSignals?.(capture.signals, {
      productId: capture.screenId,
    }) ?? capture.signals;

    const enrichedCapture: ScreenCapture = { ...capture, signals };
    const dimensionScores = evaluateAllDimensions(
      signals,
      capture.viewport,
      expectations,
    );
    const scores = aggregateScreenScores(dimensionScores);
    const issues = detectScreenIssues(enrichedCapture, dimensionScores, expectations);

    return {
      screenId: capture.screenId,
      screenName: capture.screenName,
      screenshotLocation: {
        screenId: capture.screenId,
        captureId: capture.captureId,
        sourceType: capture.sourceType,
        path: capture.path,
        url: capture.url,
        viewport: capture.viewport,
      },
      scores,
      dimensionScores,
      issues,
    };
  }
}

export function createVisualProductReviewEngine(
  options?: VisualProductReviewEngineOptions,
): VisualProductReviewEngine {
  return new VisualProductReviewEngine(options);
}

export { VPRE_GOVERNANCE };
