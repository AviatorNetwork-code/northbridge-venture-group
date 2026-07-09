import type { RouteRule, RouteRuleSet } from "@northbridge/workforce-router";
import { listLaunchVisibleTeams, NDP_LAUNCH_TEAMS } from "./teams.js";
import { NDP_INVENTORY_SPECIALISTS, NDP_SPECIALIST_ID_SET } from "./specialists.js";
import { NDP_CAPABILITY_DEFINITIONS, NDP_CAPABILITY_TAG_SET } from "./capabilities.js";
import { isKnownRoutingTag, NDP_ROUTING_TAG_DEFINITIONS } from "./routing-tags.js";

export type {
  NdpTeamCatalogEntry,
  TeamLeadAssignment,
  TeamServiceCategory,
  FutureOrganizationalLayerRef,
} from "./teams.js";
export {
  NDP_LAUNCH_TEAMS,
  NDP_LAUNCH_TEAM_ID_SET,
  getLaunchTeam,
  listLaunchVisibleTeams,
  getTeamByCapabilityTag,
} from "./teams.js";

export type {
  InventorySpecialistDefinition,
  SpecialistInventorySection,
} from "./specialists.js";
export {
  NDP_INVENTORY_SPECIALISTS,
  NDP_SPECIALIST_ID_SET,
  getInventorySpecialist,
  listInventorySpecialistsBySection,
} from "./specialists.js";

export type { CapabilityDefinition } from "./capabilities.js";
export {
  NDP_CAPABILITY_DEFINITIONS,
  NDP_CAPABILITY_TAG_SET,
  getCapabilityDefinition,
  isKnownCapabilityTag,
} from "./capabilities.js";

export type { RoutingTagDefinition } from "./routing-tags.js";
export {
  NDP_ROUTING_TAG_DEFINITIONS,
  isKnownRoutingTag,
} from "./routing-tags.js";

export interface CatalogValidationIssue {
  code: string;
  message: string;
  teamId?: string;
  specialistId?: string;
  tag?: string;
}

export function validateNdpTeamCatalog(): CatalogValidationIssue[] {
  const issues: CatalogValidationIssue[] = [];

  for (const team of NDP_LAUNCH_TEAMS) {
    if (!team.teamLead?.id || team.teamLead.role !== "team_lead") {
      issues.push({
        code: "missing_team_lead",
        message: "Launch team must define a Team Lead",
        teamId: team.id,
      });
    }

    if (team.specialistIds.length === 0) {
      issues.push({
        code: "missing_specialists",
        message: "Launch team must include at least one specialist",
        teamId: team.id,
      });
    }

    for (const specialistId of team.specialistIds) {
      if (!NDP_SPECIALIST_ID_SET.has(specialistId)) {
        issues.push({
          code: "unknown_specialist",
          message: `Specialist ${specialistId} is not in inventory`,
          teamId: team.id,
          specialistId,
        });
      }
    }

    if (team.routingTags.length === 0) {
      issues.push({
        code: "missing_routing_tags",
        message: "Launch team must define routing tags",
        teamId: team.id,
      });
    }

    if (team.capabilityTags.length === 0) {
      issues.push({
        code: "missing_capability_tags",
        message: "Launch team must define capability tags",
        teamId: team.id,
      });
    }

    for (const tag of team.routingTags) {
      if (tag.startsWith("capability:") && !NDP_CAPABILITY_TAG_SET.has(tag)) {
        issues.push({
          code: "unknown_capability_tag",
          message: `Unknown capability tag ${tag}`,
          teamId: team.id,
          tag,
        });
      } else if (tag.startsWith("intent:") && !isKnownRoutingTag(tag)) {
        issues.push({
          code: "unknown_routing_tag",
          message: `Unknown routing tag ${tag}`,
          teamId: team.id,
          tag,
        });
      }
    }

    for (const tag of team.capabilityTags) {
      if (!NDP_CAPABILITY_TAG_SET.has(tag)) {
        issues.push({
          code: "unknown_team_capability_tag",
          message: `Unknown team capability tag ${tag}`,
          teamId: team.id,
          tag,
        });
      }
    }

    for (const layer of team.futureOrganizationalLayers) {
      if (layer.launchVisible) {
        issues.push({
          code: "future_layer_launch_visible",
          message: `Future layer ${layer.layer} must not be launch visible`,
          teamId: team.id,
        });
      }
    }

    if (team.name.toLowerCase().includes("nordi")) {
      issues.push({
        code: "nordi_in_catalog",
        message: "Nordi must not appear in customer workforce catalog",
        teamId: team.id,
      });
    }
  }

  return issues;
}

export function assertValidNdpTeamCatalog(): void {
  const issues = validateNdpTeamCatalog();
  if (issues.length > 0) {
    throw new Error(
      `NDP team catalog validation failed: ${issues.map((issue) => issue.message).join("; ")}`,
    );
  }
}

/**
 * Build a RouteRuleSet for an org from launch-visible teams (metadata for Workforce Router).
 */
export function buildRouteRuleSetFromCatalog(orgId: string): RouteRuleSet {
  const rules: RouteRule[] = [];
  let priority = 100;

  for (const team of listLaunchVisibleTeams()) {
    for (const capabilityTag of team.routingTags.filter((tag) =>
      tag.startsWith("capability:"),
    )) {
      rules.push({
        ruleId: `catalog-${team.id}-${capabilityTag}`,
        priority: priority--,
        match: { capabilityTags: [capabilityTag] },
        routeTo: {
          ownerType: "team",
          ownerId: team.id,
          teamProductId: team.teamProductId,
        },
        enabled: true,
      });
    }
  }

  return { orgId, version: 1, rules };
}

export function getCatalogSummary(): {
  launchTeamCount: number;
  specialistCount: number;
  capabilityCount: number;
} {
  return {
    launchTeamCount: NDP_LAUNCH_TEAMS.length,
    specialistCount: NDP_INVENTORY_SPECIALISTS.length,
    capabilityCount: NDP_CAPABILITY_DEFINITIONS.length,
  };
}

export type { RouteRuleSet };
