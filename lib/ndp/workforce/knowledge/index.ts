export type {
  KnowledgeCategory,
  KnowledgeLayerType,
} from "./types/category.js";
export {
  KNOWLEDGE_CATEGORY_SET,
  KNOWLEDGE_LAYER_ORDER,
  defaultLayerForCategory,
  isKnownKnowledgeCategory,
} from "./types/category.js";

export type {
  KnowledgePack,
  KnowledgePackRegistry,
  KnowledgeLifecycleStatus,
  KnowledgeTrustLevel,
} from "./types/pack.js";

export type {
  KnowledgeResolutionPlan,
  KnowledgeValidationIssue,
  ResolvedKnowledgePackEntry,
} from "./types/resolution.js";

export {
  NDP_LAUNCH_KNOWLEDGE_PACKS,
  NDP_LAUNCH_KNOWLEDGE_PACK_ID_SET,
  getKnowledgePack,
  listLaunchVisibleKnowledgePacks,
} from "./catalog/launch-packs.js";

export {
  InMemoryKnowledgePackRegistry,
  createKnowledgePackRegistry,
} from "./registry/in-memory-registry.js";

export {
  collectTransitiveDependencies,
  detectCircularDependencies,
  resolveDependencyGraph,
  type DependencyGraphNode,
  type DependencyResolutionResult,
} from "./validation/dependency-graph.js";

export {
  validateKnowledgePack,
  validateKnowledgePackCatalog,
  validateEmployeeKnowledgeReferences,
  validateTeamKnowledgeCompatibility,
  assertValidKnowledgePackCatalog,
  type KnowledgePackValidationOptions,
} from "./validation/pack-validation.js";

export {
  buildKnowledgeResolutionPlan,
  type BuildKnowledgeResolutionPlanInput,
} from "./resolution/knowledge-resolver.js";
