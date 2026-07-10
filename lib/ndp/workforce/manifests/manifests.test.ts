import { describe, expect, it } from "vitest";
import {
  NDP_LAUNCH_TEAMS,
  NDP_INVENTORY_SPECIALISTS,
  NDP_SPECIALIST_ID_SET,
  assertValidNdpTeamCatalog,
} from "@/lib/ndp/workforce/catalog";
import {
  NDP_EXECUTION_CAPABILITY_ID_SET,
  createNdpConnectorRegistry,
} from "@/lib/ndp/connectors";
import {
  NDP_LAUNCH_EMPLOYEE_MANIFESTS,
  assertValidEmployeeManifests,
  buildSpecialistRuntimeConfigPreview,
  buildSpecialistRuntimeConfigPreviews,
  getManifestBySpecialistId,
  groupManifestsByTeam,
  listEmployeeManifestsByTeam,
  listLaunchVisibleEmployeeManifests,
  validateEmployeeManifests,
} from "@/lib/ndp/workforce/manifests";

describe("Digital Employee Manifest Framework", () => {
  it("defines nineteen launch employee manifests", () => {
    expect(NDP_LAUNCH_EMPLOYEE_MANIFESTS).toHaveLength(19);
    expect(listLaunchVisibleEmployeeManifests()).toHaveLength(19);
  });

  it("passes manifest validation against Team Catalog and Connector Registry", () => {
    const registry = createNdpConnectorRegistry();
    const issues = validateEmployeeManifests(NDP_LAUNCH_EMPLOYEE_MANIFESTS, {
      hasConnectorCapability: (id) => registry.hasCapability(id),
    });

    expect(issues).toEqual([]);
    expect(() => assertValidEmployeeManifests(NDP_LAUNCH_EMPLOYEE_MANIFESTS)).not.toThrow();
  });

  it("references only inventory specialists", () => {
    for (const manifest of NDP_LAUNCH_EMPLOYEE_MANIFESTS) {
      expect(NDP_SPECIALIST_ID_SET.has(manifest.specialistId)).toBe(true);
      expect(manifest.role).toBe("specialist");
    }
  });

  it("belongs to at least one valid Team Catalog team", () => {
    const teamIds = new Set(NDP_LAUNCH_TEAMS.map((team) => team.id));

    for (const manifest of NDP_LAUNCH_EMPLOYEE_MANIFESTS) {
      expect(manifest.teamIds.length).toBeGreaterThan(0);
      for (const teamId of manifest.teamIds) {
        expect(teamIds.has(teamId)).toBe(true);
        const team = NDP_LAUNCH_TEAMS.find((entry) => entry.id === teamId);
        expect(team?.specialistIds).toContain(manifest.specialistId);
      }
    }
  });

  it("defines routing and connector capabilities for every manifest", () => {
    for (const manifest of NDP_LAUNCH_EMPLOYEE_MANIFESTS) {
      expect(manifest.capabilities.length).toBeGreaterThan(0);
      expect(manifest.connectorCapabilities.length).toBeGreaterThan(0);
    }
  });

  it("references only connector registry execution capabilities", () => {
    for (const manifest of NDP_LAUNCH_EMPLOYEE_MANIFESTS) {
      for (const connectorCapability of manifest.connectorCapabilities) {
        expect(NDP_EXECUTION_CAPABILITY_ID_SET.has(connectorCapability)).toBe(true);
      }
    }
  });

  it("defines memory, confidence, escalation, and KPI policies", () => {
    for (const manifest of NDP_LAUNCH_EMPLOYEE_MANIFESTS) {
      expect(manifest.memoryPolicy.scope).toBeDefined();
      expect(manifest.confidencePolicy.minimumConfidence).toBeDefined();
      expect(manifest.escalationPolicy.target).toBeDefined();
      expect(manifest.kpis.length).toBeGreaterThan(0);
      expect(manifest.toolRequirements.length).toBeGreaterThan(0);
      expect(manifest.knowledgePackIds.length).toBeGreaterThan(0);
    }
  });

  it("does not include Nordi as a Digital Employee", () => {
    for (const manifest of NDP_LAUNCH_EMPLOYEE_MANIFESTS) {
      expect(manifest.employeeId.toLowerCase()).not.toContain("nordi");
      expect(manifest.displayName.toLowerCase()).not.toContain("nordi");
    }
  });

  it("does not expose managers, directors, or VPs at launch", () => {
    for (const manifest of NDP_LAUNCH_EMPLOYEE_MANIFESTS) {
      expect(manifest.launchVisible).toBe(true);
      expect(manifest.displayName.toLowerCase()).not.toMatch(
        /\b(manager|director|vice president|vp)\b/,
      );
      expect(manifest.escalationPolicy.target).toBe("team_lead");
    }
  });

  it("groups manifests by team", () => {
    const grouped = groupManifestsByTeam(NDP_LAUNCH_EMPLOYEE_MANIFESTS);

    expect(grouped.get("team-marketing")).toHaveLength(5);
    expect(grouped.get("team-sales")).toHaveLength(5);
    expect(grouped.get("team-customer-service")).toHaveLength(5);
    expect(grouped.get("team-financial")).toHaveLength(4);

    const marketingTeam = listEmployeeManifestsByTeam("team-marketing");
    expect(marketingTeam.map((entry) => entry.specialistId)).toEqual(
      expect.arrayContaining([
        "marketing-campaign-specialist",
        "content-posts-specialist",
        "brand-specialist",
      ]),
    );
  });

  it("aligns appointment specialist manifest with capability-based tool requirements", () => {
    const manifest = getManifestBySpecialistId("appointment-specialist");

    expect(manifest?.displayName).toBe("Appointment Specialist");
    expect(manifest?.connectorCapabilities).toEqual([
      "appointment.schedule",
      "appointment.reschedule",
      "schedule.create",
      "schedule.update",
      "schedule.cancel",
    ]);
    expect(manifest?.connectorCapabilities.some((entry) => entry.includes("google"))).toBe(
      false,
    );
  });

  it("produces specialist runtime configuration previews", () => {
    const previews = buildSpecialistRuntimeConfigPreviews(NDP_LAUNCH_EMPLOYEE_MANIFESTS);

    expect(previews).toHaveLength(19);

    for (const preview of previews) {
      expect(preview.specialistDefinitionId).toBeTruthy();
      expect(preview.routingCapabilities.length).toBeGreaterThan(0);
      expect(preview.connectorCapabilityIds.length).toBeGreaterThan(0);
      expect(preview.requiredToolCapabilities.length).toBeGreaterThan(0);
      expect(preview.permissions.canDo).toContain("execute_task");
    }

    const appointmentPreview = buildSpecialistRuntimeConfigPreview(
      getManifestBySpecialistId("appointment-specialist")!,
    );
    expect(appointmentPreview.requiredToolCapabilities).toEqual([
      "appointment.schedule",
      "appointment.reschedule",
      "schedule.create",
      "schedule.update",
      "schedule.cancel",
    ]);
    expect(appointmentPreview.confidencePolicy.minimumConfidence).toBe("medium");
    expect(appointmentPreview.knowledgePackIds).toContain(
      "knowledge-pack-scheduling-fundamentals",
    );
  });

  it("remains compatible with valid Team Catalog", () => {
    expect(() => assertValidNdpTeamCatalog()).not.toThrow();

    const inventoryIds = new Set(NDP_INVENTORY_SPECIALISTS.map((entry) => entry.id));
    for (const manifest of NDP_LAUNCH_EMPLOYEE_MANIFESTS) {
      expect(inventoryIds.has(manifest.specialistId)).toBe(true);
    }
  });
});
