import type { RouteRuleSet } from "@northbridge/workforce-router";
import {
  NoOpWorkforceTelemetryEmitter,
  type WorkforceTelemetryEmitter,
} from "@northbridge/workforce-observability";
import type { CustomerRequest } from "../types/customer-request.js";
import type { ResponseEnvelope } from "../types/response.js";
import type {
  ConversationContextBuilder,
  OperationsIntelligenceLoader,
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
import {
  createRequestTelemetryContext,
  emitCustomerRequestEvent,
  emitCustomerResponseEvent,
  emitRoutingDecisionEvent,
  emitTeamExecutionEvent,
  emitTeamSynthesisEvent,
  emitEscalationEvent,
} from "../observability/index.js";
import type { CapabilityResolver } from "@/lib/ndp/connectors";
import type { OrganizationCapabilityAvailability } from "@/lib/ndp/connectors";
import { CommunicationRouterError } from "./errors.js";

export interface CommunicationRouterDependencies {
  organizationLoader: OrganizationContextLoader;
  subscriptionResolver: SubscriptionResolver;
  teamResolver: TeamResolver;
  ownershipDecision: OwnershipDecisionService;
  operationsIntelligenceLoader?: OperationsIntelligenceLoader;
  contextBuilder?: ConversationContextBuilder;
  nordiHandler?: NordiConversationHandler;
  teamHandler?: TeamExecutionHandler;
  responseCoordinator?: ResponseCoordinator;
  resolveRouteRules: (orgId: string, customerId: string) => Promise<RouteRuleSet>;
  telemetryEmitter?: WorkforceTelemetryEmitter;
  capabilityResolver?: CapabilityResolver;
}

export interface HandleCustomerRequestInput {
  request: CustomerRequest;
}

export interface ResolveOrganizationCapabilitiesInput {
  orgId: string;
  region?: string;
  correlationId?: string;
  capabilityIds?: string[];
}

export interface CommunicationRouter {
  handleRequest(input: HandleCustomerRequestInput): Promise<ResponseEnvelope>;
  resolveAvailableCapabilities(
    input: ResolveOrganizationCapabilitiesInput,
  ): OrganizationCapabilityAvailability;
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
  private readonly operationsIntelligenceLoader?: OperationsIntelligenceLoader;
  private readonly contextBuilder: ConversationContextBuilder;
  private readonly nordiHandler: NordiConversationHandler;
  private readonly teamHandler: TeamExecutionHandler;
  private readonly responseCoordinator: ResponseCoordinator;
  private readonly resolveRouteRules: CommunicationRouterDependencies["resolveRouteRules"];
  private readonly telemetryEmitter: WorkforceTelemetryEmitter;
  private readonly capabilityResolver?: CapabilityResolver;

  constructor(deps: CommunicationRouterDependencies) {
    this.organizationLoader = deps.organizationLoader;
    this.subscriptionResolver = deps.subscriptionResolver;
    this.teamResolver = deps.teamResolver;
    this.ownershipDecision = deps.ownershipDecision;
    this.operationsIntelligenceLoader = deps.operationsIntelligenceLoader;
    this.contextBuilder = deps.contextBuilder ?? new DefaultConversationContextBuilder();
    this.nordiHandler = deps.nordiHandler ?? new PassthroughNordiConversationHandler();
    this.teamHandler = deps.teamHandler ?? new PassthroughTeamExecutionHandler();
    this.responseCoordinator = deps.responseCoordinator ?? new DefaultResponseCoordinator();
    this.resolveRouteRules = deps.resolveRouteRules;
    this.telemetryEmitter =
      deps.telemetryEmitter ?? new NoOpWorkforceTelemetryEmitter();
    this.capabilityResolver = deps.capabilityResolver;
  }

  resolveAvailableCapabilities(
    input: ResolveOrganizationCapabilitiesInput,
  ): OrganizationCapabilityAvailability {
    if (!this.capabilityResolver) {
      return {
        orgId: input.orgId,
        region: input.region,
        capabilities: [],
      };
    }

    return this.capabilityResolver.resolveOrganizationAvailability(input);
  }

  async handleRequest(input: HandleCustomerRequestInput): Promise<ResponseEnvelope> {
    const { request } = input;
    const telemetry = createRequestTelemetryContext({
      request,
      emitter: this.telemetryEmitter,
    });

    await emitCustomerRequestEvent(telemetry, request);

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
    const operationsIntelligence = this.operationsIntelligenceLoader
      ? await this.operationsIntelligenceLoader
          .load(request.orgId, request.customerId)
          .catch(() => undefined)
      : undefined;
    const context = this.contextBuilder.build({
      request,
      organization,
      subscription,
      teams,
      operationsIntelligence,
    });

    const routeRules = await this.resolveRouteRules(request.orgId, request.customerId);
    const ownership = await this.ownershipDecision.decide({ context, routeRules });

    await emitRoutingDecisionEvent(telemetry, request, ownership);

    if (ownership.owner.type === "nordi") {
      return this.handleNordiPath(request, context, ownership, telemetry);
    }

    if (ownership.owner.type === "team") {
      return this.handleTeamPath(
        request,
        context,
        ownership,
        ownership.owner.id!,
        telemetry,
      );
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
    telemetry: ReturnType<typeof createRequestTelemetryContext>,
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

    const envelope = await this.responseCoordinator.coordinate({
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

    await emitCustomerResponseEvent(telemetry, {
      orgId: request.orgId,
      owner: ownership.owner,
      metadata: { ownershipSource: ownership.source },
    });

    return envelope;
  }

  private async handleTeamPath(
    request: CustomerRequest,
    context: ConversationContext,
    ownership: ConversationOwnership,
    teamId: string,
    telemetry: ReturnType<typeof createRequestTelemetryContext>,
  ): Promise<ResponseEnvelope> {
    await emitTeamExecutionEvent(telemetry, {
      orgId: request.orgId,
      teamId,
      status: "started",
    });

    let teamResult;
    try {
      teamResult = await this.teamHandler.execute({
        request,
        context,
        ownership,
        teamId,
      });
    } catch (error) {
      await emitTeamExecutionEvent(telemetry, {
        orgId: request.orgId,
        teamId,
        status: "failed",
        metadata: {
          error: error instanceof Error ? error.message : "team execution failed",
        },
      });
      throw error;
    }

    if (teamResult.escalated) {
      await emitTeamExecutionEvent(telemetry, {
        orgId: request.orgId,
        teamId,
        status: "escalated",
      });
      if (!teamResult.telemetry?.escalationEmitted) {
        await emitEscalationEvent(telemetry, {
          orgId: request.orgId,
          teamId,
          metadata: { reply: teamResult.reply },
        });
      }
    } else {
      await emitTeamExecutionEvent(telemetry, {
        orgId: request.orgId,
        teamId,
        status: "completed",
      });
      if (!teamResult.telemetry?.synthesisEmitted) {
        await emitTeamSynthesisEvent(telemetry, {
          orgId: request.orgId,
          teamId,
          metadata: { source: "communication-router" },
        });
      }
    }

    const envelope = await this.responseCoordinator.coordinate({
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

    await emitCustomerResponseEvent(telemetry, {
      orgId: request.orgId,
      owner: ownership.owner,
      metadata: {
        escalated: teamResult.escalated,
        ownershipSource: ownership.source,
      },
    });

    return envelope;
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
