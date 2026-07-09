function defaultResolveCapabilityId(input) {
    const fromContext = input.context.payload.capabilityId;
    if (typeof fromContext === "string" && fromContext.length > 0) {
        return fromContext;
    }
    const fromTask = input.context.task.context?.capabilityId;
    if (typeof fromTask === "string" && fromTask.length > 0) {
        return fromTask;
    }
    return "execute_task";
}
function defaultResolveInput(input, capabilityId) {
    return {
        capabilityId,
        taskId: input.context.task.id,
        instruction: input.context.task.context?.instruction,
        context: input.context.payload,
    };
}
function defaultMapOutput(result) {
    if (result.status === "denied") {
        throw new Error(result.error ?? "Capability execution denied");
    }
    if (result.status === "failed") {
        throw new Error(result.error ?? "Capability execution failed");
    }
    const summary = typeof result.output?.summary === "string"
        ? result.output.summary
        : "Capability executed successfully";
    return {
        summary,
        evidence: Array.isArray(result.output?.evidence)
            ? result.output.evidence
            : undefined,
        confidence: {
            level: "high",
            score: 0.9,
        },
        contextUpdates: result.output,
    };
}
function buildPermissionEnvelope(input) {
    return {
        orgId: input.context.orgId,
        specialistId: input.context.specialist.id,
        teamId: input.context.teamId,
        permissions: input.context.task.permissions,
    };
}
/**
 * TaskExecutor that routes through capability → connector registry → connector.
 * The executor does not know which provider satisfies the capability.
 */
export function createCapabilityRoutedTaskExecutor(options) {
    const now = options.now ?? (() => new Date().toISOString());
    const createRequestId = options.createRequestId ?? (() => `cap-req-${crypto.randomUUID()}`);
    const resolveCapabilityId = options.resolveCapabilityId ?? defaultResolveCapabilityId;
    const resolveInput = options.resolveInput ?? defaultResolveInput;
    const mapOutput = options.mapOutput ?? defaultMapOutput;
    return {
        execute: async (input) => {
            const capabilityId = resolveCapabilityId(input);
            const request = {
                requestId: createRequestId(),
                capabilityId,
                orgId: input.context.orgId,
                teamId: input.context.teamId,
                specialistId: input.context.specialist.id,
                correlationId: input.session.sessionId,
                input: resolveInput(input, capabilityId),
                timestamp: now(),
            };
            const result = await options.router.invoke(request, buildPermissionEnvelope(input));
            return mapOutput(result, input);
        },
    };
}
