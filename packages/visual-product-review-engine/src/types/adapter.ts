import type { VisualReviewContext } from "./request.js";
import type { RenderedUISignals } from "./capture.js";
import type { ReviewDimension } from "./dimensions.js";

export interface ProductReviewExpectations {
  productId: string;
  displayName: string;
  primaryConversionGoal: string;
  criticalScreens: string[];
  expectedTrustElements: string[];
  expectedNavigationItems: string[];
  catExpected: boolean;
  mobileFirst: boolean;
  dimensionWeights: Partial<Record<ReviewDimension, number>>;
}

/**
 * Product adapter — product-specific review expectations.
 * Core VPRE never embeds product UI assumptions.
 */
export interface VisualReviewAdapter {
  readonly productId: string;
  readonly displayName: string;

  getReviewExpectations(): ProductReviewExpectations;

  /** Optional product-specific signal enrichment from capture metadata. */
  enrichSignals?(
    signals: RenderedUISignals,
    context: VisualReviewContext,
  ): RenderedUISignals;

  /** Optional product-specific executive summary prefix. */
  getExecutiveContext?(): string;
}
