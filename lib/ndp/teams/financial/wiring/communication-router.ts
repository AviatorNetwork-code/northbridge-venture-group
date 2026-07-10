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
import { FINANCIAL_TEAM_ID } from "../constants.js";
import {
  createFinancialTeamOrchestrator,
  resolveFinancialTeamLeadId,
} from "../runtime/orchestrator.js";

export interface FinancialCommunicationRouterOptions {
  orgId: string;
  customerId: string;
  entitledTeamIds?: string[];
  hiredTeamIds?: string[];
  includeOperationsIntelligence?: boolean;
  now?: () => string;
}

export function buildFinancialRouteRules(orgId: string): RouteRuleSet {
  return {
    orgId,
    version: 1,
    rules: [
      {
        ruleId: "route-finance",
        priority: 10,
        match: { capabilityTags: ["capability:finance"] },
        routeTo: { ownerType: "team", ownerId: FINANCIAL_TEAM_ID },
        enabled: true,
      },
      {
        ruleId: "route-finance-analytics",
        priority: 10,
        match: { capabilityTags: ["capability:analytics"] },
        routeTo: { ownerType: "team", ownerId: FINANCIAL_TEAM_ID },
        enabled: true,
      },
    ],
  };
}

export function createFinancialCommunicationRouter(options: FinancialCommunicationRouterOptions) {
  const {
    orgId,
    customerId,
    entitledTeamIds = [FINANCIAL_TEAM_ID],
    hiredTeamIds = [FINANCIAL_TEAM_ID],
    includeOperationsIntelligence = true,
    now = () => new Date().toISOString(),
  } = options;

  const orchestrator = createFinancialTeamOrchestrator({ orgId, now });

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
    resolveRouteRules: async () => buildFinancialRouteRules(orgId),
    teamHandler: new TeamOrchestratorExecutionHandler({
      orchestrator,
      resolveTeamLeadId: async () => resolveFinancialTeamLeadId(),
    }),
  });
}
