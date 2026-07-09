export type WorkforceRouterErrorCode =
  | "invalid_request"
  | "owner_required"
  | "owner_conflict"
  | "nordi_not_routable"
  | "transfer_mismatch"
  | "policy_violation";

export class WorkforceRouterError extends Error {
  readonly code: WorkforceRouterErrorCode;
  readonly detail?: Record<string, unknown>;

  constructor(
    code: WorkforceRouterErrorCode,
    message: string,
    options?: {
      detail?: Record<string, unknown>;
      cause?: unknown;
    },
  ) {
    super(message, options?.cause ? { cause: options.cause } : undefined);
    this.name = "WorkforceRouterError";
    this.code = code;
    this.detail = options?.detail;
  }
}
