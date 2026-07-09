import type { TeamRequestLifecycleState } from "../types/lifecycle.js";
import { TeamOrchestratorError } from "./errors.js";

const ALLOWED_TRANSITIONS: Record<
  TeamRequestLifecycleState,
  TeamRequestLifecycleState[]
> = {
  received: ["owner_assigned"],
  owner_assigned: ["plan_created"],
  plan_created: ["specialists_selected"],
  specialists_selected: ["tasks_delegated"],
  tasks_delegated: ["specialists_executed"],
  specialists_executed: ["results_collected"],
  results_collected: ["conflicts_checked"],
  conflicts_checked: ["synthesis_created", "escalated"],
  synthesis_created: ["complete", "escalated"],
  complete: [],
  escalated: [],
};

export function canTeamTransition(
  from: TeamRequestLifecycleState,
  to: TeamRequestLifecycleState,
): boolean {
  return ALLOWED_TRANSITIONS[from].includes(to);
}

export function assertTeamTransition(
  from: TeamRequestLifecycleState,
  to: TeamRequestLifecycleState,
): void {
  if (!canTeamTransition(from, to)) {
    throw new TeamOrchestratorError(
      "invalid_transition",
      `Cannot transition from '${from}' to '${to}'`,
      { state: from, detail: { from, to } },
    );
  }
}

export function isTeamTerminalState(state: TeamRequestLifecycleState): boolean {
  return state === "complete" || state === "escalated";
}
