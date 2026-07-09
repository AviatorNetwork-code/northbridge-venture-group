import { SpecialistRuntimeError } from "./errors.js";
const ALLOWED_TRANSITIONS = {
    idle: ["task_assigned"],
    task_assigned: ["context_loaded", "escalated"],
    context_loaded: ["memory_loaded", "escalated"],
    memory_loaded: ["capability_validated", "escalated"],
    capability_validated: ["executing", "escalated"],
    executing: ["result_validated", "escalated"],
    result_validated: ["complete", "escalated"],
    complete: [],
    escalated: [],
};
export function canTransition(from, to) {
    return ALLOWED_TRANSITIONS[from].includes(to);
}
export function assertTransition(from, to) {
    if (!canTransition(from, to)) {
        throw new SpecialistRuntimeError("invalid_transition", `Cannot transition from '${from}' to '${to}'`, { state: from, detail: { from, to } });
    }
}
export function isTerminalState(state) {
    return state === "complete" || state === "escalated";
}
export function assertNonTerminalState(state) {
    if (isTerminalState(state)) {
        throw new SpecialistRuntimeError("invalid_state", `Session is in terminal state '${state}'`, { state });
    }
}
