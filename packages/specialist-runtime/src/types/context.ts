import type { Specialist, Task } from "@northbridge/workforce-contracts";
import type { RuntimeLifecycleState } from "./lifecycle.js";
import type { ConfidenceScore } from "./confidence.js";

export interface SpecialistContext {
  orgId: string;
  teamId: string;
  specialist: Specialist;
  task: Task;
  /** Merged task context + optional adapter-provided slices. */
  payload: Record<string, unknown>;
  threadRef?: string;
}

export interface SpecialistSession {
  sessionId: string;
  specialist: Specialist;
  task: Task;
  state: RuntimeLifecycleState;
  context?: SpecialistContext;
  startedAt: string;
  updatedAt: string;
  confidence?: ConfidenceScore;
}

export interface CreateSessionInput {
  sessionId: string;
  specialist: Specialist;
  task: Task;
  now?: string;
}
