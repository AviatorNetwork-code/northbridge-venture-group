import type { RuntimeLifecycleState } from "../types/lifecycle.js";
import { SpecialistRuntimeError } from "./errors.js";

const ALLOWED_TRANSITIONS: Record<
  RuntimeLifecycleState,
  RuntimeLifecycleState[]
> = {
  idle: ["task_assigned"],
  task_assigned: ["context_loaded", "escalated"],
  context_loaded: ["memory_loaded", "escalated"],
  memory_loaded: ["capability_validated", "escalated"],
  capability_validated: ["executing", "escalated"],
  executing: ["result_validated", "escalated"],
  result_validated: ["complete", "escalated"],
  complete: [],
  escalated: [],
};

export function canTransition(
  from: RuntimeLifecycleState,
  to: RuntimeLifecycleState,
): boolean {
  return ALLOWED_TRANSITIONS[from].includes(to);
}

export function assertTransition(
  from: RuntimeLifecycleState,
  to: RuntimeLifecycleState,
): void {
  if (!canTransition(from, to)) {
    throw new SpecialistRuntimeError(
      "invalid_transition",
      `Cannot transition from '${from}' to '${to}'`,
      { state: from, detail: { from, to } },
    );
  }
}

export function isTerminalState(state: RuntimeLifecycleState): boolean {
  return state === "complete" || state === "escalated";
}

export function assertNonTerminalState(state: RuntimeLifecycleState): void {
  if (isTerminalState(state)) {
    throw new SpecialistRuntimeError(
      "invalid_state",
      `Session is in terminal state '${state}'`,
      { state },
    );
  }
}
