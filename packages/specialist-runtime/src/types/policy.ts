import type { ConfidenceLevel } from "./confidence.js";
import type { SpecialistSession } from "./context.js";
import type { EscalationRequest } from "./memory.js";
import type { TaskExecutionOutput } from "./execution.js";

export interface RuntimePolicy {
  /** Capability id required before execution; must exist in registry. */
  requiredCapabilityId: string;
  /** Minimum confidence required to accept a TaskResult without escalation. */
  minimumConfidence: ConfidenceLevel;
  /** Reject execution when specialist entity status is not active. */
  requireActiveSpecialist: boolean;
  /** Whether to load memory adapter when present. */
  loadMemory: boolean;
  /** Whether to load conversation adapter when thread ref present. */
  loadConversationContext: boolean;
}

export const DEFAULT_RUNTIME_POLICY: RuntimePolicy = {
  requiredCapabilityId: "execute_task",
  minimumConfidence: "low",
  requireActiveSpecialist: true,
  loadMemory: true,
  loadConversationContext: true,
};

export interface ExecutionHooks {
  onBeforeExecute?(session: SpecialistSession): void | Promise<void>;
  onAfterExecute?(
    session: SpecialistSession,
    output: TaskExecutionOutput,
  ): void | Promise<void>;
  onEscalation?(request: EscalationRequest): void | Promise<void>;
}
