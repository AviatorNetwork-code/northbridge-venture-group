/**
 * Task execution lifecycle states for a specialist session.
 * Distinct from workforce entity status (provisioned/active/...) in workforce-contracts.
 */
export const RUNTIME_LIFECYCLE_STATES = [
    "idle",
    "task_assigned",
    "context_loaded",
    "memory_loaded",
    "capability_validated",
    "executing",
    "result_validated",
    "complete",
    "escalated",
];
