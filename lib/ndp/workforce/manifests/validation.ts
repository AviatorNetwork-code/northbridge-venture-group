import { NDP_CAPABILITY_TAG_SET } from "../catalog/capabilities.js";
import {
  NDP_LAUNCH_TEAMS,
  NDP_LAUNCH_TEAM_ID_SET,
} from "../catalog/teams.js";
import { NDP_SPECIALIST_ID_SET } from "../catalog/specialists.js";
import { NDP_EXECUTION_CAPABILITY_ID_SET } from "@/lib/ndp/connectors";
import type { DigitalEmployeeManifest, ManifestValidationIssue } from "../types/manifest.js";

const MANAGEMENT_ROLE_PATTERN =
  /\b(manager|director|vice[_-]?president|vp)\b/i;

const NORDI_PATTERN = /\bnordi\b/i;

export interface ManifestValidationContext {
  manifests: DigitalEmployeeManifest[];
  hasConnectorCapability?: (capabilityId: string) => boolean;
}

export function validateEmployeeManifest(
  manifest: DigitalEmployeeManifest,
  context: ManifestValidationContext,
): ManifestValidationIssue[] {
  const issues: ManifestValidationIssue[] = [];
  const hasConnectorCapability =
    context.hasConnectorCapability ??
    ((id: string) => NDP_EXECUTION_CAPABILITY_ID_SET.has(id));

  if (!NDP_SPECIALIST_ID_SET.has(manifest.specialistId)) {
    issues.push({
      code: "unknown_specialist",
      message: `Specialist ${manifest.specialistId} is not in Workforce Inventory`,
      employeeId: manifest.employeeId,
      specialistId: manifest.specialistId,
    });
  }

  if (manifest.teamIds.length === 0) {
    issues.push({
      code: "missing_team",
      message: "Digital Employee must belong to at least one team",
      employeeId: manifest.employeeId,
    });
  }

  for (const teamId of manifest.teamIds) {
    if (!NDP_LAUNCH_TEAM_ID_SET.has(teamId)) {
      issues.push({
        code: "unknown_team",
        message: `Team ${teamId} is not in Team Catalog`,
        employeeId: manifest.employeeId,
        teamId,
      });
      continue;
    }

    const team = NDP_LAUNCH_TEAMS.find((entry) => entry.id === teamId);
    if (team && !team.specialistIds.includes(manifest.specialistId)) {
      issues.push({
        code: "specialist_not_on_team",
        message: `Specialist ${manifest.specialistId} is not assigned to team ${teamId}`,
        employeeId: manifest.employeeId,
        specialistId: manifest.specialistId,
        teamId,
      });
    }
  }

  if (manifest.capabilities.length === 0) {
    issues.push({
      code: "missing_capabilities",
      message: "Digital Employee must define routing capabilities",
      employeeId: manifest.employeeId,
    });
  }

  for (const capability of manifest.capabilities) {
    if (!NDP_CAPABILITY_TAG_SET.has(capability)) {
      issues.push({
        code: "unknown_capability",
        message: `Unknown routing capability ${capability}`,
        employeeId: manifest.employeeId,
        capability,
      });
    }
  }

  for (const connectorCapability of manifest.connectorCapabilities) {
    if (!hasConnectorCapability(connectorCapability)) {
      issues.push({
        code: "unknown_connector_capability",
        message: `Unknown connector capability ${connectorCapability}`,
        employeeId: manifest.employeeId,
        connectorCapability,
      });
    }
  }

  if (!manifest.memoryPolicy) {
    issues.push({
      code: "missing_memory_policy",
      message: "Digital Employee must define a memory policy",
      employeeId: manifest.employeeId,
    });
  }

  if (!manifest.confidencePolicy) {
    issues.push({
      code: "missing_confidence_policy",
      message: "Digital Employee must define a confidence policy",
      employeeId: manifest.employeeId,
    });
  }

  if (!manifest.escalationPolicy) {
    issues.push({
      code: "missing_escalation_policy",
      message: "Digital Employee must define an escalation policy",
      employeeId: manifest.employeeId,
    });
  }

  if (!manifest.kpis || manifest.kpis.length === 0) {
    issues.push({
      code: "missing_kpis",
      message: "Digital Employee must define at least one KPI",
      employeeId: manifest.employeeId,
    });
  }

  if (NORDI_PATTERN.test(manifest.employeeId) || NORDI_PATTERN.test(manifest.displayName)) {
    issues.push({
      code: "nordi_in_manifest",
      message: "Nordi must not appear as a Digital Employee manifest",
      employeeId: manifest.employeeId,
    });
  }

  if (manifest.role !== "specialist") {
    issues.push({
      code: "invalid_launch_role",
      message: "Launch Digital Employees must use specialist role",
      employeeId: manifest.employeeId,
    });
  }

  if (
    manifest.launchVisible &&
    (MANAGEMENT_ROLE_PATTERN.test(manifest.displayName) ||
      MANAGEMENT_ROLE_PATTERN.test(manifest.employeeId))
  ) {
    issues.push({
      code: "management_launch_visible",
      message: "Managers, directors, and VPs must not be launch visible",
      employeeId: manifest.employeeId,
    });
  }

  if (manifest.launchVisible && manifest.escalationPolicy.target !== "team_lead") {
    const target = manifest.escalationPolicy.target;
    if (target === "manager" || target === "human_operator") {
      // manager is future-gated; at launch only team_lead is valid for launch-visible employees
      if (target === "manager") {
        issues.push({
          code: "manager_escalation_launch_visible",
          message: "Launch-visible employees must escalate to team_lead, not manager",
          employeeId: manifest.employeeId,
        });
      }
    }
  }

  const duplicateIds = context.manifests.filter(
    (entry) => entry.employeeId === manifest.employeeId,
  );
  if (duplicateIds.length > 1) {
    issues.push({
      code: "duplicate_employee_id",
      message: `Duplicate employeeId ${manifest.employeeId}`,
      employeeId: manifest.employeeId,
    });
  }

  return issues;
}

export function validateEmployeeManifests(
  manifests: DigitalEmployeeManifest[],
  options?: { hasConnectorCapability?: (capabilityId: string) => boolean },
): ManifestValidationIssue[] {
  const context: ManifestValidationContext = {
    manifests,
    hasConnectorCapability: options?.hasConnectorCapability,
  };

  return manifests.flatMap((manifest) => validateEmployeeManifest(manifest, context));
}

export function assertValidEmployeeManifests(
  manifests: DigitalEmployeeManifest[],
): void {
  const issues = validateEmployeeManifests(manifests);
  if (issues.length > 0) {
    throw new Error(
      `Digital Employee manifest validation failed: ${issues.map((issue) => issue.message).join("; ")}`,
    );
  }
}

export function groupManifestsByTeam(
  manifests: DigitalEmployeeManifest[],
): Map<string, DigitalEmployeeManifest[]> {
  const grouped = new Map<string, DigitalEmployeeManifest[]>();

  for (const manifest of manifests) {
    for (const teamId of manifest.teamIds) {
      const existing = grouped.get(teamId) ?? [];
      existing.push(manifest);
      grouped.set(teamId, existing);
    }
  }

  return grouped;
}
