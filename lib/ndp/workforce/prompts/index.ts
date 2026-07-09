export type {
  PromptTemplateSectionId,
  PromptTemplateSectionDefinition,
} from "./types/section.js";
export {
  PROMPT_TEMPLATE_SECTIONS,
  PROMPT_TEMPLATE_SECTION_ID_SET,
  getPromptTemplateSection,
} from "./types/section.js";

export type {
  PromptTemplate,
  PromptTemplateCategory,
  PromptTemplateRegistry,
  ApplicableRole,
  OutputProfile,
  ManifestSectionId,
  ContextProviderId,
  MemoryProviderId,
  PromptLifecycleStatus,
} from "./types/template.js";

export type {
  ContextReferenceSet,
  MemoryReferenceSet,
  PromptAssemblyPlan,
  PromptAssemblySection,
  PromptValidationIssue,
} from "./types/assembly.js";

export {
  NDP_LAUNCH_PROMPT_TEMPLATES,
  NDP_LAUNCH_PROMPT_TEMPLATE_ID_SET,
  getPromptTemplate,
  listLaunchVisiblePromptTemplates,
} from "./catalog/launch-templates.js";

export {
  InMemoryPromptTemplateRegistry,
  createPromptTemplateRegistry,
} from "./registry/in-memory-registry.js";

export {
  validatePromptTemplate,
  validatePromptTemplateCatalog,
  validateTemplateManifestCompatibility,
  validateTemplateKnowledgeCompatibility,
  assertValidPromptTemplateCatalog,
} from "./validation/template-validation.js";

export {
  buildPromptAssemblyPlan,
  type BuildPromptAssemblyPlanInput,
} from "./assembly/prompt-assembler.js";
