import type { RuntimeLifecycleState } from "../types/lifecycle.js";

export type SpecialistRuntimeErrorCode =
  | "invalid_state"
  | "invalid_transition"
  | "permission_denied"
  | "capability_missing"
  | "capability_denied"
  | "specialist_inactive"
  | "task_mismatch"
  | "execution_failed"
  | "result_invalid"
  | "confidence_too_low"
  | "escalation_required";

export class SpecialistRuntimeError extends Error {
  readonly code: SpecialistRuntimeErrorCode;
  readonly state?: RuntimeLifecycleState;
  readonly detail?: Record<string, unknown>;

  constructor(
    code: SpecialistRuntimeErrorCode,
    message: string,
    options?: {
      state?: RuntimeLifecycleState;
      detail?: Record<string, unknown>;
      cause?: unknown;
    },
  ) {
    super(message, options?.cause ? { cause: options.cause } : undefined);
    this.name = "SpecialistRuntimeError";
    this.code = code;
    this.state = options?.state;
    this.detail = options?.detail;
  }
}
