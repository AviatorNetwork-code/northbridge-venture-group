import type { ConversationContext } from "../types/conversation-context.js";
import type { ConversationOwnership } from "../types/ownership.js";
import type { CustomerRequest } from "../types/customer-request.js";

export interface NordiHandlerResult {
  reply: string;
  turnAction?: string;
}

export type NordiHandlerMode =
  | "direct"
  | "clarify"
  | "bridge"
  | "subscription_gap"
  | "routing_failure";

export interface NordiConversationHandler {
  handle(input: {
    request: CustomerRequest;
    context: ConversationContext;
    ownership: ConversationOwnership;
    mode: NordiHandlerMode;
  }): Promise<NordiHandlerResult>;
}

export interface TeamHandlerResult {
  reply: string;
  escalated?: boolean;
  telemetry?: {
    synthesisEmitted?: boolean;
    escalationEmitted?: boolean;
  };
}

export interface TeamExecutionHandler {
  execute(input: {
    request: CustomerRequest;
    context: ConversationContext;
    ownership: ConversationOwnership;
    teamId: string;
  }): Promise<TeamHandlerResult>;
}

export class PassthroughNordiConversationHandler implements NordiConversationHandler {
  async handle(input: {
    request: CustomerRequest;
    context: ConversationContext;
    ownership: ConversationOwnership;
    mode: NordiHandlerMode;
  }): Promise<NordiHandlerResult> {
    const { mode, ownership } = input;

    switch (mode) {
      case "subscription_gap":
        return {
          reply:
            "Your organization subscription is not active yet. I can explain services and help you get set up.",
          turnAction: "answer",
        };
      case "routing_failure":
        return {
          reply:
            "I could not route that request to a team yet. Tell me which area you need help with.",
          turnAction: "ask",
        };
      case "clarify":
        return {
          reply: "Could you clarify whether this is about your account or a specific team task?",
          turnAction: "ask",
        };
      case "bridge":
        return {
          reply:
            ownership.bridgeNote ??
            "Your team is handling this request. I remain available for broader questions.",
          turnAction: "answer",
        };
      case "direct":
      default:
        return {
          reply: `Nordi received: ${input.request.message}`,
          turnAction: "answer",
        };
    }
  }
}

export class PassthroughTeamExecutionHandler implements TeamExecutionHandler {
  async execute(input: {
    request: CustomerRequest;
    context: ConversationContext;
    ownership: ConversationOwnership;
    teamId: string;
  }): Promise<TeamHandlerResult> {
    return {
      reply: `Team ${input.teamId} completed your request: ${input.request.message}`,
      escalated: false,
    };
  }
}
