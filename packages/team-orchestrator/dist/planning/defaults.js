export class PassthroughSpecialistSelector {
    selections;
    constructor(selections) {
        this.selections = selections;
    }
    async select(input) {
        if (typeof this.selections === "function") {
            return this.selections(input);
        }
        return this.selections;
    }
}
export class DefaultExecutionPlanBuilder {
    async buildPlan(input) {
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
                topicKey: typeof input.payload.topicKey === "string"
                    ? input.payload.topicKey
                    : selection.capabilityId,
            })),
            createdAt: now,
        };
    }
}
