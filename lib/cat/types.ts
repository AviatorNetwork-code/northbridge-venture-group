export type BusinessProfile = {
  industry?: string;
  employeeCount?: number;
  goals?: string[];
  challenges?: string[];
  existingSoftware?: string[];
  communicationChannels?: string[];
  notes?: string[];
  pendingQuestionId?: string;
  pendingQuestionPrompt?: string;
  answeredQuestions?: string[];
};

export type CatMessageRole = "user" | "cat";

export type CatMessage = {
  id: string;
  role: CatMessageRole;
  content: string;
  timestamp: string;
  recommendations?: CatRecommendation[];
};

export type CatRecommendation = {
  tier: "specialist" | "team" | "manager" | "regional-manager" | "connector";
  name: string;
  status: "recommended" | "optional" | "not-recommended";
  reason: string;
};

export type CatAction = {
  type: "navigate" | "highlight";
  label: string;
  href?: string;
};

export type CatSession = {
  id: string;
  messages: CatMessage[];
  businessProfile: BusinessProfile;
};

export type CatEngineResult = {
  reply: string;
  quickReplies?: string[];
  actions?: CatAction[];
  recommendations?: CatRecommendation[];
  profileUpdates?: Partial<BusinessProfile>;
};

export type CatEngineContext = {
  session: CatSession;
  currentModule: string;
};

export const CAT_STORAGE_KEY = "northbridge-cat-session";

export const CAT_WELCOME_MESSAGE =
  "I'm CAT — your Northbridge Workforce Advisor. I help you discover what your business needs, recommend the right Specialists and Teams, and guide you through the Operations Center. I don't perform operational work — I advise and coordinate.";

export const CAT_INITIAL_QUICK_REPLIES = [
  "I own a dental clinic",
  "What's my onboarding status?",
  "Take me to Connectors",
  "What do I need to get started?",
  "Explain pricing",
];
