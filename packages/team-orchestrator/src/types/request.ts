import type { RequestOwner } from "@northbridge/workforce-contracts";
import type { TeamRequestLifecycleState } from "./lifecycle.js";
import type { TeamExecutionPlan } from "./plan.js";
import type { DelegatedTask, DelegationResult } from "./delegation.js";
import type { TeamSynthesisResult } from "./synthesis.js";
import type { TeamConflict } from "./conflict.js";

export type TeamRequestSource = "customer" | "connector" | "scheduled";

/**
 * Team-level inbound work unit owned by the Team Lead.
 */
export interface TeamRequest {
  id: string;
  orgId: string;
  teamId: string;
  teamLeadId: string;
  source: TeamRequestSource;
  payload: Record<string, unknown>;
  customerThreadRef?: string;
  receivedAt: string;
}

export interface TeamSession {
  sessionId: string;
  request: TeamRequest;
  owner: RequestOwner;
  state: TeamRequestLifecycleState;
  plan?: TeamExecutionPlan;
  delegations: DelegatedTask[];
  results: DelegationResult[];
  conflicts: TeamConflict[];
  synthesis?: TeamSynthesisResult;
  startedAt: string;
  updatedAt: string;
}

export interface CreateTeamSessionInput {
  sessionId: string;
  request: TeamRequest;
  owner: RequestOwner;
  now?: string;
}
