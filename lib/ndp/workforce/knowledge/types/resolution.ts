import type { KnowledgeCategory, KnowledgeLayerType } from "./category.js";

export interface ResolvedKnowledgePackEntry {
  knowledgePackId: string;
  displayName: string;
  category: KnowledgeCategory;
  version: string;
  layer: KnowledgeLayerType;
  layerOrder: number;
  dependencyDepth: number;
  source: "employee" | "dependency" | "team";
}

export interface KnowledgeResolutionPlan {
  employeeId: string;
  requestedPackIds: string[];
  teamId?: string;
  resolvedPacks: ResolvedKnowledgePackEntry[];
  totalPackCount: number;
}

export interface KnowledgeValidationIssue {
  code: string;
  message: string;
  knowledgePackId?: string;
  employeeId?: string;
  teamId?: string;
  dependencyId?: string;
}
