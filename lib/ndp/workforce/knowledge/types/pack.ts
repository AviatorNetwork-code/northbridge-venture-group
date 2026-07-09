import type { KnowledgeCategory, KnowledgeLayerType } from "./category.js";

export type KnowledgeTrustLevel =
  | "canonical"
  | "verified"
  | "draft"
  | "experimental";

export type KnowledgeLifecycleStatus =
  | "draft"
  | "active"
  | "deprecated"
  | "archived";

export interface KnowledgePack {
  knowledgePackId: string;
  displayName: string;
  category: KnowledgeCategory;
  version: string;
  description: string;
  tags: string[];
  dependencies: string[];
  trustLevel: KnowledgeTrustLevel;
  owner: string;
  layer: KnowledgeLayerType;
  layerOrder: number;
  applicableTeams: string[];
  applicableEmployees: string[];
  lifecycleStatus: KnowledgeLifecycleStatus;
  launchVisible: boolean;
  metadata?: Record<string, unknown>;
}

export interface KnowledgePackRegistry {
  getPack(id: string): KnowledgePack | undefined;
  hasPack(id: string): boolean;
  listPacks(): KnowledgePack[];
}
