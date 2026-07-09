import type {
  Specialist,
  Task,
  TaskResult,
} from "@northbridge/workforce-contracts";
import type { SpecialistSession } from "../types/context.js";
import type { EscalationRequest } from "../types/memory.js";
import type { ConfidenceScore } from "../types/confidence.js";

export type RunTaskOutcome = "complete" | "escalated" | "failed";

export interface RunTaskSuccess {
  outcome: "complete";
  session: SpecialistSession;
  result: TaskResult;
  confidence: ConfidenceScore;
}

export interface RunTaskEscalated {
  outcome: "escalated";
  session: SpecialistSession;
  escalation: EscalationRequest;
}

export interface RunTaskFailed {
  outcome: "failed";
  session?: SpecialistSession;
  error: import("../runtime/errors.js").SpecialistRuntimeError;
}

export type RunTaskResult = RunTaskSuccess | RunTaskEscalated | RunTaskFailed;

export interface RunTaskInput {
  task: Task;
  specialist: Specialist;
  sessionId?: string;
  /** Override capability used for this run (defaults to policy.requiredCapabilityId). */
  capabilityId?: string;
  /** When confidence is below policy, escalate to this target instead of failing. */
  escalationTarget?: {
    role: EscalationRequest["targetRole"];
    id: string;
  };
}

export interface SpecialistRuntime {
  /** Current lifecycle state of the active or last session. */
  getState(): import("../types/lifecycle.js").RuntimeLifecycleState;
  /** Active session if a task is in progress or terminal. */
  getSession(): SpecialistSession | null;
  /** Execute full lifecycle for one task assignment. */
  runTask(input: RunTaskInput): Promise<RunTaskResult>;
  /** Reset runtime to idle — only allowed from terminal or idle states. */
  reset(): void;
}
