import type {
  ConsultantSessionState,
  ConversationStage,
  ProductRecommendation,
  SessionScores,
} from "./consultantTypes";

export type CatRecommendationAction =
  | "explore_products"
  | "complete_assessment"
  | "contact"
  | "book_meeting"
  | "continue_browsing";

export type CatCtaKind = "internal" | "external" | "email";

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
  stage?: ConversationStage;
  stageLabel?: string;
  followUpQuestion?: string;
  productRecommendation?: ProductRecommendation;
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
  stage?: ConversationStage;
  stageLabel?: string;
  followUpQuestion?: string;
  productRecommendation?: ProductRecommendation;
  session?: ConsultantSessionState;
  sessionScoreDelta?: {
    before: SessionScores;
    after: SessionScores;
  };
  qualifiedLead?: boolean;
  primaryIntent?: string;
}

export interface CatQuickQuestion {
  id: string;
  label: string;
  prompt: string;
}

export interface CatRuntimeAdapter {
  mode: "static" | "consultant";
  respond: (input: string, context?: CatConversationContext) => Promise<CatAssistantResponse>;
}

export interface CatConversationContext {
  messageHistory: CatMessageRecord[];
  pagePath?: string;
  session?: ConsultantSessionState;
}

export type CatAnalyticsEventName =
  | "cat_opened"
  | "cat_closed"
  | "cat_question_selected"
  | "cat_message_sent"
  | "cat_recommendation_generated"
  | "cat_cta_clicked"
  | "cat_stage_transition"
  | "cat_product_recommended"
  | "cat_follow_up_asked"
  | "cat_understanding_signal_captured"
  | "cat_conversion_intent"
  | "cat_session_scores_updated"
  | "cat_conversation_completed"
  | "cat_qualified_lead_signal"
  | "cat_neo_export";

export interface CatAnalyticsPayload {
  event: CatAnalyticsEventName;
  timestamp: number;
  properties?: Record<string, string | number | boolean | undefined>;
}

export type CatAnalyticsHandler = (payload: CatAnalyticsPayload) => void;

export type { ConsultantSessionState, ConversationStage, ProductRecommendation, SessionScores };
