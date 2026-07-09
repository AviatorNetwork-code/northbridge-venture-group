export type InterruptionType =
  | "company"
  | "pricing"
  | "products"
  | "services"
  | "founder"
  | "location"
  | "website"
  | "human_assistance"
  | "navigation"
  | "general_knowledge"
  | "small_talk";

export type SupportedLanguage = "en" | "es";

export type InterruptionDetectionContext = {
  message: string;
  hasPendingQuestion: boolean;
  pendingQuestionId?: string;
};

export type InterruptionDetection = {
  isInterruption: boolean;
  type?: InterruptionType;
  confidence: number;
};

export type InterruptionResumeContext = {
  pendingQuestionId?: string;
  pendingQuestionPrompt?: string;
  language?: SupportedLanguage;
  questionStillPending: boolean;
};

export type InterruptionHandleInput = {
  detection: InterruptionDetection;
  language?: SupportedLanguage;
  resume: InterruptionResumeContext;
};

export type InterruptionHandleResult = {
  answer: string;
  resumeLine?: string;
  fullReply: string;
};
