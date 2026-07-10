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
import { CUSTOMER_SERVICE_TEAM_ID } from "../constants.js";
import {
  createCustomerServiceTeamOrchestrator,
  resolveCustomerServiceTeamLeadId,
} from "../runtime/orchestrator.js";

export interface CustomerServiceCommunicationRouterOptions {
  orgId: string;
  customerId: string;
  entitledTeamIds?: string[];
  hiredTeamIds?: string[];
  includeOperationsIntelligence?: boolean;
  now?: () => string;
}

export function buildCustomerServiceRouteRules(orgId: string): RouteRuleSet {
  return {
    orgId,
    version: 1,
    rules: [
      {
        ruleId: "route-customer-service",
        priority: 10,
        match: { capabilityTags: ["capability:customer_service"] },
        routeTo: { ownerType: "team", ownerId: CUSTOMER_SERVICE_TEAM_ID },
        enabled: true,
      },
      {
        ruleId: "route-customer-service-scheduling",
        priority: 10,
        match: { capabilityTags: ["capability:scheduling"] },
        routeTo: { ownerType: "team", ownerId: CUSTOMER_SERVICE_TEAM_ID },
        enabled: true,
      },
    ],
  };
}

export function createCustomerServiceCommunicationRouter(
  options: CustomerServiceCommunicationRouterOptions,
) {
  const {
    orgId,
    customerId,
    entitledTeamIds = [CUSTOMER_SERVICE_TEAM_ID],
    hiredTeamIds = [CUSTOMER_SERVICE_TEAM_ID],
    includeOperationsIntelligence = true,
    now = () => new Date().toISOString(),
  } = options;

  const orchestrator = createCustomerServiceTeamOrchestrator({ orgId, now });

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
    resolveRouteRules: async () => buildCustomerServiceRouteRules(orgId),
    teamHandler: new TeamOrchestratorExecutionHandler({
      orchestrator,
      resolveTeamLeadId: async () => resolveCustomerServiceTeamLeadId(),
    }),
  });
}
