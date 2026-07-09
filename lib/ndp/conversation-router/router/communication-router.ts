import type { RouteRuleSet } from "@northbridge/workforce-router";
import type { CustomerRequest } from "../types/customer-request.js";
import type { ResponseEnvelope } from "../types/response.js";
import type {
  ConversationContextBuilder,
  OrganizationContextLoader,
  SubscriptionResolver,
  TeamResolver,
} from "../context/builders.js";
import { DefaultConversationContextBuilder } from "../context/builders.js";
import type { NordiConversationHandler, NordiHandlerMode, TeamExecutionHandler } from "../handlers/passthrough-handlers.js";
import {
  PassthroughNordiConversationHandler,
  PassthroughTeamExecutionHandler,
} from "../handlers/passthrough-handlers.js";
import type { OwnershipDecisionService } from "../routing/ownership-decision.js";
import type { ConversationContext } from "../types/conversation-context.js";
import type { ConversationOwnership } from "../types/ownership.js";
import {
  DefaultResponseCoordinator,
  type ResponseCoordinator,
} from "../coordination/response-coordinator.js";
import { CommunicationRouterError } from "./errors.js";

export interface CommunicationRouterDependencies {
  organizationLoader: OrganizationContextLoader;
  subscriptionResolver: SubscriptionResolver;
  teamResolver: TeamResolver;
  ownershipDecision: OwnershipDecisionService;
  contextBuilder?: ConversationContextBuilder;
  nordiHandler?: NordiConversationHandler;
  teamHandler?: TeamExecutionHandler;
  responseCoordinator?: ResponseCoordinator;
  resolveRouteRules: (orgId: string, customerId: string) => Promise<RouteRuleSet>;
}

export interface HandleCustomerRequestInput {
  request: CustomerRequest;
}

export interface CommunicationRouter {
  handleRequest(input: HandleCustomerRequestInput): Promise<ResponseEnvelope>;
}

export function createCommunicationRouter(
  deps: CommunicationRouterDependencies,
): CommunicationRouter {
  return new DefaultCommunicationRouter(deps);
}

export class DefaultCommunicationRouter implements CommunicationRouter {
  private readonly organizationLoader: OrganizationContextLoader;
  private readonly subscriptionResolver: SubscriptionResolver;
  private readonly teamResolver: TeamResolver;
  private readonly ownershipDecision: OwnershipDecisionService;
  private readonly contextBuilder: ConversationContextBuilder;
  private readonly nordiHandler: NordiConversationHandler;
  private readonly teamHandler: TeamExecutionHandler;
  private readonly responseCoordinator: ResponseCoordinator;
  private readonly resolveRouteRules: CommunicationRouterDependencies["resolveRouteRules"];

  constructor(deps: CommunicationRouterDependencies) {
    this.organizationLoader = deps.organizationLoader;
    this.subscriptionResolver = deps.subscriptionResolver;
    this.teamResolver = deps.teamResolver;
    this.ownershipDecision = deps.ownershipDecision;
    this.contextBuilder = deps.contextBuilder ?? new DefaultConversationContextBuilder();
    this.nordiHandler = deps.nordiHandler ?? new PassthroughNordiConversationHandler();
    this.teamHandler = deps.teamHandler ?? new PassthroughTeamExecutionHandler();
    this.responseCoordinator = deps.responseCoordinator ?? new DefaultResponseCoordinator();
    this.resolveRouteRules = deps.resolveRouteRules;
  }

  async handleRequest(input: HandleCustomerRequestInput): Promise<ResponseEnvelope> {
    const { request } = input;

    let organization;
    try {
      organization = await this.organizationLoader.load(request.orgId, request.customerId);
    } catch {
      throw new CommunicationRouterError(
        "organization_not_found",
        `Organization ${request.orgId} not found`,
      );
    }

    const subscription = await this.subscriptionResolver.resolve(
      request.orgId,
      request.customerId,
    );
    const teams = await this.teamResolver.resolve(request.orgId, request.customerId);
    const context = this.contextBuilder.build({
      request,
      organization,
      subscription,
      teams,
    });

    const routeRules = await this.resolveRouteRules(request.orgId, request.customerId);
    const ownership = await this.ownershipDecision.decide({ context, routeRules });

    if (ownership.owner.type === "nordi") {
      return this.handleNordiPath(request, context, ownership);
    }

    if (ownership.owner.type === "team") {
      return this.handleTeamPath(request, context, ownership, ownership.owner.id!);
    }

    throw new CommunicationRouterError(
      "future_owner_not_supported",
      `Owner type ${ownership.owner.type} is not supported at launch`,
    );
  }

  private async handleNordiPath(
    request: CustomerRequest,
    context: ConversationContext,
    ownership: ConversationOwnership,
  ): Promise<ResponseEnvelope> {
    const mode = this.resolveNordiMode(ownership);
    const nordiResult = await this.nordiHandler.handle({
      request,
      context,
      ownership,
      mode,
    });

    const bridgePrefix =
      ownership.source === "workforce-router" && ownership.bridgeNote
        ? `${ownership.bridgeNote}\n\n`
        : "";

    return this.responseCoordinator.coordinate({
      requestId: request.requestId,
      orgId: request.orgId,
      customerId: request.customerId,
      threadId: request.threadId,
      channel: request.channel,
      owner: ownership.owner,
      reply: `${bridgePrefix}${nordiResult.reply}`.trim(),
      now: context.now,
      metadata: {
        routingAuditId: ownership.routingDecision?.audit.auditId,
        turnAction: nordiResult.turnAction,
        ownershipSource: ownership.source,
        bridgeNote: ownership.bridgeNote,
      },
    });
  }

  private async handleTeamPath(
    request: CustomerRequest,
    context: ConversationContext,
    ownership: ConversationOwnership,
    teamId: string,
  ): Promise<ResponseEnvelope> {
    const teamResult = await this.teamHandler.execute({
      request,
      context,
      ownership,
      teamId,
    });

    return this.responseCoordinator.coordinate({
      requestId: request.requestId,
      orgId: request.orgId,
      customerId: request.customerId,
      threadId: request.threadId,
      channel: request.channel,
      owner: ownership.owner,
      reply: teamResult.reply,
      now: context.now,
      metadata: {
        routingAuditId: ownership.routingDecision?.audit.auditId,
        escalated: teamResult.escalated,
        ownershipSource: ownership.source,
      },
    });
  }

  private resolveNordiMode(ownership: ConversationOwnership): NordiHandlerMode {
    if (ownership.source === "subscription-gap") return "subscription_gap";
    if (ownership.source === "routing-failure") {
      return ownership.requiresClarification ? "clarify" : "routing_failure";
    }
    if (ownership.requiresClarification) return "clarify";
    if (ownership.source === "workforce-router" && ownership.bridgeNote) return "bridge";
    return "direct";
  }
}
