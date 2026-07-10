import { describe, expect, it } from "vitest";
import {
  createConnectorRouter,
} from "@northbridge/workforce-connectors";
import {
  createCapabilityRoutedTaskExecutor,
  createCapabilityToolRouter,
  InMemoryCapabilityRegistry,
} from "@northbridge/specialist-runtime";
import type { Specialist, Task } from "@northbridge/workforce-contracts";
import { buildOperationsIntelligenceContextForOrg } from "@/lib/ndp/operations-context";
import {
  SALES_EXECUTION_CAPABILITIES,
  SALES_SPECIALIST_IDS,
  SALES_TEAM_ID,
  SALES_TEAM_LEAD_ID,
  assembleSalesEmployeeRuntime,
  buildSalesDashboardModel,
  buildSalesSpecialistRoster,
  buildSalesTeamRuntimeContext,
  createSalesMockConnectorRegistry,
  createSalesTeamOrchestrator,
  generateSalesRecommendations,
  SalesSpecialistSelector,
  SalesTeamSynthesizer,
  MOCK_OUTPUTS,
  getProductionPromptForEmployee,
  renderKnowledgePackText,
} from "@/lib/ndp/teams/sales";
import { listEmployeeManifestsByTeam } from "@/lib/ndp/workforce/manifests";

const ORG = "org-acme";
const NOW = "2026-07-09T22:00:00.000Z";

describe("Sales Team Alpha", () => {
  it("defines five sales specialists", () => {
    expect(SALES_SPECIALIST_IDS).toHaveLength(5);
    expect(SALES_TEAM_LEAD_ID).toBe("lead-team-sales");
  });

  it("registers six mock execution capabilities", () => {
    expect(SALES_EXECUTION_CAPABILITIES).toHaveLength(6);
    expect(Object.keys(MOCK_OUTPUTS)).toHaveLength(6);
  });

  it("builds specialist roster from manifests", () => {
    const roster = buildSalesSpecialistRoster(ORG);
    expect(roster).toHaveLength(5);
    expect(roster.every((entry) => entry.teamId === SALES_TEAM_ID)).toBe(true);
  });

  it("assembles employee runtime with OIL context references", () => {
    const manifests = listEmployeeManifestsByTeam(SALES_TEAM_ID);
    expect(manifests.length).toBeGreaterThan(0);

    for (const manifest of manifests) {
      const assembly = assembleSalesEmployeeRuntime(manifest, { organizationId: ORG });
      expect(assembly.knowledgePlan.resolvedPacks.length).toBeGreaterThan(0);
      expect(assembly.promptAssemblyPlan.templateId).toBe("prompt-template-sales-specialist");
      expect(assembly.organizationContextRef).toContain(`operations-intelligence:${ORG}`);
    }
  });

  it("provides production prompt templates for all sales employees", () => {
    const manifests = listEmployeeManifestsByTeam(SALES_TEAM_ID);
    for (const manifest of manifests) {
      const prompt = getProductionPromptForEmployee(manifest.employeeId);
      expect(prompt).toBeDefined();
      expect(prompt!.version).toBe("1.0.0");
    }
  });

  it("renders modular sales knowledge pack content", () => {
    const text = renderKnowledgePackText("knowledge-pack-lead-qualification");
    expect(text).toContain("Lead Scoring");
    expect(text).not.toMatch(/org-acme|customer-specific/i);
  });

  it("executes mock connector capabilities", async () => {
    const registry = createSalesMockConnectorRegistry(() => NOW);
    const router = createCapabilityToolRouter(
      createConnectorRouter({ registry, now: () => NOW }),
    );
    const executor = createCapabilityRoutedTaskExecutor({ router, now: () => NOW });

    for (const capability of SALES_EXECUTION_CAPABILITIES) {
      const result = await executor.execute(buildExecutionInput(capability.id));
      expect(result.summary.length).toBeGreaterThan(0);
      expect(result.confidence.level).toBe("high");
    }
  });

  it("delegates to multiple specialists for broad sales pipeline requests", async () => {
    const selector = new SalesSpecialistSelector();
    const selections = await selector.select({
      requestId: "req-broad",
      orgId: ORG,
      teamId: SALES_TEAM_ID,
      payload: {
        message: "I need more customers.",
        capabilityTags: ["capability:sales_pipeline"],
      },
      availableSpecialistIds: [...SALES_SPECIALIST_IDS],
    });

    expect(selections.length).toBeGreaterThanOrEqual(2);
    expect(selections.some((entry) => entry.specialistId === "sales-specialist")).toBe(true);
    expect(selections.some((entry) => entry.specialistId === "lead-qualification-specialist")).toBe(
      true,
    );
  });

  it("delegates to multiple specialists for close-more-leads requests", async () => {
    const selector = new SalesSpecialistSelector();
    const selections = await selector.select({
      requestId: "req-close",
      orgId: ORG,
      teamId: SALES_TEAM_ID,
      payload: {
        message: "Can you help me close more leads?",
        capabilityTags: ["capability:sales_pipeline"],
      },
      availableSpecialistIds: [...SALES_SPECIALIST_IDS],
    });

    expect(selections.length).toBeGreaterThanOrEqual(3);
    expect(selections.some((entry) => entry.specialistId === "proposal-quote-specialist")).toBe(
      true,
    );
  });

  it("may delegate to one specialist for simple follow-up status requests", async () => {
    const selector = new SalesSpecialistSelector();
    const selections = await selector.select({
      requestId: "req-simple",
      orgId: ORG,
      teamId: SALES_TEAM_ID,
      payload: {
        message: "How many follow-ups are pending?",
        capabilityTags: ["capability:sales_pipeline"],
      },
      availableSpecialistIds: [...SALES_SPECIALIST_IDS],
    });

    expect(selections).toHaveLength(1);
    expect(selections[0]!.specialistId).toBe("follow-up-specialist");
  });

  it("uses operations intelligence runtime context", () => {
    const oil = buildOperationsIntelligenceContextForOrg(ORG, { now: () => NOW });
    const runtimeContext = buildSalesTeamRuntimeContext({ operationsIntelligence: oil });

    expect(runtimeContext.teamId).toBe(SALES_TEAM_ID);
    expect(runtimeContext.organizationContextRef).toContain(`operations-intelligence:${ORG}`);
    expect(runtimeContext.consumedOperationsSections).toContain("profile");
    expect(runtimeContext.consumedOperationsSections).toContain("services");
  });

  it("generates customer-success-first recommendations", () => {
    const recommendations = generateSalesRecommendations({
      evidence: MOCK_OUTPUTS["lead.qualify"].evidence,
      message: "I need help converting leads",
    });

    expect(recommendations.length).toBeGreaterThan(0);
    expect(recommendations.every((entry) => entry.customerSuccessFirst)).toBe(true);
    expect(
      recommendations.every((entry) => !entry.summary.toLowerCase().includes("subscription")),
    ).toBe(true);
  });

  it("synthesizes a single team lead response without exposing delegation", async () => {
    const synthesizer = new SalesTeamSynthesizer();
    const result = await synthesizer.synthesize({
      request: {
        id: "req-1",
        orgId: ORG,
        teamId: SALES_TEAM_ID,
        teamLeadId: SALES_TEAM_LEAD_ID,
        source: "customer",
        payload: { message: "I need help converting leads" },
        receivedAt: NOW,
      },
      results: [
        {
          taskId: "task-1",
          specialistId: "sales-specialist",
          outcome: "complete",
          result: {
            summary: "Pipeline analysis shows qualified leads converting steadily.",
            confidence: { level: "high" },
          },
        },
      ],
      conflicts: [],
      now: NOW,
    });

    expect(result.summary).toContain("Pipeline analysis");
    expect(result.summary).not.toContain("sales-specialist");
    expect(result.summary).not.toContain("delegat");
  });

  it("orchestrates end-to-end team work with multi-agent default", async () => {
    const orchestrator = createSalesTeamOrchestrator({
      orgId: ORG,
      now: () => NOW,
    });

    const result = await orchestrator.orchestrate({
      request: {
        id: "req-e2e",
        orgId: ORG,
        teamId: SALES_TEAM_ID,
        teamLeadId: SALES_TEAM_LEAD_ID,
        source: "customer",
        payload: {
          message: "I need help converting leads",
          capabilityTags: ["capability:sales_pipeline"],
        },
        receivedAt: NOW,
      },
      sessionId: "session-e2e",
    });

    expect(result.outcome).toBe("complete");
    expect(result.synthesis.summary.length).toBeGreaterThan(0);
    expect(result.synthesis.contributingSpecialistIds.length).toBeGreaterThanOrEqual(2);
    expect(result.synthesis.summary).not.toContain("sales-specialist");
  });

  it("builds operational dashboard model with required cards", () => {
    const dashboard = buildSalesDashboardModel({
      teamId: SALES_TEAM_ID,
      now: NOW,
    });

    const cardIds = dashboard.cards.map((entry) => entry.id);
    expect(cardIds).toContain("new_leads");
    expect(cardIds).toContain("qualified_leads");
    expect(cardIds).toContain("follow_ups_due");
    expect(cardIds).toContain("proposals_sent");
    expect(cardIds).toContain("pipeline_status");
    expect(cardIds).toContain("conversion_rate");
    expect(cardIds).toContain("sales_recommendations");
    expect(cardIds).toContain("alerts");
  });
});

function buildExecutionInput(capabilityId: string) {
  const specialist: Specialist = {
    id: "sales-specialist",
    orgId: ORG,
    teamId: SALES_TEAM_ID,
    specialistDefinitionId: "sales-specialist",
    role: "specialist",
    permissions: {
      canDo: ["sales:write", "crm:write", "execute_task"],
      cannotDo: [],
    },
    status: "active",
  };

  const task: Task = {
    id: "task-1",
    orgId: ORG,
    teamId: SALES_TEAM_ID,
    specialistId: specialist.id,
    assignedByTeamLeadId: SALES_TEAM_LEAD_ID,
    status: "pending",
    permissions: specialist.permissions,
    context: { capabilityId, instruction: "Execute mock capability" },
    createdAt: NOW,
    updatedAt: NOW,
  };

  const capabilityRegistry = new InMemoryCapabilityRegistry();
  capabilityRegistry.register("sales-specialist", [
    { id: capabilityId, requiredPermission: "sales:write" },
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
      teamId: SALES_TEAM_ID,
      specialist,
      task,
      payload: { capabilityId },
    },
  };
}
