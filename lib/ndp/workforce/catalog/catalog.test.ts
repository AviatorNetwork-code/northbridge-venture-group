import { describe, expect, it } from "vitest";
import {
  assertValidNdpTeamCatalog,
  buildRouteRuleSetFromCatalog,
  getCatalogSummary,
  getLaunchTeam,
  listLaunchVisibleTeams,
  NDP_INVENTORY_SPECIALISTS,
  NDP_LAUNCH_TEAMS,
  validateNdpTeamCatalog,
} from "@/lib/ndp/workforce/catalog";

describe("NDP team catalog", () => {
  it("defines nine launch teams", () => {
    expect(NDP_LAUNCH_TEAMS).toHaveLength(9);
    expect(getCatalogSummary().launchTeamCount).toBe(9);
  });

  it("passes catalog consistency validation", () => {
    expect(validateNdpTeamCatalog()).toEqual([]);
    expect(() => assertValidNdpTeamCatalog()).not.toThrow();
  });

  it("gives every launch team a Team Lead", () => {
    for (const team of NDP_LAUNCH_TEAMS) {
      expect(team.teamLead.role).toBe("team_lead");
      expect(team.teamLead.teamId).toBe(team.id);
      expect(team.teamLead.id).toBe(`lead-${team.id}`);
    }
  });

  it("gives every launch team at least one specialist", () => {
    for (const team of NDP_LAUNCH_TEAMS) {
      expect(team.specialistIds.length).toBeGreaterThan(0);
    }
  });

  it("references only inventory specialists", () => {
    const inventoryIds = new Set(NDP_INVENTORY_SPECIALISTS.map((entry) => entry.id));

    for (const team of NDP_LAUNCH_TEAMS) {
      for (const specialistId of team.specialistIds) {
        expect(inventoryIds.has(specialistId)).toBe(true);
      }
    }
  });

  it("defines routing and capability tags for every launch team", () => {
    for (const team of NDP_LAUNCH_TEAMS) {
      expect(team.routingTags.length).toBeGreaterThan(0);
      expect(team.capabilityTags.length).toBeGreaterThan(0);
      expect(team.routingTags.some((tag) => tag.startsWith("intent:"))).toBe(true);
      expect(team.routingTags.some((tag) => tag.startsWith("capability:"))).toBe(true);
    }
  });

  it("keeps future organizational layers feature-gated and not launch visible", () => {
    for (const team of NDP_LAUNCH_TEAMS) {
      expect(team.futureOrganizationalLayers).toHaveLength(3);
      for (const layer of team.futureOrganizationalLayers) {
        expect(layer.launchVisible).toBe(false);
        expect(["managersEnabled", "directorsEnabled", "vpsEnabled"]).toContain(
          layer.requiredFeatureFlag,
        );
      }
    }
  });

  it("does not expose manager, director, or VP in launch visibility", () => {
    for (const team of listLaunchVisibleTeams()) {
      expect(team.launchVisible).toBe(true);
      expect(team.name.toLowerCase()).not.toContain("manager");
      expect(team.name.toLowerCase()).not.toContain("director");
      expect(team.name.toLowerCase()).not.toContain("vice president");
    }
  });

  it("does not include Nordi in the customer workforce catalog", () => {
    for (const team of NDP_LAUNCH_TEAMS) {
      expect(team.id).not.toContain("nordi");
      expect(team.name.toLowerCase()).not.toContain("nordi");
    }

    for (const specialist of NDP_INVENTORY_SPECIALISTS) {
      expect(specialist.id).not.toContain("nordi");
      expect(specialist.name.toLowerCase()).not.toContain("nordi");
    }
  });

  it("maps Marketing Team to inventory specialists", () => {
    const marketing = getLaunchTeam("team-marketing");
    expect(marketing?.name).toBe("Marketing Team");
    expect(marketing?.specialistIds).toContain("marketing-campaign-specialist");
    expect(marketing?.capabilityTags).toContain("capability:customer_acquisition");
  });

  it("builds workforce router rules from catalog metadata", () => {
    const rules = buildRouteRuleSetFromCatalog("org-acme");
    expect(rules.orgId).toBe("org-acme");
    expect(rules.rules.length).toBeGreaterThan(0);

    const marketingRule = rules.rules.find(
      (rule) => rule.routeTo.ownerId === "team-marketing",
    );
    expect(marketingRule?.match.capabilityTags).toContain("capability:customer_acquisition");
    expect(marketingRule?.routeTo.ownerType).toBe("team");
  });
});
