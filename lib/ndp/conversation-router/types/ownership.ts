import type { RequestOwner } from "@northbridge/workforce-contracts";
import type { RoutingDecision } from "@northbridge/workforce-router";

export type ConversationOwnershipSource =
  | "nordi-policy"
  | "workforce-router"
  | "team-thread"
  | "continuity"
  | "subscription-gap"
  | "routing-failure";

export interface ConversationOwnership {
  owner: RequestOwner;
  source: ConversationOwnershipSource;
  routingDecision?: RoutingDecision;
  /** Optional Nordi bridge note when transferring operational work to a team */
  bridgeNote?: string;
  requiresClarification?: boolean;
}

export type FutureOwnerType = "manager" | "director" | "vice_president";

export interface FutureOwnerCapability {
  ownerType: FutureOwnerType;
  enabled: boolean;
}
