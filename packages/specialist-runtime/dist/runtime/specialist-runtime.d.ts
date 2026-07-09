import type { CapabilityRegistry } from "../types/capabilities.js";
import type { SpecialistConversationAdapter } from "../types/conversation.js";
import type { SpecialistSession } from "../types/context.js";
import type { ExecutionHooks, RuntimePolicy } from "../types/policy.js";
import type { ProgressReporter, TaskExecutor } from "../types/execution.js";
import type { SpecialistMemoryAdapter } from "../types/memory.js";
import type { LifecycleEvents } from "../types/lifecycle.js";
import type { RunTaskInput, RunTaskResult, SpecialistRuntime } from "./types.js";
export interface SpecialistRuntimeDependencies {
    capabilityRegistry: CapabilityRegistry;
    taskExecutor: TaskExecutor;
    policy?: RuntimePolicy;
    memoryAdapter?: SpecialistMemoryAdapter;
    conversationAdapter?: SpecialistConversationAdapter;
    progressReporter?: ProgressReporter;
    hooks?: ExecutionHooks;
    lifecycle?: LifecycleEvents;
    now?: () => string;
    createSessionId?: () => string;
}
export declare class DefaultSpecialistRuntime implements SpecialistRuntime {
    private session;
    private readonly deps;
    constructor(dependencies: SpecialistRuntimeDependencies);
    getState(): "escalated" | "idle" | "task_assigned" | "context_loaded" | "memory_loaded" | "capability_validated" | "executing" | "result_validated" | "complete";
    getSession(): SpecialistSession | null;
    reset(): void;
    runTask(input: RunTaskInput): Promise<RunTaskResult>;
    private assertSpecialistCanRun;
    private loadContext;
    private loadMemory;
    private transition;
    private escalate;
    private emitTransition;
    private emitLifecycle;
    private reportProgress;
}
export declare function createSpecialistRuntime(dependencies: SpecialistRuntimeDependencies): SpecialistRuntime;
