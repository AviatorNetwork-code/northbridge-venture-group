import type { KnowledgePackRegistry } from "../types/pack.js";

export interface DependencyGraphNode {
  knowledgePackId: string;
  dependencies: string[];
  depth: number;
}

export interface DependencyResolutionResult {
  orderedIds: string[];
  nodes: DependencyGraphNode[];
  circularDependencies: string[][];
}

export function detectCircularDependencies(
  rootIds: string[],
  registry: KnowledgePackRegistry,
): string[][] {
  const cycles: string[][] = [];

  for (const rootId of rootIds) {
    const visited = new Set<string>();
    const stack: string[] = [];

    function visit(packId: string): void {
      if (stack.includes(packId)) {
        const cycleStart = stack.indexOf(packId);
        cycles.push([...stack.slice(cycleStart), packId]);
        return;
      }

      if (visited.has(packId)) {
        return;
      }

      visited.add(packId);
      stack.push(packId);

      const pack = registry.getPack(packId);
      if (pack) {
        for (const dependencyId of pack.dependencies) {
          visit(dependencyId);
        }
      }

      stack.pop();
    }

    visit(rootId);
  }

  return cycles;
}

export function resolveDependencyGraph(
  rootIds: string[],
  registry: KnowledgePackRegistry,
): DependencyResolutionResult {
  const circularDependencies = detectCircularDependencies(rootIds, registry);
  const nodes = new Map<string, DependencyGraphNode>();
  const visiting = new Set<string>();
  const visited = new Set<string>();

  function visit(packId: string, depth: number): void {
    if (visiting.has(packId)) {
      return;
    }
    if (visited.has(packId)) {
      return;
    }

    const pack = registry.getPack(packId);
    if (!pack) {
      return;
    }

    visiting.add(packId);

    for (const dependencyId of pack.dependencies) {
      visit(dependencyId, depth + 1);
    }

    visiting.delete(packId);
    visited.add(packId);

    nodes.set(packId, {
      knowledgePackId: packId,
      dependencies: pack.dependencies,
      depth,
    });
  }

  for (const rootId of rootIds) {
    visit(rootId, 0);
  }

  const orderedIds = topologicalSort([...nodes.keys()], registry, nodes);

  return {
    orderedIds,
    nodes: [...nodes.values()],
    circularDependencies,
  };
}

function topologicalSort(
  packIds: string[],
  registry: KnowledgePackRegistry,
  nodes: Map<string, DependencyGraphNode>,
): string[] {
  const inDegree = new Map<string, number>();
  const adjacency = new Map<string, string[]>();

  for (const packId of packIds) {
    inDegree.set(packId, 0);
    adjacency.set(packId, []);
  }

  for (const packId of packIds) {
    const pack = registry.getPack(packId);
    if (!pack) {
      continue;
    }

    for (const dependencyId of pack.dependencies) {
      if (!packIds.includes(dependencyId)) {
        continue;
      }
      adjacency.get(dependencyId)!.push(packId);
      inDegree.set(packId, (inDegree.get(packId) ?? 0) + 1);
    }
  }

  const queue = [...packIds]
    .filter((packId) => (inDegree.get(packId) ?? 0) === 0)
    .sort((left, right) => comparePackOrder(left, right, registry));

  const ordered: string[] = [];

  while (queue.length > 0) {
    const packId = queue.shift()!;
    ordered.push(packId);

    for (const dependentId of adjacency.get(packId) ?? []) {
      const nextDegree = (inDegree.get(dependentId) ?? 1) - 1;
      inDegree.set(dependentId, nextDegree);
      if (nextDegree === 0) {
        queue.push(dependentId);
        queue.sort((left, right) => comparePackOrder(left, right, registry));
      }
    }
  }

  return ordered.length === packIds.length
    ? ordered
    : [...nodes.values()]
        .sort((left, right) =>
          comparePackOrder(left.knowledgePackId, right.knowledgePackId, registry),
        )
        .map((node) => node.knowledgePackId);
}

function comparePackOrder(
  leftId: string,
  rightId: string,
  registry: KnowledgePackRegistry,
): number {
  const leftPack = registry.getPack(leftId);
  const rightPack = registry.getPack(rightId);
  const layerDelta = (leftPack?.layerOrder ?? 0) - (rightPack?.layerOrder ?? 0);
  if (layerDelta !== 0) {
    return layerDelta;
  }
  return leftId.localeCompare(rightId);
}

export function collectTransitiveDependencies(
  rootIds: string[],
  registry: KnowledgePackRegistry,
): string[] {
  const collected = new Set<string>();
  const queue = [...rootIds];

  while (queue.length > 0) {
    const packId = queue.shift()!;
    if (collected.has(packId)) {
      continue;
    }

    const pack = registry.getPack(packId);
    if (!pack) {
      continue;
    }

    collected.add(packId);
    for (const dependencyId of pack.dependencies) {
      queue.push(dependencyId);
    }
  }

  return [...collected];
}
