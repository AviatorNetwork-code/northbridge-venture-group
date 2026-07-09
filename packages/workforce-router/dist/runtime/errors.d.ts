export type WorkforceRouterErrorCode = "invalid_request" | "owner_required" | "owner_conflict" | "nordi_not_routable" | "transfer_mismatch" | "policy_violation";
export declare class WorkforceRouterError extends Error {
    readonly code: WorkforceRouterErrorCode;
    readonly detail?: Record<string, unknown>;
    constructor(code: WorkforceRouterErrorCode, message: string, options?: {
        detail?: Record<string, unknown>;
        cause?: unknown;
    });
}
