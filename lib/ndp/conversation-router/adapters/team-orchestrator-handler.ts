import type { TeamOrchestrator } from "@northbridge/team-orchestrator";
import type { TeamRequest } from "@northbridge/team-orchestrator";
import type { WorkforceTelemetryEmitter } from "@northbridge/workforce-observability";
import type { TeamExecutionHandler, TeamHandlerResult } from "../handlers/passthrough-handlers.js";
import type { CustomerRequest } from "../types/customer-request.js";
import type { ConversationContext } from "../types/conversation-context.js";
import type { ConversationOwnership } from "../types/ownership.js";
import { CommunicationRouterError } from "../router/errors.js";
import {
  createRequestTelemetryContext,
  emitEscalationEvent,
  emitTeamSynthesisEvent,
} from "../observability/index.js";

export interface TeamOrchestratorExecutionHandlerOptions {
  orchestrator: TeamOrchestrator;
  resolveTeamLeadId: (orgId: string, teamId: string) => Promise<string>;
  telemetryEmitter?: WorkforceTelemetryEmitter;
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

    const telemetry =
      this.options.telemetryEmitter &&
      createRequestTelemetryContext({
        request: input.request,
        emitter: this.options.telemetryEmitter,
        now: () => input.context.now,
      });

    if (result.outcome === "complete") {
      if (telemetry) {
        await emitTeamSynthesisEvent(telemetry, {
          orgId: input.request.orgId,
          teamId: input.teamId,
          metadata: { summary: result.synthesis.summary },
        });
      }

      return {
        reply: result.synthesis.summary,
        escalated: false,
        telemetry: telemetry
          ? { synthesisEmitted: true, escalationEmitted: false }
          : undefined,
      };
    }

    if (result.outcome === "escalated") {
      if (telemetry) {
        await emitEscalationEvent(telemetry, {
          orgId: input.request.orgId,
          teamId: input.teamId,
          metadata: {
            reason: result.escalation.reason,
            target: result.escalation.target,
          },
        });
      }

      return {
        reply: result.escalation.reason,
        escalated: true,
        telemetry: telemetry
          ? { synthesisEmitted: false, escalationEmitted: true }
          : undefined,
      };
    }

    throw new CommunicationRouterError(
      "handler_failed",
      result.error.message,
      { detail: { code: result.error.code } },
    );
  }
}
