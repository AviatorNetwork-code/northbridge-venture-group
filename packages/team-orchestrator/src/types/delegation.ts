import type { Specialist, Task, TaskResult } from "@northbridge/workforce-contracts";
import type { ConfidenceScore } from "@northbridge/specialist-runtime";
import type { TeamEscalation } from "./escalation.js";

export type DelegationStatus =
  | "pending"
  | "delegated"
  | "complete"
  | "escalated"
  | "failed";

export interface DelegatedTask {
  delegationId: string;
  planTaskId: string;
  task: Task;
  specialist: Specialist;
  status: DelegationStatus;
}

export type DelegationOutcome = "complete" | "escalated" | "failed";

export interface DelegationResult {
  delegationId: string;
  planTaskId: string;
  specialistId: string;
  outcome: DelegationOutcome;
  result?: TaskResult;
  escalation?: TeamEscalation;
  confidence?: ConfidenceScore;
  error?: string;
  completedAt: string;
}
