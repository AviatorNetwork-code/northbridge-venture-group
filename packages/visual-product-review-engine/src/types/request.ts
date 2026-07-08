import type { ScreenCapture } from "./capture.js";

export interface VisualReviewRequest {
  reviewId: string;
  requesterId: string;
  productId: string;
  productName: string;
  screens: ScreenCapture[];
  customerPersona?: string;
  reviewGoal?: string;
  timestamp: number;
}

export interface VisualReviewContext {
  productId: string;
  industry?: string;
  primaryConversionGoal?: string;
  expectedCatPresence?: boolean;
  brandGuidelines?: string[];
}
