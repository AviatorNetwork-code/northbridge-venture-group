import { describe, expect, it } from "vitest";
import {
  createConnectorRouter,
  InMemoryConnectorRegistry,
} from "@northbridge/workforce-connectors";
import {
  createCapabilityRoutedTaskExecutor,
  createCapabilityToolRouter,
  createSpecialistRuntime,
  InMemoryCapabilityRegistry,
} from "@northbridge/specialist-runtime";
import type { Specialist, Task } from "@northbridge/workforce-contracts";
import {
  MARKETING_EXECUTION_CAPABILITIES,
  MARKETING_SPECIALIST_IDS,
  MARKETING_TEAM_ID,
  MARKETING_TEAM_LEAD_ID,
  assembleMarketingEmployeeRuntime,
  buildMarketingDashboardModel,
  buildMarketingSpecialistRoster,
  createMarketingMockConnectorRegistry,
  createMarketingTeamOrchestrator,
  generateMarketingRecommendations,
  MarketingSpecialistSelector,
  MarketingTeamSynthesizer,
  MOCK_OUTPUTS,
  getProductionPromptForEmployee,
  renderEmployeeRuntimePrompt,
  renderKnowledgePackText,
} from "@/lib/ndp/teams/marketing";
import { listEmployeeManifestsByTeam } from "@/lib/ndp/workforce/manifests";

const ORG = "org-acme";
const NOW = "2026-07-09T22:00:00.000Z";

describe("Marketing Team Alpha", () => {
  it("defines five marketing specialists", () => {
    expect(MARKETING_SPECIALIST_IDS).toHaveLength(5);
    expect(MARKETING_TEAM_LEAD_ID).toBe("lead-team-marketing");
  });

  it("registers six mock execution capabilities", () => {
    expect(MARKETING_EXECUTION_CAPABILITIES).toHaveLength(6);
    expect(Object.keys(MOCK_OUTPUTS)).toHaveLength(6);
  });

  it("builds specialist roster from manifests", () => {
    const roster = buildMarketingSpecialistRoster(ORG);
    expect(roster).toHaveLength(5);
    expect(roster.every((entry) => entry.teamId === MARKETING_TEAM_ID)).toBe(true);
  });

  it("assembles employee runtime through platform layers", () => {
    const manifests = listEmployeeManifestsByTeam(MARKETING_TEAM_ID);
    expect(manifests.length).toBeGreaterThan(0);

    for (const manifest of manifests) {
      const assembly = assembleMarketingEmployeeRuntime(manifest, {
        organizationId: ORG,
      });
      expect(assembly.runtimeConfigPreview.employeeId).toBe(manifest.employeeId);
      expect(assembly.knowledgePlan.resolvedPacks.length).toBeGreaterThan(0);
      expect(assembly.promptAssemblyPlan.templateId).toBe(
        "prompt-template-marketing-specialist",
      );
      expect(assembly.knowledgeContentRefs.length).toBeGreaterThan(0);
      expect(assembly.organizationContextRef).toContain(`operations-intelligence:${ORG}`);
      expect(
        assembly.promptAssemblyPlan.sectionOrder.find(
          (entry) => entry.sectionId === "organization_context",
        )?.sourceKeys[0],
      ).toBe(assembly.organizationContextRef);
    }
  });

  it("provides production prompt templates for all marketing employees", () => {
    const manifests = listEmployeeManifestsByTeam(MARKETING_TEAM_ID);
    for (const manifest of manifests) {
      const prompt = getProductionPromptForEmployee(manifest.employeeId);
      expect(prompt).toBeDefined();
      expect(prompt!.version).toBe("1.0.0");
    }
  });

  it("renders modular knowledge pack content", () => {
    const text = renderKnowledgePackText("knowledge-pack-campaign-planning");
    expect(text).toContain("Campaign Structure");
    expect(text).not.toMatch(/org-acme|customer-specific/i);
  });

  it("renders assembled runtime prompt with knowledge references", () => {
    const manifest = listEmployeeManifestsByTeam(MARKETING_TEAM_ID)[0]!;
    const prompt = renderEmployeeRuntimePrompt(manifest);
    expect(prompt).toContain("You are");
    expect(prompt.length).toBeGreaterThan(100);
  });

  it("executes mock connector capabilities", async () => {
    const registry = createMarketingMockConnectorRegistry(() => NOW);
    const router = createCapabilityToolRouter(
      createConnectorRouter({ registry, now: () => NOW }),
    );
    const executor = createCapabilityRoutedTaskExecutor({ router, now: () => NOW });

    for (const capability of MARKETING_EXECUTION_CAPABILITIES) {
      const result = await executor.execute(buildExecutionInput(capability.id));
      expect(result.summary.length).toBeGreaterThan(0);
      expect(result.confidence.level).toBe("high");
    }
  });

  it("selects specialists by capability tags", async () => {
    const selector = new MarketingSpecialistSelector();
    const selections = await selector.select({
      requestId: "req-1",
      orgId: ORG,
      teamId: MARKETING_TEAM_ID,
      payload: {
        message: "I want more customers",
        capabilityTags: ["capability:customer_acquisition"],
      },
      availableSpecialistIds: [...MARKETING_SPECIALIST_IDS],
    });

    expect(selections.length).toBeGreaterThanOrEqual(2);
    expect(selections.some((entry) => entry.specialistId === "marketing-campaign-specialist")).toBe(
      true,
    );
    expect(selections.some((entry) => entry.specialistId === "marketing-analytics-specialist")).toBe(
      true,
    );
  });

  it("delegates to multiple specialists by default for broad requests without tags", async () => {
    const selector = new MarketingSpecialistSelector();
    const selections = await selector.select({
      requestId: "req-broad",
      orgId: ORG,
      teamId: MARKETING_TEAM_ID,
      payload: {
        message: "Help us improve our marketing strategy.",
      },
      availableSpecialistIds: [...MARKETING_SPECIALIST_IDS],
    });

    expect(selections.length).toBeGreaterThanOrEqual(2);
  });

  it("may delegate to a single specialist for simple KPI lookups", async () => {
    const selector = new MarketingSpecialistSelector();
    const selections = await selector.select({
      requestId: "req-simple",
      orgId: ORG,
      teamId: MARKETING_TEAM_ID,
      payload: {
        message: "What is our cost per lead?",
        capabilityTags: ["capability:analytics"],
      },
      availableSpecialistIds: [...MARKETING_SPECIALIST_IDS],
    });

    expect(selections).toHaveLength(1);
    expect(selections[0]!.specialistId).toBe("marketing-analytics-specialist");
  });

  it("generates customer-success-first recommendations", () => {
    const recommendations = generateMarketingRecommendations({
      evidence: MOCK_OUTPUTS["budget.review"].evidence,
      message: "I want more customers",
    });

    expect(recommendations.length).toBeGreaterThan(0);
    expect(recommendations.every((entry) => entry.customerSuccessFirst)).toBe(true);
    expect(
      recommendations.every((entry) => !entry.summary.toLowerCase().includes("subscription")),
    ).toBe(true);
  });

  it("synthesizes a single team lead response without exposing delegation", async () => {
    const synthesizer = new MarketingTeamSynthesizer();
    const result = await synthesizer.synthesize({
      request: {
        id: "req-1",
        orgId: ORG,
        teamId: MARKETING_TEAM_ID,
        teamLeadId: MARKETING_TEAM_LEAD_ID,
        source: "customer",
        payload: { message: "I want more customers" },
        receivedAt: NOW,
      },
      results: [
        {
          taskId: "task-1",
          specialistId: "marketing-campaign-specialist",
          outcome: "complete",
          result: {
            summary: "Campaign plan ready for local acquisition.",
            confidence: { level: "high" },
          },
        },
      ],
      conflicts: [],
      now: NOW,
    });

    expect(result.summary).toContain("Campaign plan");
    expect(result.summary).not.toContain("marketing-campaign-specialist");
    expect(result.summary).not.toContain("delegat");
  });

  it("orchestrates end-to-end team work", async () => {
    const orchestrator = createMarketingTeamOrchestrator({
      orgId: ORG,
      now: () => NOW,
    });

    const result = await orchestrator.orchestrate({
      request: {
        id: "req-e2e",
        orgId: ORG,
        teamId: MARKETING_TEAM_ID,
        teamLeadId: MARKETING_TEAM_LEAD_ID,
        source: "customer",
        payload: {
          message: "I want more customers",
          capabilityTags: ["capability:customer_acquisition"],
        },
        receivedAt: NOW,
      },
      sessionId: "session-e2e",
    });

    expect(result.outcome).toBe("complete");
    expect(result.synthesis.summary.length).toBeGreaterThan(0);
    expect(result.synthesis.contributingSpecialistIds.length).toBeGreaterThanOrEqual(2);
    expect(result.synthesis.summary).not.toContain("marketing-campaign-specialist");
    expect(result.synthesis.summary).not.toContain("delegat");
  });

  it("builds operational dashboard model with required cards", () => {
    const dashboard = buildMarketingDashboardModel({
      teamId: MARKETING_TEAM_ID,
      now: NOW,
    });

    const cardIds = dashboard.cards.map((entry) => entry.id);
    expect(cardIds).toContain("active_campaigns");
    expect(cardIds).toContain("campaign_status");
    expect(cardIds).toContain("scheduled_content");
    expect(cardIds).toContain("content_backlog");
    expect(cardIds).toContain("budget_utilization");
    expect(cardIds).toContain("lead_volume");
    expect(cardIds).toContain("marketing_kpis");
    expect(cardIds).toContain("recommendations");
    expect(cardIds).toContain("alerts");
  });
});

function buildExecutionInput(capabilityId: string) {
  const specialist: Specialist = {
    id: "marketing-campaign-specialist",
    orgId: ORG,
    teamId: MARKETING_TEAM_ID,
    specialistDefinitionId: "marketing-campaign-specialist",
    role: "specialist",
    permissions: {
      canDo: [
        "marketing:write",
        "marketing:read",
        "content:write",
        "analytics:read",
        "finance:read",
        "execute_task",
      ],
      cannotDo: [],
    },
    status: "active",
  };

  const task: Task = {
    id: "task-1",
    orgId: ORG,
    teamId: MARKETING_TEAM_ID,
    specialistId: specialist.id,
    assignedByTeamLeadId: MARKETING_TEAM_LEAD_ID,
    status: "pending",
    permissions: {
      canDo: [
        "marketing:write",
        "marketing:read",
        "content:write",
        "analytics:read",
        "finance:read",
        "execute_task",
      ],
      cannotDo: [],
    },
    context: { capabilityId, instruction: "Execute mock capability" },
    createdAt: NOW,
    updatedAt: NOW,
  };

  const capabilityRegistry = new InMemoryCapabilityRegistry();
  capabilityRegistry.register("marketing-campaign-specialist", [
    { id: capabilityId, requiredPermission: "marketing:write" },
  ]);

  return {
    session: {
      sessionId: "session-1",
      specialist,
      task,
      state: "executing" as const,
      startedAt: NOW,
      updatedAt: NOW,
    },
    context: {
      orgId: ORG,
      teamId: MARKETING_TEAM_ID,
      specialist,
      task,
      payload: { capabilityId },
    },
  };
}
