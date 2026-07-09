import type { DigitalEmployeeManifest } from "../../manifests/types/manifest.js";
import type { KnowledgePack, KnowledgePackRegistry } from "../types/pack.js";
import type { KnowledgeValidationIssue } from "../types/resolution.js";
import {
  detectCircularDependencies,
  resolveDependencyGraph,
} from "./dependency-graph.js";

const SEMVER_PATTERN = /^(\d+)\.(\d+)\.(\d+)$/;

export interface KnowledgePackValidationOptions {
  registry: KnowledgePackRegistry;
  expectedMajorVersion?: number;
}

export function validateKnowledgePack(
  pack: KnowledgePack,
  registry: KnowledgePackRegistry,
): KnowledgeValidationIssue[] {
  const issues: KnowledgeValidationIssue[] = [];

  if (!parseSemver(pack.version)) {
    issues.push({
      code: "invalid_version",
      message: `Knowledge pack ${pack.knowledgePackId} has invalid semver ${pack.version}`,
      knowledgePackId: pack.knowledgePackId,
    });
  }

  for (const dependencyId of pack.dependencies) {
    if (!registry.hasPack(dependencyId)) {
      issues.push({
        code: "missing_dependency",
        message: `Knowledge pack ${pack.knowledgePackId} depends on missing pack ${dependencyId}`,
        knowledgePackId: pack.knowledgePackId,
        dependencyId,
      });
    }
  }

  if (pack.launchVisible && pack.lifecycleStatus !== "active") {
    issues.push({
      code: "launch_visibility_conflict",
      message: `Launch-visible pack ${pack.knowledgePackId} must be active`,
      knowledgePackId: pack.knowledgePackId,
    });
  }

  if (pack.launchVisible && pack.trustLevel === "experimental") {
    issues.push({
      code: "experimental_launch_visible",
      message: `Experimental pack ${pack.knowledgePackId} must not be launch visible`,
      knowledgePackId: pack.knowledgePackId,
    });
  }

  const cycles = detectCircularDependencies([pack.knowledgePackId], registry);
  if (cycles.length > 0) {
    issues.push({
      code: "circular_dependency",
      message: `Knowledge pack ${pack.knowledgePackId} participates in a circular dependency`,
      knowledgePackId: pack.knowledgePackId,
    });
  }

  return issues;
}

export function validateKnowledgePackCatalog(
  registry: KnowledgePackRegistry,
  options?: { expectedMajorVersion?: number },
): KnowledgeValidationIssue[] {
  const issues: KnowledgeValidationIssue[] = [];
  const expectedMajor = options?.expectedMajorVersion ?? 1;

  for (const pack of registry.listPacks()) {
    issues.push(...validateKnowledgePack(pack, registry));

    const parsed = parseSemver(pack.version);
    if (parsed && parsed.major !== expectedMajor) {
      issues.push({
        code: "version_major_mismatch",
        message: `Knowledge pack ${pack.knowledgePackId} major version ${parsed.major} does not match expected ${expectedMajor}`,
        knowledgePackId: pack.knowledgePackId,
      });
    }
  }

  const globalCycles = detectCircularDependencies(
    registry.listPacks().map((entry) => entry.knowledgePackId),
    registry,
  );
  if (globalCycles.length > 0) {
    issues.push({
      code: "catalog_circular_dependency",
      message: "Knowledge pack catalog contains circular dependencies",
    });
  }

  return issues;
}

export function validateEmployeeKnowledgeReferences(
  manifest: DigitalEmployeeManifest,
  registry: KnowledgePackRegistry,
): KnowledgeValidationIssue[] {
  const issues: KnowledgeValidationIssue[] = [];

  if (!manifest.knowledgePackIds || manifest.knowledgePackIds.length === 0) {
    issues.push({
      code: "missing_knowledge_packs",
      message: `Digital Employee ${manifest.employeeId} must reference at least one knowledge pack`,
      employeeId: manifest.employeeId,
    });
    return issues;
  }

  for (const packId of manifest.knowledgePackIds) {
    const pack = registry.getPack(packId);
    if (!pack) {
      issues.push({
        code: "unknown_knowledge_pack",
        message: `Unknown knowledge pack ${packId} referenced by ${manifest.employeeId}`,
        employeeId: manifest.employeeId,
        knowledgePackId: packId,
      });
      continue;
    }

    if (
      pack.applicableEmployees.length > 0 &&
      !pack.applicableEmployees.includes(manifest.employeeId)
    ) {
      issues.push({
        code: "employee_incompatible",
        message: `Knowledge pack ${packId} is not compatible with employee ${manifest.employeeId}`,
        employeeId: manifest.employeeId,
        knowledgePackId: packId,
      });
    }

    if (manifest.launchVisible && !pack.launchVisible) {
      issues.push({
        code: "non_launch_pack_on_launch_employee",
        message: `Launch-visible employee ${manifest.employeeId} references non-launch pack ${packId}`,
        employeeId: manifest.employeeId,
        knowledgePackId: packId,
      });
    }
  }

  const cycles = detectCircularDependencies(manifest.knowledgePackIds, registry);
  if (cycles.length > 0) {
    issues.push({
      code: "employee_knowledge_cycle",
      message: `Employee ${manifest.employeeId} knowledge references form a circular dependency`,
      employeeId: manifest.employeeId,
    });
  }

  for (const teamId of manifest.teamIds) {
    issues.push(
      ...validateTeamKnowledgeCompatibility(manifest.employeeId, teamId, registry, manifest.knowledgePackIds),
    );
  }

  return issues;
}

export function validateTeamKnowledgeCompatibility(
  employeeId: string,
  teamId: string,
  registry: KnowledgePackRegistry,
  packIds: string[],
): KnowledgeValidationIssue[] {
  const issues: KnowledgeValidationIssue[] = [];

  for (const packId of packIds) {
    const pack = registry.getPack(packId);
    if (!pack) {
      continue;
    }

    if (
      pack.applicableTeams.length > 0 &&
      !pack.applicableTeams.includes(teamId)
    ) {
      // Domain packs with empty applicableTeams are universal; only flag when explicitly scoped elsewhere
      const explicitlyScopedElsewhere =
        pack.applicableTeams.length > 0 && !pack.applicableTeams.includes(teamId);
      if (explicitlyScopedElsewhere && pack.layer === "industry") {
        issues.push({
          code: "team_incompatible",
          message: `Industry knowledge pack ${packId} is not compatible with team ${teamId}`,
          employeeId,
          teamId,
          knowledgePackId: packId,
        });
      }
    }
  }

  return issues;
}

export function assertValidKnowledgePackCatalog(
  registry: KnowledgePackRegistry,
): void {
  const issues = validateKnowledgePackCatalog(registry);
  if (issues.length > 0) {
    throw new Error(
      `Knowledge pack catalog validation failed: ${issues.map((issue) => issue.message).join("; ")}`,
    );
  }
}

function parseSemver(
  version: string,
): { major: number; minor: number; patch: number } | undefined {
  const match = version.match(SEMVER_PATTERN);
  if (!match) {
    return undefined;
  }

  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
  };
}

export { resolveDependencyGraph };
