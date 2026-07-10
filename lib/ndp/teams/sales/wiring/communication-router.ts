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
import { SALES_TEAM_ID } from "../constants.js";
import {
  createSalesTeamOrchestrator,
  resolveSalesTeamLeadId,
} from "../runtime/orchestrator.js";

export interface SalesCommunicationRouterOptions {
  orgId: string;
  customerId: string;
  entitledTeamIds?: string[];
  hiredTeamIds?: string[];
  includeOperationsIntelligence?: boolean;
  now?: () => string;
}

export function buildSalesRouteRules(orgId: string): RouteRuleSet {
  return {
    orgId,
    version: 1,
    rules: [
      {
        ruleId: "route-sales-pipeline",
        priority: 10,
        match: { capabilityTags: ["capability:sales_pipeline"] },
        routeTo: { ownerType: "team", ownerId: SALES_TEAM_ID },
        enabled: true,
      },
      {
        ruleId: "route-sales-analytics",
        priority: 10,
        match: { capabilityTags: ["capability:analytics"] },
        routeTo: { ownerType: "team", ownerId: SALES_TEAM_ID },
        enabled: true,
      },
    ],
  };
}

export function createSalesCommunicationRouter(options: SalesCommunicationRouterOptions) {
  const {
    orgId,
    customerId,
    entitledTeamIds = [SALES_TEAM_ID],
    hiredTeamIds = [SALES_TEAM_ID],
    includeOperationsIntelligence = true,
    now = () => new Date().toISOString(),
  } = options;

  const orchestrator = createSalesTeamOrchestrator({ orgId, now });

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
    resolveRouteRules: async () => buildSalesRouteRules(orgId),
    teamHandler: new TeamOrchestratorExecutionHandler({
      orchestrator,
      resolveTeamLeadId: async () => resolveSalesTeamLeadId(),
    }),
  });
}
