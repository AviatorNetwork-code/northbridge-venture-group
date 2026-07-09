/**
 * Customer ingress channel for Northbridge Digital Communication Router.
 * @see docs/northbridge-digital-workforce-communication-protocol-v1.md §4
 */
export type CustomerRequestChannel = "nordi-thread" | "team-thread" | "unknown";

export interface CustomerRequest {
  requestId: string;
  orgId: string;
  customerId: string;
  threadId: string;
  channel: CustomerRequestChannel;
  message: string;
  intentTags?: string[];
  capabilityTags?: string[];
  /** Required when channel is team-thread */
  teamId?: string;
  receivedAt: string;
  metadata?: Record<string, unknown>;
}
