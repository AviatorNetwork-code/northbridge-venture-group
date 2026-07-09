import type { DigitalEmployeeManifest } from "../../manifests/types/manifest.js";
import type { KnowledgePackRegistry } from "../types/pack.js";
import type {
  KnowledgeResolutionPlan,
  ResolvedKnowledgePackEntry,
} from "../types/resolution.js";
import {
  collectTransitiveDependencies,
  resolveDependencyGraph,
} from "../validation/dependency-graph.js";

export interface BuildKnowledgeResolutionPlanInput {
  manifest: DigitalEmployeeManifest;
  registry: KnowledgePackRegistry;
  teamId?: string;
  includeTeamIndustryPacks?: boolean;
}

/**
 * Builds an ordered Knowledge Resolution Plan for a Digital Employee manifest.
 * No content loading, prompt generation, or execution.
 */
export function buildKnowledgeResolutionPlan(
  input: BuildKnowledgeResolutionPlanInput,
): KnowledgeResolutionPlan {
  const { manifest, registry, teamId, includeTeamIndustryPacks = true } = input;

  const requestedPackIds = [...(manifest.knowledgePackIds ?? [])];
  const teamPackIds: string[] = [];

  if (teamId && includeTeamIndustryPacks) {
    for (const pack of registry.listPacks()) {
      if (
        pack.launchVisible &&
        pack.layer === "industry" &&
        pack.applicableTeams.includes(teamId)
      ) {
        teamPackIds.push(pack.knowledgePackId);
      }
    }
  }

  const rootIds = [...new Set([...requestedPackIds, ...teamPackIds])];
  const transitiveIds = collectTransitiveDependencies(rootIds, registry);
  const graph = resolveDependencyGraph(transitiveIds, registry);

  const sourceById = new Map<string, ResolvedKnowledgePackEntry["source"]>();
  for (const packId of requestedPackIds) {
    sourceById.set(packId, "employee");
  }
  for (const packId of teamPackIds) {
    sourceById.set(packId, "team");
  }

  const resolvedPacks: ResolvedKnowledgePackEntry[] = graph.orderedIds
    .map((packId) => {
      const pack = registry.getPack(packId);
      const node = graph.nodes.find((entry) => entry.knowledgePackId === packId);
      if (!pack || !node) {
        return undefined;
      }

      const source =
        sourceById.get(packId) ??
        (pack.dependencies.length > 0 ? "dependency" : "employee");

      return {
        knowledgePackId: pack.knowledgePackId,
        displayName: pack.displayName,
        category: pack.category,
        version: pack.version,
        layer: pack.layer,
        layerOrder: pack.layerOrder,
        dependencyDepth: node.depth,
        source,
      };
    })
    .filter((entry): entry is ResolvedKnowledgePackEntry => entry !== undefined);

  return {
    employeeId: manifest.employeeId,
    requestedPackIds,
    teamId,
    resolvedPacks,
    totalPackCount: resolvedPacks.length,
  };
}
