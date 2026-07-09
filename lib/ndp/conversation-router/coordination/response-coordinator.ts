import type {
  CoordinatedResponseInput,
  CustomerInteractionSession,
  ResponseEnvelope,
  ResponseEnvelopeMetadata,
} from "../types/response.js";

export interface ResponseCoordinator {
  coordinate(input: CoordinatedResponseInput): ResponseEnvelope;
}

export class DefaultResponseCoordinator implements ResponseCoordinator {
  coordinate(input: CoordinatedResponseInput): ResponseEnvelope {
    const session: CustomerInteractionSession = {
      sessionId: `${input.orgId}:${input.customerId}:${input.threadId}`,
      threadId: input.threadId,
      orgId: input.orgId,
      customerId: input.customerId,
      owner: input.owner,
      channel: input.channel,
      updatedAt: input.now,
    };

    const metadata: ResponseEnvelopeMetadata = {
      ...input.metadata,
      ownershipSource: input.metadata?.ownershipSource,
    };

    return {
      requestId: input.requestId,
      orgId: input.orgId,
      owner: input.owner,
      reply: input.reply,
      session,
      metadata,
    };
  }
}
