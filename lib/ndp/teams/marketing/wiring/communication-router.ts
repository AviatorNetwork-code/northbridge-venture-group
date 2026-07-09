import {
  createDefaultCompositeResolver,
  createWorkforceRouter,
  type RouteRuleSet,
} from "@northbridge/workforce-router";
import { createExampleOperationsIntelligenceLoader } from "@/lib/ndp/operations-context";
import { TeamOrchestratorExecutionHandler } from "@/lib/ndp/conversation-router/adapters/team-orchestrator-handler";
import {
  createCommunicationRouter,
  createTestOrganization,
  DefaultOwnershipDecisionService,
  InMemoryOrganizationContextLoader,
  InMemorySubscriptionResolver,
  InMemoryTeamResolver,
} from "@/lib/ndp/conversation-router";
import { MARKETING_TEAM_ID } from "../constants.js";
import {
  createMarketingTeamOrchestrator,
  resolveMarketingTeamLeadId,
} from "../runtime/orchestrator.js";

export interface MarketingCommunicationRouterOptions {
  orgId: string;
  customerId: string;
  entitledTeamIds?: string[];
  hiredTeamIds?: string[];
  includeOperationsIntelligence?: boolean;
  now?: () => string;
}

export function buildMarketingRouteRules(orgId: string): RouteRuleSet {
  return {
    orgId,
    version: 1,
    rules: [
      {
        ruleId: "route-marketing-acquisition",
        priority: 10,
        match: { capabilityTags: ["capability:customer_acquisition"] },
        routeTo: { ownerType: "team", ownerId: MARKETING_TEAM_ID },
        enabled: true,
      },
      {
        ruleId: "route-marketing-content",
        priority: 10,
        match: { capabilityTags: ["capability:content_marketing"] },
        routeTo: { ownerType: "team", ownerId: MARKETING_TEAM_ID },
        enabled: true,
      },
      {
        ruleId: "route-marketing-analytics",
        priority: 10,
        match: { capabilityTags: ["capability:analytics"] },
        routeTo: { ownerType: "team", ownerId: MARKETING_TEAM_ID },
        enabled: true,
      },
    ],
  };
}

/**
 * Wires Marketing Team Alpha into the Communication Router for Nordi integration.
 */
export function createMarketingCommunicationRouter(
  options: MarketingCommunicationRouterOptions,
) {
  const {
    orgId,
    customerId,
    entitledTeamIds = [MARKETING_TEAM_ID],
    hiredTeamIds = [MARKETING_TEAM_ID],
    includeOperationsIntelligence = true,
    now = () => new Date().toISOString(),
  } = options;

  const orchestrator = createMarketingTeamOrchestrator({ orgId, now });

  return createCommunicationRouter({
    organizationLoader: new InMemoryOrganizationContextLoader(
      new Map([
        [
          orgId,
          {
            organization: createTestOrganization(orgId),
            permissions: ["conversation:read", "conversation:write"],
          },
        ],
      ]),
    ),
    operationsIntelligenceLoader: includeOperationsIntelligence
      ? createExampleOperationsIntelligenceLoader([orgId], { now })
      : undefined,
    subscriptionResolver: new InMemorySubscriptionResolver(
      new Map([
        [
          `${orgId}:${customerId}`,
          {
            orgId,
            customerId,
            status: "active",
            entitledTeamIds,
          },
        ],
      ]),
    ),
    teamResolver: new InMemoryTeamResolver(
      new Map([
        [
          `${orgId}:${customerId}`,
          {
            hiredTeamIds,
            activeConversations: [],
          },
        ],
      ]),
    ),
    ownershipDecision: new DefaultOwnershipDecisionService(
      createWorkforceRouter({ resolver: createDefaultCompositeResolver() }),
    ),
    resolveRouteRules: async () => buildMarketingRouteRules(orgId),
    teamHandler: new TeamOrchestratorExecutionHandler({
      orchestrator,
      resolveTeamLeadId: async () => resolveMarketingTeamLeadId(),
    }),
  });
}
