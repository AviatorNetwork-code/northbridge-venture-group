export type CommunicationRouterErrorCode =
  | "invalid_request"
  | "organization_not_found"
  | "team_not_entitled"
  | "team_not_hired"
  | "routing_failed"
  | "future_owner_not_supported"
  | "handler_failed";

export class CommunicationRouterError extends Error {
  readonly code: CommunicationRouterErrorCode;
  readonly detail?: Record<string, unknown>;

  constructor(
    code: CommunicationRouterErrorCode,
    message: string,
    options?: { detail?: Record<string, unknown>; cause?: unknown },
  ) {
    super(message, options?.cause ? { cause: options.cause } : undefined);
    this.name = "CommunicationRouterError";
    this.code = code;
    this.detail = options?.detail;
  }
}
