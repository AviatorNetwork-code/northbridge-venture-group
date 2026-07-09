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
    now?: string;
  }): ConversationContext;
}

export class DefaultConversationContextBuilder implements ConversationContextBuilder {
  build(input: {
    request: CustomerRequest;
    organization: OrganizationContext;
    subscription: SubscriptionContext;
    teams: TeamContext;
    now?: string;
  }): ConversationContext {
    const now = input.now ?? new Date().toISOString();
    return {
      request: input.request,
      organization: input.organization,
      subscription: input.subscription,
      teams: input.teams,
      conversationStateId: `${input.request.orgId}:${input.request.customerId}:${input.request.threadId}`,
      now,
    };
  }
}
