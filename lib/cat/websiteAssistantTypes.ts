export type CatRecommendationAction =
  | "explore_products"
  | "complete_assessment"
  | "contact"
  | "book_meeting"
  | "continue_browsing";

export type CatCtaKind =
  | "internal"
  | "external"
  | "email";

export interface CatCta {
  id: string;
  label: string;
  href: string;
  kind: CatCtaKind;
  action?: CatRecommendationAction;
}

export interface CatMessageRecord {
  id: string;
  role: "assistant" | "user";
  content: string;
  ctas?: CatCta[];
  timestamp: number;
}

export interface CatRecommendation {
  action: CatRecommendationAction;
  summary: string;
  reason: string;
}

export interface CatAssistantResponse {
  message: string;
  ctas: CatCta[];
  recommendation?: CatRecommendation;
  matchedTopic?: string;
}

export interface CatQuickQuestion {
  id: string;
  label: string;
  prompt: string;
}

export interface CatRuntimeAdapter {
  /** Future hook for live CAT runtime integration. */
  mode: "static" | "runtime";
  respond: (input: string, context?: CatConversationContext) => Promise<CatAssistantResponse>;
}

export interface CatConversationContext {
  messageHistory: CatMessageRecord[];
  pagePath?: string;
}

export type CatAnalyticsEventName =
  | "cat_opened"
  | "cat_question_selected"
  | "cat_message_sent"
  | "cat_recommendation_generated"
  | "cat_cta_clicked"
  | "cat_closed";

export interface CatAnalyticsPayload {
  event: CatAnalyticsEventName;
  timestamp: number;
  properties?: Record<string, string | number | boolean | undefined>;
}

export type CatAnalyticsHandler = (payload: CatAnalyticsPayload) => void;
