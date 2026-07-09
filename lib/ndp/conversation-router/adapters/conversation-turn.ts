import { decideConversationTurn } from "@northbridge/conversation-engine";
import type { NordiConversationHandler, NordiHandlerMode, NordiHandlerResult } from "../handlers/passthrough-handlers.js";
import type { CustomerRequest } from "../types/customer-request.js";
import type { ConversationContext } from "../types/conversation-context.js";
import type { ConversationOwnership } from "../types/ownership.js";

/**
 * Wraps conversation-engine turn policy for Nordi customer-success mode.
 * Product orchestration still owns copy and presenter delivery.
 */
export class ConversationEngineNordiHandler implements NordiConversationHandler {
  constructor(private readonly inner: NordiConversationHandler) {}

  async handle(input: {
    request: CustomerRequest;
    context: ConversationContext;
    ownership: ConversationOwnership;
    mode: NordiHandlerMode;
  }): Promise<NordiHandlerResult> {
    const result = await this.inner.handle(input);

    const turn = decideConversationTurn({
      message: input.request.message,
      asyncInFlight: false,
      workflowComplete: false,
      requiresConfirmation: input.mode === "clarify",
      toolReady: false,
      hasPendingQuestions: input.mode === "clarify" || input.mode === "routing_failure",
      canAnswerDirectly: input.mode === "direct" || input.mode === "bridge",
    });

    return {
      ...result,
      turnAction: turn.action,
    };
  }
}
