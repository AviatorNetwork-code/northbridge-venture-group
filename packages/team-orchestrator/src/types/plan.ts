export interface SpecialistSelection {
  specialistId: string;
  specialistDefinitionId: string;
  capabilityId: string;
  rationale?: string;
}

export interface PlannedTask {
  planTaskId: string;
  selection: SpecialistSelection;
  instructions: Record<string, unknown>;
  topicKey?: string;
}

export interface TeamExecutionPlan {
  planId: string;
  requestId: string;
  teamId: string;
  tasks: PlannedTask[];
  createdAt: string;
}

export interface SpecialistSelectionInput {
  requestId: string;
  orgId: string;
  teamId: string;
  payload: Record<string, unknown>;
  availableSpecialistIds: string[];
}

export interface SpecialistSelector {
  select(input: SpecialistSelectionInput): Promise<SpecialistSelection[]>;
}

export interface ExecutionPlanBuildInput {
  requestId: string;
  orgId: string;
  teamId: string;
  teamLeadId: string;
  payload: Record<string, unknown>;
  selections: SpecialistSelection[];
  now?: string;
}

export interface ExecutionPlanBuilder {
  buildPlan(input: ExecutionPlanBuildInput): Promise<TeamExecutionPlan>;
}
