import type { Organization, WorkforceFeatureFlags } from "@northbridge/workforce-contracts";
import type { CustomerRequest } from "./customer-request.js";

export type SubscriptionStatus = "active" | "missing" | "suspended";

export interface SubscriptionContext {
  orgId: string;
  customerId: string;
  status: SubscriptionStatus;
  entitledTeamIds: string[];
}

export interface ActiveConversation {
  threadId: string;
  ownerType: "nordi" | "team";
  teamId?: string;
  lastMessageAt: string;
}

export interface TeamContext {
  hiredTeamIds: string[];
  activeConversations: ActiveConversation[];
}

export interface OrganizationContext {
  orgId: string;
  organization: Organization;
  featureFlags: WorkforceFeatureFlags;
  permissions: string[];
}

export interface ConversationContext {
  request: CustomerRequest;
  organization: OrganizationContext;
  subscription: SubscriptionContext;
  teams: TeamContext;
  conversationStateId: string;
  now: string;
  consentEnabled?: boolean;
}

export interface ConversationContextBuildInput {
  request: CustomerRequest;
  organization: OrganizationContext;
  subscription: SubscriptionContext;
  teams: TeamContext;
  now?: string;
}
