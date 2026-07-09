import { describe, expect, it } from "vitest";
import {
  NDP_LAUNCH_EMPLOYEE_MANIFESTS,
  getManifestBySpecialistId,
} from "@/lib/ndp/workforce/manifests";
import {
  buildKnowledgeResolutionPlan,
  createKnowledgePackRegistry,
  NDP_LAUNCH_KNOWLEDGE_PACKS,
} from "@/lib/ndp/workforce/knowledge";
import {
  NDP_LAUNCH_PROMPT_TEMPLATES,
  assertValidPromptTemplateCatalog,
  buildPromptAssemblyPlan,
  createPromptTemplateRegistry,
  getPromptTemplate,
  validatePromptTemplateCatalog,
  validateTemplateKnowledgeCompatibility,
  validateTemplateManifestCompatibility,
} from "@/lib/ndp/workforce/prompts";

const knowledgeRegistry = createKnowledgePackRegistry(NDP_LAUNCH_KNOWLEDGE_PACKS);
const templateRegistry = createPromptTemplateRegistry(NDP_LAUNCH_PROMPT_TEMPLATES);

describe("Prompt Template Framework", () => {
  it("defines five launch prompt templates", () => {
    expect(NDP_LAUNCH_PROMPT_TEMPLATES).toHaveLength(5);
  });

  it("passes template catalog validation", () => {
    const issues = validatePromptTemplateCatalog(templateRegistry);
    expect(issues).toEqual([]);
    expect(() => assertValidPromptTemplateCatalog(templateRegistry)).not.toThrow();
  });

  it("defines valid section ordering without duplicates", () => {
    for (const template of NDP_LAUNCH_PROMPT_TEMPLATES) {
      const unique = new Set(template.sectionOrder);
      expect(unique.size).toBe(template.sectionOrder.length);
      expect(template.sectionOrder.length).toBeGreaterThan(0);
    }
  });

  it("validates output profiles", () => {
    const profiles = NDP_LAUNCH_PROMPT_TEMPLATES.map((entry) => entry.outputStyle);
    expect(profiles).toContain("specialist");
    expect(profiles).toContain("team_lead");
    expect(profiles).toContain("advisor");
    expect(profiles).toContain("structured_report");
  });

  it("validates manifest compatibility for marketing specialist", () => {
    const manifest = getManifestBySpecialistId("marketing-campaign-specialist")!;
    const template = getPromptTemplate("prompt-template-marketing-specialist")!;

    const issues = validateTemplateManifestCompatibility(template, manifest);
    expect(issues).toEqual([]);
  });

  it("validates knowledge compatibility for appointment specialist", () => {
    const manifest = getManifestBySpecialistId("appointment-specialist")!;
    const template = getPromptTemplate("prompt-template-customer-service-specialist")!;
    const knowledgePlan = buildKnowledgeResolutionPlan({
      manifest,
      registry: knowledgeRegistry,
    });

    const issues = validateTemplateKnowledgeCompatibility(
      template,
      knowledgePlan,
      manifest.employeeId,
    );
    expect(issues).toEqual([]);
  });

  it("builds prompt assembly plan for appointment specialist", () => {
    const manifest = getManifestBySpecialistId("appointment-specialist")!;
    const template = getPromptTemplate("prompt-template-customer-service-specialist")!;
    const knowledgePlan = buildKnowledgeResolutionPlan({
      manifest,
      registry: knowledgeRegistry,
    });

    const plan = buildPromptAssemblyPlan({
      manifest,
      knowledgePlan,
      template,
      contextReferences: {
        organizationContextRef: "org:org-acme",
        conversationContextRef: "thread:thread-1",
        customerContextRef: "customer:cust-1",
      },
      memoryReferences: {
        threadMemoryRef: "memory:thread-1",
        conversationHistoryRef: "history:thread-1",
      },
    });

    expect(plan.templateId).toBe("prompt-template-customer-service-specialist");
    expect(plan.sectionOrder.length).toBe(template.sectionOrder.length);
    expect(plan.sectionOrder[0]?.sectionId).toBe("identity");
    expect(plan.knowledgePacksReferenced.length).toBeGreaterThan(0);
    expect(plan.manifestSectionsUsed).toContain("knowledgePackIds");
    expect(plan.contextProvidersRequired).toContain("organization_context");
    expect(plan.connectorCapabilitySectionsRequired).toContain(
      "available_connector_capabilities",
    );

    const knowledgeSection = plan.sectionOrder.find(
      (entry) => entry.sectionId === "knowledge_packs",
    );
    expect(knowledgeSection?.sourceType).toBe("knowledge_plan");
    expect(knowledgeSection?.sourceKeys.length).toBeGreaterThan(0);
  });

  it("builds assembly plan for financial specialist with structured report output", () => {
    const manifest = getManifestBySpecialistId("financial-specialist")!;
    const template = getPromptTemplate("prompt-template-financial-specialist")!;
    const knowledgePlan = buildKnowledgeResolutionPlan({
      manifest,
      registry: knowledgeRegistry,
    });

    const plan = buildPromptAssemblyPlan({ manifest, knowledgePlan, template });

    expect(plan.outputStyle).toBe("structured_report");
    expect(plan.sectionOrder.map((entry) => entry.sectionId)).toContain("kpis");
  });

  it("supports team lead template metadata without connector sections", () => {
    const template = getPromptTemplate("prompt-template-team-lead")!;

    expect(template.applicableRoles).toContain("team_lead");
    expect(template.requiredConnectorSections).toEqual([]);
    expect(template.requiredContextProviders).toContain("team_context");
    expect(template.requiredContextProviders).toContain("operational_metrics");
    expect(template.outputStyle).toBe("team_lead");
  });

  it("rejects assembly when required knowledge layer is missing", () => {
    const manifest = getManifestBySpecialistId("appointment-specialist")!;
    const template = getPromptTemplate("prompt-template-marketing-specialist")!;
    const knowledgePlan = buildKnowledgeResolutionPlan({
      manifest,
      registry: knowledgeRegistry,
    });

    expect(() =>
      buildPromptAssemblyPlan({ manifest, knowledgePlan, template }),
    ).toThrow(/Prompt assembly plan validation failed/);
  });

  it("covers all launch employee categories with compatible templates", () => {
    const templateByCategory = {
      marketing: "prompt-template-marketing-specialist",
      sales: "prompt-template-sales-specialist",
      "customer-experience": "prompt-template-customer-service-specialist",
      financial: "prompt-template-financial-specialist",
    };

    for (const manifest of NDP_LAUNCH_EMPLOYEE_MANIFESTS) {
      const templateId =
        templateByCategory[manifest.category as keyof typeof templateByCategory];
      if (!templateId) {
        continue;
      }

      const template = getPromptTemplate(templateId)!;
      const knowledgePlan = buildKnowledgeResolutionPlan({
        manifest,
        registry: knowledgeRegistry,
      });

      const manifestIssues = validateTemplateManifestCompatibility(template, manifest);
      expect(manifestIssues).toEqual([]);

      const knowledgeIssues = validateTemplateKnowledgeCompatibility(
        template,
        knowledgePlan,
        manifest.employeeId,
      );
      expect(knowledgeIssues).toEqual([]);
    }
  });
});
