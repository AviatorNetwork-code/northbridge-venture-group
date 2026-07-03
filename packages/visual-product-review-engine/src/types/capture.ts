/** Screenshot / rendered UI capture sources. */
export type CaptureSourceType =
  | "browser_screenshot"
  | "local_screenshot"
  | "mobile_screenshot"
  | "screen_recording"
  | "browser_automation";

export type ViewportProfile = "desktop" | "tablet" | "mobile";

export interface ScreenshotLocation {
  screenId: string;
  captureId: string;
  sourceType: CaptureSourceType;
  path?: string;
  url?: string;
  viewport: ViewportProfile;
  region?: { x: number; y: number; width: number; height: number };
}

/** Observable UI signals extracted from screenshot metadata or future vision/automation. */
export interface RenderedUISignals {
  hasPrimaryHeading: boolean;
  hasSubheadings: boolean;
  hasClearValueProposition: boolean;
  hasPrimaryCta: boolean;
  hasSecondaryCta: boolean;
  hasNavigation: boolean;
  navigationItemCount: number;
  hasContactPath: boolean;
  hasTrustSignals: boolean;
  hasProductExplanation: boolean;
  hasPricingOrNextStep: boolean;
  hasCatWidget: boolean;
  catWidgetVisible: boolean;
  hasFooter: boolean;
  textDensity: "low" | "medium" | "high";
  contrastConcern: boolean;
  tapTargetConcern: boolean;
  headingOrderConcern: boolean;
  brandElementsPresent: boolean;
  inconsistentSpacing: boolean;
  conversionStepsVisible: number;
  estimatedScrollDepthRequired: "none" | "moderate" | "deep";
}

export interface ScreenCapture {
  captureId: string;
  screenId: string;
  screenName: string;
  sourceType: CaptureSourceType;
  path?: string;
  url?: string;
  viewport: ViewportProfile;
  capturedAt: number;
  signals: RenderedUISignals;
  customerJourneyStep?: string;
}
