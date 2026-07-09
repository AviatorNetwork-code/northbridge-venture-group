import { createRequestOwner } from "@northbridge/workforce-contracts";
import type { WorkforceRouter, RouteRuleSet, RoutingDecision } from "@northbridge/workforce-router";
import type { ConversationContext } from "../types/conversation-context.js";
import type { ConversationOwnership } from "../types/ownership.js";
import { CommunicationRouterError } from "../router/errors.js";
import {
  DefaultNordiOwnershipEvaluator,
  findContinuityOwner,
  type NordiOwnershipEvaluator,
} from "./nordi-ownership.js";

export interface OwnershipDecisionInput {
  context: ConversationContext;
  routeRules: RouteRuleSet;
}

export interface OwnershipDecisionService {
  decide(input: OwnershipDecisionInput): Promise<ConversationOwnership>;
}

export class DefaultOwnershipDecisionService implements OwnershipDecisionService {
  constructor(
    private readonly workforceRouter: WorkforceRouter,
    private readonly nordiEvaluator: NordiOwnershipEvaluator = new DefaultNordiOwnershipEvaluator(),
  ) {}

  async decide(input: OwnershipDecisionInput): Promise<ConversationOwnership> {
    const { context, routeRules } = input;
    const { request } = context;

    const continuity = findContinuityOwner(context);
    if (continuity) return continuity;

    if (request.channel === "team-thread") {
      return this.resolveTeamThreadOwnership(context);
    }

    if (request.channel === "unknown") {
      return {
        owner: createRequestOwner(request.orgId, "nordi"),
        source: "nordi-policy",
        requiresClarification: true,
      };
    }

    return this.resolveNordiThreadOwnership(context, routeRules);
  }

  private resolveTeamThreadOwnership(context: ConversationContext): ConversationOwnership {
    const { request } = context;
    const teamId = request.teamId;

    if (!teamId) {
      throw new CommunicationRouterError(
        "invalid_request",
        "team-thread channel requires teamId",
      );
    }

    if (context.subscription.status !== "active") {
      return {
        owner: createRequestOwner(request.orgId, "nordi"),
        source: "subscription-gap",
      };
    }

    if (!context.subscription.entitledTeamIds.includes(teamId)) {
      throw new CommunicationRouterError(
        "team_not_entitled",
        `Team ${teamId} is not entitled for this organization`,
      );
    }

    if (!context.teams.hiredTeamIds.includes(teamId)) {
      throw new CommunicationRouterError(
        "team_not_hired",
        `Team ${teamId} is not hired for this customer`,
      );
    }

    return {
      owner: createRequestOwner(request.orgId, "team", teamId),
      source: "team-thread",
    };
  }

  private async resolveNordiThreadOwnership(
    context: ConversationContext,
    routeRules: RouteRuleSet,
  ): Promise<ConversationOwnership> {
    const { request } = context;

    if (context.subscription.status !== "active") {
      return {
        owner: createRequestOwner(request.orgId, "nordi"),
        source: "subscription-gap",
      };
    }

    const evaluation = await this.nordiEvaluator.evaluateForNordiThread({
      context,
      routeRules,
    });

    if (evaluation.action === "assign-nordi") {
      return {
        owner: createRequestOwner(request.orgId, "nordi"),
        source: "nordi-policy",
      };
    }

    if (evaluation.action === "clarify") {
      return {
        owner: createRequestOwner(request.orgId, "nordi"),
        source: "nordi-policy",
        requiresClarification: true,
      };
    }

    const routingDecision = await this.routeOperationalRequest(context, routeRules);
    return this.mapRoutingDecision(request.orgId, routingDecision);
  }

  private async routeOperationalRequest(
    context: ConversationContext,
    routeRules: RouteRuleSet,
  ): Promise<RoutingDecision> {
    const { request } = context;

    return this.workforceRouter.route({
      request: {
        requestId: request.requestId,
        orgId: request.orgId,
        channel: "platform",
        payload: {
          textRef: request.message,
          intentTags: request.intentTags,
          capabilityTags: request.capabilityTags,
          metadata: request.metadata,
        },
        entitledTeamIds: context.subscription.entitledTeamIds,
        receivedAt: request.receivedAt,
        dedupTopic: request.metadata?.dedupTopic as string | undefined,
      },
      context: {
        orgId: request.orgId,
        featureFlags: context.organization.featureFlags,
        entitledTeamIds: context.subscription.entitledTeamIds,
        now: context.now,
      },
      rules: routeRules,
    });
  }

  private mapRoutingDecision(
    orgId: string,
    decision: RoutingDecision,
  ): ConversationOwnership {
    if (decision.status === "assigned" && decision.owner) {
      if (decision.owner.type === "manager" || decision.owner.type === "director" || decision.owner.type === "vice_president") {
        throw new CommunicationRouterError(
          "future_owner_not_supported",
          `Owner type ${decision.owner.type} is not supported at launch`,
        );
      }

      return {
        owner: decision.owner,
        source: "workforce-router",
        routingDecision: decision,
        bridgeNote:
          decision.owner.type === "team"
            ? "Nordi routed this operational request to your team."
            : undefined,
      };
    }

    if (decision.status === "deferred") {
      return {
        owner: createRequestOwner(orgId, "nordi"),
        source: "routing-failure",
        routingDecision: decision,
        requiresClarification: true,
      };
    }

    return {
      owner: createRequestOwner(orgId, "nordi"),
      source: "routing-failure",
      routingDecision: decision,
    };
  }
}
