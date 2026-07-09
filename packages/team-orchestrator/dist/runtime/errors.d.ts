import type { TeamRequestLifecycleState } from "../types/lifecycle.js";
export type TeamOrchestratorErrorCode = "invalid_state" | "invalid_transition" | "owner_conflict" | "request_mismatch" | "no_specialists" | "delegation_failed" | "conflict_detected" | "synthesis_failed" | "policy_violation" | "concurrent_request";
export declare class TeamOrchestratorError extends Error {
    readonly code: TeamOrchestratorErrorCode;
    readonly state?: TeamRequestLifecycleState;
    readonly detail?: Record<string, unknown>;
    constructor(code: TeamOrchestratorErrorCode, message: string, options?: {
        state?: TeamRequestLifecycleState;
        detail?: Record<string, unknown>;
        cause?: unknown;
    });
}
