import type { ExecutionPlanBuildInput, ExecutionPlanBuilder, SpecialistSelector, SpecialistSelection, SpecialistSelectionInput, TeamExecutionPlan } from "../types/plan.js";
export declare class PassthroughSpecialistSelector implements SpecialistSelector {
    private readonly selections;
    constructor(selections: SpecialistSelection[] | ((input: SpecialistSelectionInput) => SpecialistSelection[]));
    select(input: SpecialistSelectionInput): Promise<SpecialistSelection[]>;
}
export declare class DefaultExecutionPlanBuilder implements ExecutionPlanBuilder {
    buildPlan(input: ExecutionPlanBuildInput): Promise<TeamExecutionPlan>;
}
