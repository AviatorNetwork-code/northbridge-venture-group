import type { SpecialistContext, SpecialistSession } from "./context.js";
import type { ConfidenceScore } from "./confidence.js";

export type ProgressPhase =
  | "context"
  | "memory"
  | "validation"
  | "execution"
  | "result";

export interface ProgressEvent {
  sessionId: string;
  taskId: string;
  specialistId: string;
  phase: ProgressPhase;
  message: string;
  percent?: number;
  timestamp: string;
}

export interface ProgressReporter {
  report(event: ProgressEvent): void | Promise<void>;
}

export class InMemoryProgressReporter implements ProgressReporter {
  readonly events: ProgressEvent[] = [];

  report(event: ProgressEvent): void {
    this.events.push(event);
  }
}

export interface TaskExecutionInput {
  session: SpecialistSession;
  context: SpecialistContext;
}

export interface TaskExecutionOutput {
  summary: string;
  evidence?: string[];
  artifacts?: Array<{
    id: string;
    type: string;
    uri?: string;
    label?: string;
  }>;
  confidence: ConfidenceScore;
  contextUpdates?: Record<string, unknown>;
}

export interface TaskExecutor {
  execute(input: TaskExecutionInput): Promise<TaskExecutionOutput>;
}

export interface ExecutionEnvironment {
  session: SpecialistSession;
  context: SpecialistContext;
  now(): string;
}
