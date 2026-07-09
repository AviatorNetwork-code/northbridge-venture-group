import type { KnowledgePack, KnowledgePackRegistry } from "../types/pack.js";

export class InMemoryKnowledgePackRegistry implements KnowledgePackRegistry {
  private readonly packs = new Map<string, KnowledgePack>();

  registerPack(pack: KnowledgePack): void {
    this.packs.set(pack.knowledgePackId, pack);
  }

  getPack(id: string): KnowledgePack | undefined {
    return this.packs.get(id);
  }

  hasPack(id: string): boolean {
    return this.packs.has(id);
  }

  listPacks(): KnowledgePack[] {
    return [...this.packs.values()];
  }
}

export function createKnowledgePackRegistry(
  packs: KnowledgePack[],
): InMemoryKnowledgePackRegistry {
  const registry = new InMemoryKnowledgePackRegistry();
  for (const pack of packs) {
    registry.registerPack(pack);
  }
  return registry;
}
