import type { RequestOwner } from "@northbridge/workforce-contracts";
import type { CustomerRequestChannel } from "./customer-request.js";

export interface CustomerInteractionSession {
  sessionId: string;
  threadId: string;
  orgId: string;
  customerId: string;
  owner: RequestOwner;
  channel: CustomerRequestChannel;
  updatedAt: string;
}

export interface ResponseEnvelope {
  requestId: string;
  orgId: string;
  owner: RequestOwner;
  reply: string;
  session: CustomerInteractionSession;
  metadata?: ResponseEnvelopeMetadata;
}

export interface ResponseEnvelopeMetadata {
  routingAuditId?: string;
  turnAction?: string;
  escalated?: boolean;
  ownershipSource?: string;
  bridgeNote?: string;
}

export interface CoordinatedResponseInput {
  requestId: string;
  orgId: string;
  customerId: string;
  threadId: string;
  channel: CustomerRequestChannel;
  owner: RequestOwner;
  reply: string;
  now: string;
  metadata?: ResponseEnvelopeMetadata;
}
