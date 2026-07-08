export interface CatInteractionRecord {
  timestamp: number;
  role: "visitor" | "cat";
  content: string;
  matchedTopic?: string;
  recommendationAction?: string;
  ctaClicked?: string;
}

export interface ConversationEvaluation {
  intentIdentifiedCorrectly: boolean;
  followUpQuestionsAppropriate: boolean;
  conversationTooLong: boolean;
  unnecessaryInformationPresented: boolean;
  recommendationsPersonalized: boolean;
  guidedToNextBestAction: boolean;
  catGuidanceScore: number;
  improvementRecommendations: string[];
}
