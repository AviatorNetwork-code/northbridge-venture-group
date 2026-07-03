export type OutcomeClassification =
  | "completed_objective"
  | "partially_completed"
  | "abandoned"
  | "more_engaged"
  | "requested_contact"
  | "requested_demo"
  | "entered_marketplace"
  | "started_onboarding"
  | "scheduled_training"
  | "returned_later";

export interface OutcomeAssessment {
  classification: OutcomeClassification;
  successScore: number;
  objectiveAchieved: boolean;
  partialCompletionReasons: string[];
  nextBestActionTaken: boolean;
  summary: string;
}
