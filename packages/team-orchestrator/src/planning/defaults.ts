import type {
  ExecutionPlanBuildInput,
  ExecutionPlanBuilder,
  SpecialistSelector,
  SpecialistSelection,
  SpecialistSelectionInput,
  TeamExecutionPlan,
} from "../types/plan.js";

export class PassthroughSpecialistSelector implements SpecialistSelector {
  constructor(
    private readonly selections: SpecialistSelection[] | ((input: SpecialistSelectionInput) => SpecialistSelection[]),
  ) {}

  async select(input: SpecialistSelectionInput): Promise<SpecialistSelection[]> {
    if (typeof this.selections === "function") {
      return this.selections(input);
    }
    return this.selections;
  }
}

export class DefaultExecutionPlanBuilder implements ExecutionPlanBuilder {
  async buildPlan(input: ExecutionPlanBuildInput): Promise<TeamExecutionPlan> {
    const now = input.now ?? new Date().toISOString();
    return {
      planId: `plan-${input.requestId}`,
      requestId: input.requestId,
      teamId: input.teamId,
      tasks: input.selections.map((selection, index) => ({
        planTaskId: `plan-task-${index + 1}`,
        selection,
        instructions: {
          ...input.payload,
          capabilityId: selection.capabilityId,
        },
        topicKey:
          typeof input.payload.topicKey === "string"
            ? input.payload.topicKey
            : selection.capabilityId,
      })),
      createdAt: now,
    };
  }
}
