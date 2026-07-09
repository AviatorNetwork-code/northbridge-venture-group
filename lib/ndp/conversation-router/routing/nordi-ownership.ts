import { createRequestOwner } from "@northbridge/workforce-contracts";
import type { RouteRuleSet } from "@northbridge/workforce-router";
import type { ConversationContext } from "../types/conversation-context.js";
import type { ConversationOwnership } from "../types/ownership.js";

/** Intent tags that keep ownership with Nordi (product policy). */
export const NORDI_OWNED_INTENT_TAGS = [
  "intent:platform",
  "intent:billing",
  "intent:recommendation",
  "intent:relationship",
  "intent:org",
  "intent:services",
] as const;

export const OPERATIONAL_INTENT_TAGS = ["intent:operational"] as const;

export function hasTag(tags: string[] | undefined, candidates: readonly string[]): boolean {
  if (!tags?.length) return false;
  const set = new Set(candidates);
  return tags.some((tag) => set.has(tag));
}

export function isNordiOwnedIntent(requestTags: string[] | undefined): boolean {
  return hasTag(requestTags, NORDI_OWNED_INTENT_TAGS);
}

export function isOperationalIntent(
  intentTags: string[] | undefined,
  capabilityTags: string[] | undefined,
): boolean {
  if (hasTag(intentTags, OPERATIONAL_INTENT_TAGS)) return true;
  return Boolean(capabilityTags?.length);
}

export function findContinuityOwner(
  context: ConversationContext,
): ConversationOwnership | null {
  const active = context.teams.activeConversations.find(
    (conversation) => conversation.threadId === context.request.threadId,
  );
  if (!active) return null;

  if (active.ownerType === "nordi") {
    return {
      owner: createRequestOwner(context.request.orgId, "nordi"),
      source: "continuity",
    };
  }

  if (active.teamId) {
    return {
      owner: createRequestOwner(context.request.orgId, "team", active.teamId),
      source: "continuity",
    };
  }

  return null;
}

export interface NordiOwnershipInput {
  context: ConversationContext;
  routeRules: RouteRuleSet;
}

export interface NordiOwnershipEvaluator {
  evaluateForNordiThread(input: NordiOwnershipInput): Promise<
    | { action: "assign-nordi" }
    | { action: "route-team"; routeRules: RouteRuleSet }
    | { action: "clarify" }
  >;
}

export class DefaultNordiOwnershipEvaluator implements NordiOwnershipEvaluator {
  async evaluateForNordiThread(input: NordiOwnershipInput): Promise<
    | { action: "assign-nordi" }
    | { action: "route-team"; routeRules: RouteRuleSet }
    | { action: "clarify" }
  > {
    const { context } = input;
    const { request } = context;

    if (isNordiOwnedIntent(request.intentTags) && !isOperationalIntent(request.intentTags, request.capabilityTags)) {
      return { action: "assign-nordi" };
    }

    if (isOperationalIntent(request.intentTags, request.capabilityTags)) {
      return { action: "route-team", routeRules: input.routeRules };
    }

    if (!request.intentTags?.length && !request.capabilityTags?.length) {
      return { action: "clarify" };
    }

    return { action: "assign-nordi" };
  }
}
