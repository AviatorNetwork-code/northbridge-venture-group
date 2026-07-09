export const TEAM_REQUEST_LIFECYCLE_STATES = [
  "received",
  "owner_assigned",
  "plan_created",
  "specialists_selected",
  "tasks_delegated",
  "specialists_executed",
  "results_collected",
  "conflicts_checked",
  "synthesis_created",
  "complete",
  "escalated",
] as const;

export type TeamRequestLifecycleState =
  (typeof TEAM_REQUEST_LIFECYCLE_STATES)[number];

export type TeamLifecycleEventName =
  | "request.received"
  | "owner.assigned"
  | "plan.created"
  | "specialists.selected"
  | "tasks.delegated"
  | "specialists.executed"
  | "results.collected"
  | "conflicts.checked"
  | "synthesis.created"
  | "request.complete"
  | "request.escalated"
  | "progress.reported";

export interface TeamLifecycleEvent {
  name: TeamLifecycleEventName;
  state: TeamRequestLifecycleState;
  sessionId: string;
  requestId: string;
  timestamp: string;
  detail?: Record<string, unknown>;
}

export interface TeamLifecycleEvents {
  onEvent?: (event: TeamLifecycleEvent) => void | Promise<void>;
}
