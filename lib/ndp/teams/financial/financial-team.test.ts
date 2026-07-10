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
  FINANCIAL_EXECUTION_CAPABILITIES,
  FINANCIAL_SPECIALIST_IDS,
  FINANCIAL_TEAM_ID,
  FINANCIAL_TEAM_LEAD_ID,
  assembleFinancialEmployeeRuntime,
  buildFinancialDashboardModel,
  buildFinancialSpecialistRoster,
  buildFinancialTeamRuntimeContext,
  createFinancialMockConnectorRegistry,
  createFinancialTeamOrchestrator,
  generateFinancialRecommendations,
  FinancialSpecialistSelector,
  FinancialTeamSynthesizer,
  MOCK_OUTPUTS,
  getProductionPromptForEmployee,
  renderKnowledgePackText,
} from "@/lib/ndp/teams/financial";
import { listEmployeeManifestsByTeam } from "@/lib/ndp/workforce/manifests";

const ORG = "org-acme";
const NOW = "2026-07-09T22:00:00.000Z";

describe("Financial Team Alpha", () => {
  it("defines four financial specialists", () => {
    expect(FINANCIAL_SPECIALIST_IDS).toHaveLength(4);
    expect(FINANCIAL_TEAM_LEAD_ID).toBe("lead-team-financial");
  });

  it("registers six mock execution capabilities", () => {
    expect(FINANCIAL_EXECUTION_CAPABILITIES).toHaveLength(6);
    expect(Object.keys(MOCK_OUTPUTS)).toHaveLength(6);
  });

  it("builds specialist roster from manifests", () => {
    const roster = buildFinancialSpecialistRoster(ORG);
    expect(roster).toHaveLength(4);
    expect(roster.every((entry) => entry.teamId === FINANCIAL_TEAM_ID)).toBe(true);
  });

  it("assembles employee runtime with OIL context references", () => {
    const manifests = listEmployeeManifestsByTeam(FINANCIAL_TEAM_ID);
    expect(manifests.length).toBeGreaterThan(0);

    for (const manifest of manifests) {
      const assembly = assembleFinancialEmployeeRuntime(manifest, { organizationId: ORG });
      expect(assembly.knowledgePlan.resolvedPacks.length).toBeGreaterThan(0);
      expect(assembly.promptAssemblyPlan.templateId).toBe("prompt-template-financial-specialist");
      expect(assembly.organizationContextRef).toContain(`operations-intelligence:${ORG}`);
    }
  });

  it("provides production prompt templates for all financial employees", () => {
    const manifests = listEmployeeManifestsByTeam(FINANCIAL_TEAM_ID);
    for (const manifest of manifests) {
      const prompt = getProductionPromptForEmployee(manifest.employeeId);
      expect(prompt).toBeDefined();
      expect(prompt!.version).toBe("1.0.0");
    }
  });

  it("renders modular financial knowledge pack content", () => {
    const text = renderKnowledgePackText("knowledge-pack-billing-fundamentals");
    expect(text).toContain("Invoicing Basics");
    expect(text).not.toMatch(/org-acme|customer-specific/i);
  });

  it("executes mock connector capabilities", async () => {
    const registry = createFinancialMockConnectorRegistry(() => NOW);
    const router = createCapabilityToolRouter(
      createConnectorRouter({ registry, now: () => NOW }),
    );
    const executor = createCapabilityRoutedTaskExecutor({ router, now: () => NOW });

    for (const capability of FINANCIAL_EXECUTION_CAPABILITIES) {
      const result = await executor.execute(buildExecutionInput(capability.id));
      expect(result.summary.length).toBeGreaterThan(0);
      expect(result.confidence.level).toBe("high");
    }
  });

  it("delegates to multiple specialists for broad financial requests", async () => {
    const selector = new FinancialSpecialistSelector();
    const selections = await selector.select({
      requestId: "req-broad",
      orgId: ORG,
      teamId: FINANCIAL_TEAM_ID,
      payload: {
        message: "I need help with our finances.",
        capabilityTags: ["capability:finance"],
      },
      availableSpecialistIds: [...FINANCIAL_SPECIALIST_IDS],
    });

    expect(selections.length).toBeGreaterThanOrEqual(2);
    expect(selections.some((entry) => entry.specialistId === "financial-specialist")).toBe(true);
    expect(selections.some((entry) => entry.specialistId === "billing-specialist")).toBe(true);
  });

  it("delegates to multiple specialists for overdue invoice requests", async () => {
    const selector = new FinancialSpecialistSelector();
    const selections = await selector.select({
      requestId: "req-receivables",
      orgId: ORG,
      teamId: FINANCIAL_TEAM_ID,
      payload: {
        message: "We have overdue invoices that need attention.",
        capabilityTags: ["capability:finance"],
      },
      availableSpecialistIds: [...FINANCIAL_SPECIALIST_IDS],
    });

    expect(selections.length).toBeGreaterThanOrEqual(2);
    expect(
      selections.some((entry) => entry.specialistId === "accounts-receivable-specialist"),
    ).toBe(true);
  });

  it("may delegate to one specialist for simple financial report status requests", async () => {
    const selector = new FinancialSpecialistSelector();
    const selections = await selector.select({
      requestId: "req-simple",
      orgId: ORG,
      teamId: FINANCIAL_TEAM_ID,
      payload: {
        message: "What is the status of our financial report?",
        capabilityTags: ["capability:finance"],
      },
      availableSpecialistIds: [...FINANCIAL_SPECIALIST_IDS],
    });

    expect(selections).toHaveLength(1);
    expect(selections[0]!.specialistId).toBe("financial-reporting-specialist");
  });

  it("uses operations intelligence runtime context", () => {
    const oil = buildOperationsIntelligenceContextForOrg(ORG, { now: () => NOW });
    const runtimeContext = buildFinancialTeamRuntimeContext({ operationsIntelligence: oil });

    expect(runtimeContext.teamId).toBe(FINANCIAL_TEAM_ID);
    expect(runtimeContext.organizationContextRef).toContain(`operations-intelligence:${ORG}`);
    expect(runtimeContext.consumedOperationsSections).toContain("profile");
    expect(runtimeContext.consumedOperationsSections).toContain("services");
  });

  it("generates customer-success-first recommendations", () => {
    const recommendations = generateFinancialRecommendations({
      evidence: MOCK_OUTPUTS["finance.analyze"].evidence,
      message: "I need help with our finances",
    });

    expect(recommendations.length).toBeGreaterThan(0);
    expect(recommendations.every((entry) => entry.customerSuccessFirst)).toBe(true);
    expect(
      recommendations.every((entry) => !entry.summary.toLowerCase().includes("subscription")),
    ).toBe(true);
  });

  it("synthesizes a single team lead response without exposing delegation", async () => {
    const synthesizer = new FinancialTeamSynthesizer();
    const result = await synthesizer.synthesize({
      request: {
        id: "req-1",
        orgId: ORG,
        teamId: FINANCIAL_TEAM_ID,
        teamLeadId: FINANCIAL_TEAM_LEAD_ID,
        source: "customer",
        payload: { message: "I need help with our finances" },
        receivedAt: NOW,
      },
      results: [
        {
          taskId: "task-1",
          specialistId: "financial-specialist",
          outcome: "complete",
          result: {
            summary: "Financial analysis shows revenue trending up with stable margins.",
            confidence: { level: "high" },
          },
        },
      ],
      conflicts: [],
      now: NOW,
    });

    expect(result.summary).toContain("Financial analysis");
    expect(result.summary).not.toContain("financial-specialist");
    expect(result.summary).not.toContain("delegat");
  });

  it("orchestrates end-to-end team work with multi-agent default", async () => {
    const orchestrator = createFinancialTeamOrchestrator({
      orgId: ORG,
      now: () => NOW,
    });

    const result = await orchestrator.orchestrate({
      request: {
        id: "req-e2e",
        orgId: ORG,
        teamId: FINANCIAL_TEAM_ID,
        teamLeadId: FINANCIAL_TEAM_LEAD_ID,
        source: "customer",
        payload: {
          message: "I need help with our finances",
          capabilityTags: ["capability:finance"],
        },
        receivedAt: NOW,
      },
      sessionId: "session-e2e",
    });

    expect(result.outcome).toBe("complete");
    expect(result.synthesis.summary.length).toBeGreaterThan(0);
    expect(result.synthesis.contributingSpecialistIds.length).toBeGreaterThanOrEqual(2);
    expect(result.synthesis.summary).not.toContain("financial-specialist");
  });

  it("builds operational dashboard model with required cards", () => {
    const dashboard = buildFinancialDashboardModel({
      teamId: FINANCIAL_TEAM_ID,
      now: NOW,
    });

    const cardIds = dashboard.cards.map((entry) => entry.id);
    expect(cardIds).toContain("revenue_snapshot");
    expect(cardIds).toContain("outstanding_invoices");
    expect(cardIds).toContain("accounts_receivable");
    expect(cardIds).toContain("cash_flow_signals");
    expect(cardIds).toContain("billing_activity");
    expect(cardIds).toContain("payment_followups");
    expect(cardIds).toContain("financial_recommendations");
    expect(cardIds).toContain("alerts");
  });
});

function buildExecutionInput(capabilityId: string) {
  const capability = FINANCIAL_EXECUTION_CAPABILITIES.find(
    (entry) => entry.id === capabilityId,
  )!;
  const requiredPermission = capability.requiredPermission ?? "execute_task";

  const specialist: Specialist = {
    id: "financial-specialist",
    orgId: ORG,
    teamId: FINANCIAL_TEAM_ID,
    specialistDefinitionId: "financial-specialist",
    role: "specialist",
    permissions: {
      canDo: ["finance:read", "finance:write", "analytics:read", "execute_task"],
      cannotDo: [],
    },
    status: "active",
  };

  const task: Task = {
    id: "task-1",
    orgId: ORG,
    teamId: FINANCIAL_TEAM_ID,
    specialistId: specialist.id,
    assignedByTeamLeadId: FINANCIAL_TEAM_LEAD_ID,
    status: "pending",
    permissions: specialist.permissions,
    context: { capabilityId, instruction: "Execute mock capability" },
    createdAt: NOW,
    updatedAt: NOW,
  };

  const capabilityRegistry = new InMemoryCapabilityRegistry();
  capabilityRegistry.register("financial-specialist", [
    { id: capabilityId, requiredPermission },
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
      teamId: FINANCIAL_TEAM_ID,
      specialist,
      task,
      payload: { capabilityId },
    },
  };
}
