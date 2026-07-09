import { parseTaskResult } from "@northbridge/workforce-contracts";
import { SpecialistRuntimeError } from "./errors.js";
import { assertNonTerminalState, assertTransition, isTerminalState, } from "./state-machine.js";
import { validateCapability } from "../registry/in-memory-capability-registry.js";
import { validateConfidenceAgainstPolicy, validateExecutionOutput, } from "../validation/results.js";
function createSession(input) {
    const now = input.now ?? new Date().toISOString();
    return {
        sessionId: input.sessionId,
        specialist: input.specialist,
        task: input.task,
        state: "idle",
        startedAt: now,
        updatedAt: now,
    };
}
export class DefaultSpecialistRuntime {
    session = null;
    deps;
    constructor(dependencies) {
        this.deps = {
            policy: dependencies.policy ?? {
                requiredCapabilityId: "execute_task",
                minimumConfidence: "low",
                requireActiveSpecialist: true,
                loadMemory: true,
                loadConversationContext: true,
            },
            ...dependencies,
            now: dependencies.now ?? (() => new Date().toISOString()),
            createSessionId: dependencies.createSessionId ??
                (() => `session-${crypto.randomUUID()}`),
        };
    }
    getState() {
        return this.session?.state ?? "idle";
    }
    getSession() {
        return this.session;
    }
    reset() {
        if (this.session && !isTerminalState(this.session.state)) {
            throw new SpecialistRuntimeError("invalid_state", "Cannot reset runtime while session is in progress", { state: this.session.state });
        }
        this.session = null;
    }
    async runTask(input) {
        if (this.session && !isTerminalState(this.session.state)) {
            return {
                outcome: "failed",
                session: this.session,
                error: new SpecialistRuntimeError("invalid_state", "A task is already in progress", { state: this.session.state }),
            };
        }
        try {
            this.assertSpecialistCanRun(input.specialist, input.task);
            this.session = createSession({
                sessionId: input.sessionId ?? this.deps.createSessionId(),
                specialist: input.specialist,
                task: input.task,
                now: this.deps.now(),
            });
            await this.transition("task_assigned", "task.assigned");
            const context = await this.loadContext(input.task, input.specialist);
            this.session.context = context;
            await this.transition("context_loaded", "context.loaded");
            if (this.deps.policy.loadMemory && this.deps.memoryAdapter) {
                await this.loadMemory(context);
            }
            await this.transition("memory_loaded", "memory.loaded");
            const capabilityId = input.capabilityId ?? this.deps.policy.requiredCapabilityId;
            const capabilityResult = validateCapability(this.deps.capabilityRegistry, input.specialist.specialistDefinitionId, capabilityId, input.task.permissions);
            if (!capabilityResult.valid) {
                if (input.escalationTarget) {
                    return this.escalate(capabilityResult.reason ?? "Capability validation failed", input.escalationTarget);
                }
                throw new SpecialistRuntimeError(capabilityResult.reason?.includes("not registered")
                    ? "capability_missing"
                    : "capability_denied", capabilityResult.reason ?? "Capability validation failed", { state: this.session.state });
            }
            await this.emitLifecycle("capability.validated", "capability_validated");
            await this.transition("capability_validated", "capability.validated");
            await this.deps.hooks?.onBeforeExecute?.(this.session);
            await this.transition("executing", "execution.started");
            const output = await this.deps.taskExecutor.execute({
                session: this.session,
                context,
            });
            validateExecutionOutput(output);
            this.session.confidence = output.confidence;
            await this.deps.hooks?.onAfterExecute?.(this.session, output);
            await this.emitLifecycle("execution.completed", "executing", {
                confidence: output.confidence,
            });
            await this.transition("result_validated", "result.validated");
            try {
                validateConfidenceAgainstPolicy(output.confidence, this.deps.policy);
            }
            catch (error) {
                if (error instanceof SpecialistRuntimeError &&
                    error.code === "confidence_too_low" &&
                    input.escalationTarget) {
                    return this.escalate(error.message, input.escalationTarget, output.confidence);
                }
                throw error;
            }
            const result = parseTaskResult({
                taskId: input.task.id,
                summary: output.summary,
                evidence: output.evidence ?? [],
                artifacts: output.artifacts ?? [],
                completedAt: this.deps.now(),
            });
            await this.transition("complete", "task.complete");
            return {
                outcome: "complete",
                session: this.session,
                result,
                confidence: output.confidence,
            };
        }
        catch (error) {
            if (error instanceof SpecialistRuntimeError) {
                return { outcome: "failed", session: this.session ?? undefined, error };
            }
            return {
                outcome: "failed",
                session: this.session ?? undefined,
                error: new SpecialistRuntimeError("execution_failed", error instanceof Error ? error.message : "Unknown execution failure", { cause: error, state: this.session?.state }),
            };
        }
    }
    assertSpecialistCanRun(specialist, task) {
        if (specialist.orgId !== task.orgId) {
            throw new SpecialistRuntimeError("task_mismatch", "Specialist orgId does not match task orgId");
        }
        if (task.specialistId && task.specialistId !== specialist.id) {
            throw new SpecialistRuntimeError("task_mismatch", "Task is assigned to a different specialist");
        }
        if (this.deps.policy.requireActiveSpecialist &&
            specialist.status !== "active") {
            throw new SpecialistRuntimeError("specialist_inactive", `Specialist status '${specialist.status}' cannot accept tasks`);
        }
    }
    async loadContext(task, specialist) {
        const payload = { ...task.context };
        if (this.deps.policy.loadConversationContext &&
            task.customerThreadRef &&
            this.deps.conversationAdapter?.loadThreadContext) {
            const threadContext = await this.deps.conversationAdapter.loadThreadContext(task.customerThreadRef, task.orgId);
            payload.threadContext = threadContext;
        }
        return {
            orgId: task.orgId,
            teamId: task.teamId,
            specialist,
            task,
            payload,
            threadRef: task.customerThreadRef,
        };
    }
    async loadMemory(context) {
        const reference = {
            orgId: context.orgId,
            specialistId: context.specialist.id,
            taskId: context.task.id,
            scope: "task",
            memoryKey: `${context.orgId}:${context.specialist.id}:${context.task.id}`,
        };
        const data = await this.deps.memoryAdapter.load(reference);
        context.payload.memory = data;
        await this.reportProgress("memory", "Memory loaded");
    }
    async transition(to, eventName) {
        if (!this.session) {
            throw new SpecialistRuntimeError("invalid_state", "No active session");
        }
        const from = this.session.state;
        if (from === "idle" && to === "task_assigned") {
            this.session.state = to;
            this.session.updatedAt = this.deps.now();
            await this.emitTransition(from, to, eventName);
            return;
        }
        assertNonTerminalState(from);
        assertTransition(from, to);
        this.session.state = to;
        this.session.updatedAt = this.deps.now();
        await this.emitTransition(from, to, eventName);
    }
    async escalate(reason, target, confidence) {
        if (!this.session) {
            throw new SpecialistRuntimeError("invalid_state", "No active session");
        }
        if (!isTerminalState(this.session.state)) {
            assertTransition(this.session.state, "escalated");
            this.session.state = "escalated";
            this.session.updatedAt = this.deps.now();
        }
        const escalation = {
            orgId: this.session.task.orgId,
            taskId: this.session.task.id,
            specialistId: this.session.specialist.id,
            sourceRole: "specialist",
            targetRole: target.role,
            targetId: target.id,
            reason,
            confidence,
            requestedAt: this.deps.now(),
        };
        await this.deps.hooks?.onEscalation?.(escalation);
        await this.emitLifecycle("task.escalated", "escalated", { reason });
        return { outcome: "escalated", session: this.session, escalation };
    }
    async emitTransition(from, to, name) {
        if (!this.session)
            return;
        const timestamp = this.deps.now();
        await this.deps.lifecycle?.onTransition?.({
            name,
            from,
            to,
            state: to,
            taskId: this.session.task.id,
            specialistId: this.session.specialist.id,
            timestamp,
        });
        await this.deps.lifecycle?.onEvent?.({
            name,
            state: to,
            taskId: this.session.task.id,
            specialistId: this.session.specialist.id,
            timestamp,
        });
    }
    async emitLifecycle(name, state, detail) {
        if (!this.session)
            return;
        await this.deps.lifecycle?.onEvent?.({
            name,
            state,
            taskId: this.session.task.id,
            specialistId: this.session.specialist.id,
            timestamp: this.deps.now(),
            detail,
        });
    }
    async reportProgress(phase, message, percent) {
        if (!this.session || !this.deps.progressReporter)
            return;
        await this.deps.progressReporter.report({
            sessionId: this.session.sessionId,
            taskId: this.session.task.id,
            specialistId: this.session.specialist.id,
            phase,
            message,
            percent,
            timestamp: this.deps.now(),
        });
        await this.emitLifecycle("execution.progress", this.session.state, {
            phase,
            message,
            percent,
        });
    }
}
export function createSpecialistRuntime(dependencies) {
    return new DefaultSpecialistRuntime(dependencies);
}
