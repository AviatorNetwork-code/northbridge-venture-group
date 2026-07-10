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
  CUSTOMER_SERVICE_EXECUTION_CAPABILITIES,
  CUSTOMER_SERVICE_SPECIALIST_IDS,
  CUSTOMER_SERVICE_TEAM_ID,
  CUSTOMER_SERVICE_TEAM_LEAD_ID,
  assembleCustomerServiceEmployeeRuntime,
  buildCustomerServiceDashboardModel,
  buildCustomerServiceSpecialistRoster,
  buildCustomerServiceTeamRuntimeContext,
  createCustomerServiceMockConnectorRegistry,
  createCustomerServiceTeamOrchestrator,
  generateCustomerServiceRecommendations,
  CustomerServiceSpecialistSelector,
  CustomerServiceTeamSynthesizer,
  MOCK_OUTPUTS,
  getProductionPromptForEmployee,
  renderKnowledgePackText,
} from "@/lib/ndp/teams/customer-service";
import { listEmployeeManifestsByTeam } from "@/lib/ndp/workforce/manifests";

const ORG = "org-acme";
const NOW = "2026-07-09T22:00:00.000Z";

describe("Customer Service Team Alpha", () => {
  it("defines five customer service specialists", () => {
    expect(CUSTOMER_SERVICE_SPECIALIST_IDS).toHaveLength(5);
    expect(CUSTOMER_SERVICE_TEAM_LEAD_ID).toBe("lead-team-customer-service");
  });

  it("registers six mock execution capabilities", () => {
    expect(CUSTOMER_SERVICE_EXECUTION_CAPABILITIES).toHaveLength(6);
    expect(Object.keys(MOCK_OUTPUTS)).toHaveLength(6);
  });

  it("builds specialist roster from manifests", () => {
    const roster = buildCustomerServiceSpecialistRoster(ORG);
    expect(roster).toHaveLength(5);
    expect(roster.every((entry) => entry.teamId === CUSTOMER_SERVICE_TEAM_ID)).toBe(true);
  });

  it("assembles employee runtime with OIL context references", () => {
    const manifests = listEmployeeManifestsByTeam(CUSTOMER_SERVICE_TEAM_ID);
    expect(manifests.length).toBeGreaterThan(0);

    for (const manifest of manifests) {
      const assembly = assembleCustomerServiceEmployeeRuntime(manifest, { organizationId: ORG });
      expect(assembly.knowledgePlan.resolvedPacks.length).toBeGreaterThan(0);
      expect(assembly.promptAssemblyPlan.templateId).toBe(
        "prompt-template-customer-service-specialist",
      );
      expect(assembly.organizationContextRef).toContain(`operations-intelligence:${ORG}`);
    }
  });

  it("provides production prompt templates for all customer service employees", () => {
    const manifests = listEmployeeManifestsByTeam(CUSTOMER_SERVICE_TEAM_ID);
    for (const manifest of manifests) {
      const prompt = getProductionPromptForEmployee(manifest.employeeId);
      expect(prompt).toBeDefined();
      expect(prompt!.version).toBe("1.0.0");
    }
  });

  it("renders modular customer service knowledge pack content", () => {
    const text = renderKnowledgePackText("knowledge-pack-reception-fundamentals");
    expect(text).toContain("Inbound Triage");
    expect(text).not.toMatch(/org-acme|customer-specific/i);
  });

  it("executes mock connector capabilities", async () => {
    const registry = createCustomerServiceMockConnectorRegistry(() => NOW);
    const router = createCapabilityToolRouter(
      createConnectorRouter({ registry, now: () => NOW }),
    );
    const executor = createCapabilityRoutedTaskExecutor({ router, now: () => NOW });

    for (const capability of CUSTOMER_SERVICE_EXECUTION_CAPABILITIES) {
      const result = await executor.execute(buildExecutionInput(capability.id));
      expect(result.summary.length).toBeGreaterThan(0);
      expect(result.confidence.level).toBe("high");
    }
  });

  it("delegates to multiple specialists for broad customer service requests", async () => {
    const selector = new CustomerServiceSpecialistSelector();
    const selections = await selector.select({
      requestId: "req-broad",
      orgId: ORG,
      teamId: CUSTOMER_SERVICE_TEAM_ID,
      payload: {
        message: "I need help with customer inquiries.",
        capabilityTags: ["capability:customer_service"],
      },
      availableSpecialistIds: [...CUSTOMER_SERVICE_SPECIALIST_IDS],
    });

    expect(selections.length).toBeGreaterThanOrEqual(2);
    expect(
      selections.some((entry) => entry.specialistId === "customer-service-specialist"),
    ).toBe(true);
    expect(selections.some((entry) => entry.specialistId === "reception-specialist")).toBe(
      true,
    );
  });

  it("delegates to multiple specialists for scheduling requests", async () => {
    const selector = new CustomerServiceSpecialistSelector();
    const selections = await selector.select({
      requestId: "req-schedule",
      orgId: ORG,
      teamId: CUSTOMER_SERVICE_TEAM_ID,
      payload: {
        message: "I need to schedule an appointment.",
        capabilityTags: ["capability:scheduling"],
      },
      availableSpecialistIds: [...CUSTOMER_SERVICE_SPECIALIST_IDS],
    });

    expect(selections.length).toBeGreaterThanOrEqual(2);
    expect(selections.some((entry) => entry.specialistId === "appointment-specialist")).toBe(
      true,
    );
  });

  it("may delegate to one specialist for simple reminder status requests", async () => {
    const selector = new CustomerServiceSpecialistSelector();
    const selections = await selector.select({
      requestId: "req-simple",
      orgId: ORG,
      teamId: CUSTOMER_SERVICE_TEAM_ID,
      payload: {
        message: "How many reminders are pending?",
        capabilityTags: ["capability:scheduling"],
      },
      availableSpecialistIds: [...CUSTOMER_SERVICE_SPECIALIST_IDS],
    });

    expect(selections).toHaveLength(1);
    expect(selections[0]!.specialistId).toBe("reminder-specialist");
  });

  it("uses operations intelligence runtime context", () => {
    const oil = buildOperationsIntelligenceContextForOrg(ORG, { now: () => NOW });
    const runtimeContext = buildCustomerServiceTeamRuntimeContext({
      operationsIntelligence: oil,
    });

    expect(runtimeContext.teamId).toBe(CUSTOMER_SERVICE_TEAM_ID);
    expect(runtimeContext.organizationContextRef).toContain(`operations-intelligence:${ORG}`);
    expect(runtimeContext.consumedOperationsSections).toContain("profile");
    expect(runtimeContext.consumedOperationsSections).toContain("policies");
  });

  it("generates customer-success-first recommendations", () => {
    const recommendations = generateCustomerServiceRecommendations({
      evidence: MOCK_OUTPUTS["customer.answer"].evidence,
      message: "I need help with customer inquiries",
    });

    expect(recommendations.length).toBeGreaterThan(0);
    expect(recommendations.every((entry) => entry.customerSuccessFirst)).toBe(true);
    expect(
      recommendations.every((entry) => !entry.summary.toLowerCase().includes("subscription")),
    ).toBe(true);
  });

  it("synthesizes a single team lead response without exposing delegation", async () => {
    const synthesizer = new CustomerServiceTeamSynthesizer();
    const result = await synthesizer.synthesize({
      request: {
        id: "req-1",
        orgId: ORG,
        teamId: CUSTOMER_SERVICE_TEAM_ID,
        teamLeadId: CUSTOMER_SERVICE_TEAM_LEAD_ID,
        source: "customer",
        payload: { message: "I need help with customer inquiries" },
        receivedAt: NOW,
      },
      results: [
        {
          taskId: "task-1",
          specialistId: "customer-service-specialist",
          outcome: "complete",
          result: {
            summary: "Open inquiries reviewed with priority triage recommendations.",
            confidence: { level: "high" },
          },
        },
      ],
      conflicts: [],
      now: NOW,
    });

    expect(result.summary).toContain("Open inquiries");
    expect(result.summary).not.toContain("customer-service-specialist");
    expect(result.summary).not.toContain("delegat");
  });

  it("orchestrates end-to-end team work with multi-agent default", async () => {
    const orchestrator = createCustomerServiceTeamOrchestrator({
      orgId: ORG,
      now: () => NOW,
    });

    const result = await orchestrator.orchestrate({
      request: {
        id: "req-e2e",
        orgId: ORG,
        teamId: CUSTOMER_SERVICE_TEAM_ID,
        teamLeadId: CUSTOMER_SERVICE_TEAM_LEAD_ID,
        source: "customer",
        payload: {
          message: "I need help with customer inquiries",
          capabilityTags: ["capability:customer_service"],
        },
        receivedAt: NOW,
      },
      sessionId: "session-e2e",
    });

    expect(result.outcome).toBe("complete");
    expect(result.synthesis.summary.length).toBeGreaterThan(0);
    expect(result.synthesis.contributingSpecialistIds.length).toBeGreaterThanOrEqual(2);
    expect(result.synthesis.summary).not.toContain("customer-service-specialist");
  });

  it("builds operational dashboard model with required cards", () => {
    const dashboard = buildCustomerServiceDashboardModel({
      teamId: CUSTOMER_SERVICE_TEAM_ID,
      now: NOW,
    });

    const cardIds = dashboard.cards.map((entry) => entry.id);
    expect(cardIds).toContain("open_inquiries");
    expect(cardIds).toContain("response_time");
    expect(cardIds).toContain("appointments_requested");
    expect(cardIds).toContain("reminders_due");
    expect(cardIds).toContain("customer_satisfaction");
    expect(cardIds).toContain("escalations");
    expect(cardIds).toContain("recommendations");
    expect(cardIds).toContain("alerts");
  });
});

function buildExecutionInput(capabilityId: string) {
  const capability = CUSTOMER_SERVICE_EXECUTION_CAPABILITIES.find(
    (entry) => entry.id === capabilityId,
  )!;
  const requiredPermission = capability.requiredPermission ?? "execute_task";

  const specialist: Specialist = {
    id: "customer-service-specialist",
    orgId: ORG,
    teamId: CUSTOMER_SERVICE_TEAM_ID,
    specialistDefinitionId: "customer-service-specialist",
    role: "specialist",
    permissions: {
      canDo: ["messaging:send", "scheduling:write", "crm:write", "execute_task"],
      cannotDo: [],
    },
    status: "active",
  };

  const task: Task = {
    id: "task-1",
    orgId: ORG,
    teamId: CUSTOMER_SERVICE_TEAM_ID,
    specialistId: specialist.id,
    assignedByTeamLeadId: CUSTOMER_SERVICE_TEAM_LEAD_ID,
    status: "pending",
    permissions: specialist.permissions,
    context: { capabilityId, instruction: "Execute mock capability" },
    createdAt: NOW,
    updatedAt: NOW,
  };

  const capabilityRegistry = new InMemoryCapabilityRegistry();
  capabilityRegistry.register("customer-service-specialist", [
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
      teamId: CUSTOMER_SERVICE_TEAM_ID,
      specialist,
      task,
      payload: { capabilityId },
    },
  };
}
