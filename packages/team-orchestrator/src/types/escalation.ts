export type TeamEscalationTarget = "nordi" | "team_lead_review";

/**
 * Team-level escalation request. Nordi handling is out of scope for this package.
 */
export interface TeamEscalation {
  requestId: string;
  orgId: string;
  teamId: string;
  teamLeadId: string;
  reason: string;
  target: TeamEscalationTarget;
  sourceDelegationId?: string;
  requestedAt: string;
  context?: Record<string, unknown>;
}
