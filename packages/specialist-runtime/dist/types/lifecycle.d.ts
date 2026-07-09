/**
 * Task execution lifecycle states for a specialist session.
 * Distinct from workforce entity status (provisioned/active/...) in workforce-contracts.
 */
export declare const RUNTIME_LIFECYCLE_STATES: readonly ["idle", "task_assigned", "context_loaded", "memory_loaded", "capability_validated", "executing", "result_validated", "complete", "escalated"];
export type RuntimeLifecycleState = (typeof RUNTIME_LIFECYCLE_STATES)[number];
export type LifecycleEventName = "task.assigned" | "context.loaded" | "memory.loaded" | "capability.validated" | "capability.rejected" | "execution.started" | "execution.progress" | "execution.completed" | "result.validated" | "result.rejected" | "task.complete" | "task.escalated";
export interface LifecycleEvent {
    name: LifecycleEventName;
    state: RuntimeLifecycleState;
    taskId?: string;
    specialistId?: string;
    timestamp: string;
    detail?: Record<string, unknown>;
}
export interface LifecycleTransitionEvent extends LifecycleEvent {
    from: RuntimeLifecycleState;
    to: RuntimeLifecycleState;
}
export type LifecycleEvents = {
    onEvent?: (event: LifecycleEvent) => void | Promise<void>;
    onTransition?: (event: LifecycleTransitionEvent) => void | Promise<void>;
};
