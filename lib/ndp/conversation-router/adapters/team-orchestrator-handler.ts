import type { TeamOrchestrator } from "@northbridge/team-orchestrator";
import type { TeamRequest } from "@northbridge/team-orchestrator";
import type { TeamExecutionHandler, TeamHandlerResult } from "../handlers/passthrough-handlers.js";
import type { CustomerRequest } from "../types/customer-request.js";
import type { ConversationContext } from "../types/conversation-context.js";
import type { ConversationOwnership } from "../types/ownership.js";
import { CommunicationRouterError } from "../router/errors.js";

export interface TeamOrchestratorExecutionHandlerOptions {
  orchestrator: TeamOrchestrator;
  resolveTeamLeadId: (orgId: string, teamId: string) => Promise<string>;
}

/**
 * Adapts @northbridge/team-orchestrator into the NDP Communication Router.
 * Products inject roster/runtime dependencies when constructing the orchestrator.
 */
export class TeamOrchestratorExecutionHandler implements TeamExecutionHandler {
  constructor(private readonly options: TeamOrchestratorExecutionHandlerOptions) {}

  async execute(input: {
    request: CustomerRequest;
    context: ConversationContext;
    ownership: ConversationOwnership;
    teamId: string;
  }): Promise<TeamHandlerResult> {
    const teamLeadId = await this.options.resolveTeamLeadId(
      input.request.orgId,
      input.teamId,
    );

    const teamRequest: TeamRequest = {
      id: input.request.requestId,
      orgId: input.request.orgId,
      teamId: input.teamId,
      teamLeadId,
      source: "customer",
      payload: {
        message: input.request.message,
        intentTags: input.request.intentTags,
        capabilityTags: input.request.capabilityTags,
        metadata: input.request.metadata,
      },
      customerThreadRef: input.request.threadId,
      receivedAt: input.request.receivedAt,
    };

    const result = await this.options.orchestrator.orchestrate({
      request: teamRequest,
      sessionId: `${input.request.orgId}:${input.teamId}:${input.request.threadId}`,
    });

    if (result.outcome === "complete") {
      return {
        reply: result.synthesis.summary,
        escalated: false,
      };
    }

    if (result.outcome === "escalated") {
      return {
        reply: result.escalation.reason,
        escalated: true,
      };
    }

    throw new CommunicationRouterError(
      "handler_failed",
      result.error.message,
      { detail: { code: result.error.code } },
    );
  }
}
