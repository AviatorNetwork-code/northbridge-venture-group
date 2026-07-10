import { describe, expect, it } from "vitest";
import {
  NDP_LAUNCH_EMPLOYEE_MANIFESTS,
  getManifestBySpecialistId,
} from "@/lib/ndp/workforce/manifests";
import {
  NDP_LAUNCH_KNOWLEDGE_PACKS,
  assertValidKnowledgePackCatalog,
  buildKnowledgeResolutionPlan,
  createKnowledgePackRegistry,
  detectCircularDependencies,
  resolveDependencyGraph,
  validateEmployeeKnowledgeReferences,
  validateKnowledgePackCatalog,
} from "@/lib/ndp/workforce/knowledge";

describe("Knowledge Pack Framework", () => {
  const registry = createKnowledgePackRegistry(NDP_LAUNCH_KNOWLEDGE_PACKS);

  it("defines twenty-five launch knowledge packs", () => {
    expect(NDP_LAUNCH_KNOWLEDGE_PACKS).toHaveLength(25);
  });

  it("passes catalog validation with acyclic dependency graph", () => {
    const issues = validateKnowledgePackCatalog(registry);
    expect(issues).toEqual([]);
    expect(() => assertValidKnowledgePackCatalog(registry)).not.toThrow();
  });

  it("resolves dependency graph in layered order", () => {
    const graph = resolveDependencyGraph(
      ["knowledge-pack-dental-fundamentals"],
      registry,
    );

    expect(graph.circularDependencies).toEqual([]);
    expect(graph.orderedIds[0]).toBe("knowledge-pack-professional-communication");
    expect(graph.orderedIds).toContain("knowledge-pack-scheduling-fundamentals");
    expect(graph.orderedIds.at(-1)).toBe("knowledge-pack-dental-fundamentals");
  });

  it("detects circular dependencies", () => {
    const cyclicRegistry = createKnowledgePackRegistry([
      ...NDP_LAUNCH_KNOWLEDGE_PACKS,
      {
        knowledgePackId: "knowledge-pack-cycle-a",
        displayName: "Cycle A",
        category: "business",
        version: "1.0.0",
        description: "test",
        tags: [],
        dependencies: ["knowledge-pack-cycle-b"],
        trustLevel: "draft",
        owner: "test",
        layer: "business",
        layerOrder: 10,
        applicableTeams: [],
        applicableEmployees: [],
        lifecycleStatus: "draft",
        launchVisible: false,
      },
      {
        knowledgePackId: "knowledge-pack-cycle-b",
        displayName: "Cycle B",
        category: "business",
        version: "1.0.0",
        description: "test",
        tags: [],
        dependencies: ["knowledge-pack-cycle-a"],
        trustLevel: "draft",
        owner: "test",
        layer: "business",
        layerOrder: 10,
        applicableTeams: [],
        applicableEmployees: [],
        lifecycleStatus: "draft",
        launchVisible: false,
      },
    ]);

    const cycles = detectCircularDependencies(
      ["knowledge-pack-cycle-a"],
      cyclicRegistry,
    );
    expect(cycles.length).toBeGreaterThan(0);
  });

  it("validates employee manifest knowledge references", () => {
    for (const manifest of NDP_LAUNCH_EMPLOYEE_MANIFESTS) {
      const issues = validateEmployeeKnowledgeReferences(manifest, registry);
      expect(issues).toEqual([]);
      expect(manifest.knowledgePackIds.length).toBeGreaterThan(0);
    }
  });

  it("detects missing knowledge pack references", () => {
    const manifest = getManifestBySpecialistId("appointment-specialist")!;
    const broken = {
      ...manifest,
      knowledgePackIds: ["knowledge-pack-does-not-exist"],
    };

    const issues = validateEmployeeKnowledgeReferences(broken, registry);
    expect(issues.some((issue) => issue.code === "unknown_knowledge_pack")).toBe(
      true,
    );
  });

  it("builds ordered knowledge resolution plan for appointment specialist", () => {
    const manifest = getManifestBySpecialistId("appointment-specialist")!;
    const plan = buildKnowledgeResolutionPlan({ manifest, registry });

    expect(plan.employeeId).toBe("employee-appointment");
    expect(plan.resolvedPacks.length).toBeGreaterThan(3);
    expect(plan.resolvedPacks.map((entry) => entry.knowledgePackId)).toEqual([
      "knowledge-pack-professional-communication",
      "knowledge-pack-business-writing",
      "knowledge-pack-business-operations-fundamentals",
      "knowledge-pack-scheduling-fundamentals",
      "knowledge-pack-northbridge-communication-standards",
    ]);
  });

  it("adds team industry packs when team context is provided", () => {
    const manifest = getManifestBySpecialistId("appointment-specialist")!;
    const dentalPlan = buildKnowledgeResolutionPlan({
      manifest,
      registry,
      teamId: "team-dental-office",
    });

    expect(
      dentalPlan.resolvedPacks.some(
        (entry) => entry.knowledgePackId === "knowledge-pack-dental-fundamentals",
      ),
    ).toBe(true);
    expect(
      dentalPlan.resolvedPacks.find(
        (entry) => entry.knowledgePackId === "knowledge-pack-dental-fundamentals",
      )?.source,
    ).toBe("team");
  });

  it("enforces launch visibility rules", () => {
    const experimental = NDP_LAUNCH_KNOWLEDGE_PACKS.map((pack) =>
      pack.knowledgePackId === "knowledge-pack-professional-communication"
        ? { ...pack, trustLevel: "experimental" as const }
        : pack,
    );
    const issues = validateKnowledgePackCatalog(
      createKnowledgePackRegistry(experimental),
    );
    expect(issues.some((issue) => issue.code === "experimental_launch_visible")).toBe(
      true,
    );
  });

  it("validates semver versions", () => {
    for (const pack of NDP_LAUNCH_KNOWLEDGE_PACKS) {
      expect(pack.version).toMatch(/^\d+\.\d+\.\d+$/);
    }
  });
});
