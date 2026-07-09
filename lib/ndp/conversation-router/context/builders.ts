import type { OrganizationIntelligenceContext } from "@northbridge/operations-intelligence";
import type { CustomerRequest } from "../types/customer-request.js";
import type {
  ConversationContext,
  OrganizationContext,
  SubscriptionContext,
  TeamContext,
} from "../types/conversation-context.js";

export interface OrganizationContextLoader {
  load(orgId: string, customerId: string): Promise<OrganizationContext>;
}

export interface OperationsIntelligenceLoader {
  load(orgId: string, customerId: string): Promise<OrganizationIntelligenceContext>;
}

export interface SubscriptionResolver {
  resolve(orgId: string, customerId: string): Promise<SubscriptionContext>;
}

export interface TeamResolver {
  resolve(orgId: string, customerId: string): Promise<TeamContext>;
}

export interface ConversationContextBuilder {
  build(input: {
    request: CustomerRequest;
    organization: OrganizationContext;
    subscription: SubscriptionContext;
    teams: TeamContext;
    operationsIntelligence?: OrganizationIntelligenceContext;
    now?: string;
  }): ConversationContext;
}

export class DefaultConversationContextBuilder implements ConversationContextBuilder {
  build(input: {
    request: CustomerRequest;
    organization: OrganizationContext;
    subscription: SubscriptionContext;
    teams: TeamContext;
    operationsIntelligence?: OrganizationIntelligenceContext;
    now?: string;
  }): ConversationContext {
    const now = input.now ?? new Date().toISOString();
    return {
      request: input.request,
      organization: input.organization,
      subscription: input.subscription,
      teams: input.teams,
      operationsIntelligence: input.operationsIntelligence,
      conversationStateId: `${input.request.orgId}:${input.request.customerId}:${input.request.threadId}`,
      now,
    };
  }
}
