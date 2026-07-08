export interface JourneyEvent {
  type:
    | "entry"
    | "page_view"
    | "navigation"
    | "cat_opened"
    | "cat_message"
    | "cat_cta_clicked"
    | "cat_closed"
    | "form_submit"
    | "search"
    | "friction"
    | "decision_point"
    | "objective_completed"
    | "adapter";
  timestamp: number;
  path?: string;
  label?: string;
  metadata?: Record<string, string | number | boolean>;
}

export interface JourneyUnderstanding {
  entryPoint?: string;
  discoveryPath: string[];
  catInteractionCount: number;
  navigationSequence: string[];
  timeToUnderstandingMs?: number;
  timeToValueMs?: number;
  abandonedPages: string[];
  completedObjectives: string[];
  unansweredQuestions: string[];
  decisionPoints: string[];
  frictionEvents: FrictionEvent[];
}

export interface FrictionEvent {
  timestamp: number;
  type: "back_navigation" | "repeated_visit" | "cat_fallback" | "long_dwell_no_action" | "adapter";
  path?: string;
  description: string;
}
