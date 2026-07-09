import { describe, expect, it, vi } from "vitest";
import type { Specialist, Task } from "@northbridge/workforce-contracts";
import {
  createSpecialistRuntime,
  InMemoryCapabilityRegistry,
  type TaskExecutor,
} from "@northbridge/specialist-runtime";
import {
  assertSingleOwner,
  assignTeamRequestOwner,
  createTeamOrchestrator,
  DefaultConflictDetector,
  DefaultExecutionPlanBuilder,
  DefaultTeamReportBuilder,
  DefaultTeamSynthesizer,
  InMemorySpecialistRoster,
  InMemoryTeamProgressReporter,
  PassthroughSpecialistSelector,
  SharedSpecialistRuntimeFactory,
  TeamOrchestratorError,
  assertTeamTransition,
} from "../src/index.js";

const NOW = "2026-07-09T21:00:00.000Z";

function specialist(
  id: string,
  overrides: Partial<Specialist> = {},
): Specialist {
  return {
    id,
    orgId: "org-1",
    teamId: "team-1",
    specialistDefinitionId: `def-${id}`,
    role: "specialist",
    permissions: { canDo: ["execute_task"], cannotDo: [] },
    status: "active",
    ...overrides,
  };
}

function buildRuntime(executor: TaskExecutor) {
  const registry = new InMemoryCapabilityRegistry();
  registry.register("def-sp-1", [
    { id: "execute_task", requiredPermission: "execute_task" },
  ]);
  registry.register("def-sp-2", [
    { id: "execute_task", requiredPermission: "execute_task" },
  ]);
  return createSpecialistRuntime({
    capabilityRegistry: registry,
    taskExecutor: executor,
    now: () => NOW,
  });
}

function buildOrchestrator(options: {
  specialists: Specialist[];
  executor: TaskExecutor;
  selector?: ReturnType<typeof PassthroughSpecialistSelector.prototype.select>;
  policy?: Partial<import("../src/types/policy.js").TeamLeadPolicy>;
}) {
  const runtime = buildRuntime(options.executor);
  return createTeamOrchestrator({
    roster: new InMemorySpecialistRoster(options.specialists),
    runtimeFactory: new SharedSpecialistRuntimeFactory(runtime),
    specialistSelector: new PassthroughSpecialistSelector(
      options.specialists.map((entry) => ({
        specialistId: entry.id,
        specialistDefinitionId: entry.specialistDefinitionId,
        capabilityId: "execute_task",
      })),
    ),
    planBuilder: new DefaultExecutionPlanBuilder(),
    synthesizer: new DefaultTeamSynthesizer(),
    reportBuilder: new DefaultTeamReportBuilder(),
    conflictDetector: new DefaultConflictDetector(),
    progressReporter: new InMemoryTeamProgressReporter(),
    policy: {
      maxConcurrentDelegations: 8,
      delegationExecutionMode: "sequential",
      synthesizeOnPartialFailure: true,
      escalateOnConflict: true,
      requireAllSpecialistsComplete: false,
      customerFacingViaTeamLeadOnly: true,
      ...options.policy,
    },
    now: () => NOW,
    createSessionId: () => "team-session-1",
  });
}

describe("team-orchestrator", () => {
  it("assigns single team owner", () => {
    const owner = assignTeamRequestOwner("org-1", "team-1");
    expect(owner.type).toBe("team");
    expect(owner.id).toBe("team-1");
    assertSingleOwner(null, owner);
    expect(() =>
      assertSingleOwner(assignTeamRequestOwner("org-1", "team-2"), owner),
    ).toThrow(TeamOrchestratorError);
  });

  it("runs full lifecycle with one specialist", async () => {
    const orchestrator = buildOrchestrator({
      specialists: [specialist("sp-1")],
      executor: {
        execute: async () => ({
          summary: "Generic specialist work complete",
          confidence: { level: "high" },
          evidence: ["ev-1"],
        }),
      },
    });

    const result = await orchestrator.orchestrate({
      request: {
        id: "req-1",
        orgId: "org-1",
        teamId: "team-1",
        teamLeadId: "tl-1",
        source: "customer",
        payload: { action: "process" },
        receivedAt: NOW,
      },
    });

    expect(result.outcome).toBe("complete");
    if (result.outcome === "complete") {
      expect(result.owner.type).toBe("team");
      expect(result.synthesis.contributingSpecialistIds).toEqual(["sp-1"]);
      expect(result.report.summary).toContain("Generic specialist work complete");
    }
    expect(orchestrator.getSession()?.state).toBe("complete");
  });

  it("delegates to multiple specialists and synthesizes", async () => {
    const orchestrator = buildOrchestrator({
      specialists: [specialist("sp-1"), specialist("sp-2")],
      executor: {
        execute: async ({ session }) => ({
          summary: `Output from ${session.specialist.id}`,
          confidence: { level: "medium" },
        }),
      },
    });

    const result = await orchestrator.orchestrate({
      request: {
        id: "req-2",
        orgId: "org-1",
        teamId: "team-1",
        teamLeadId: "tl-1",
        source: "connector",
        payload: {},
        receivedAt: NOW,
      },
    });

    expect(result.outcome).toBe("complete");
    if (result.outcome === "complete") {
      expect(result.synthesis.contributingSpecialistIds).toHaveLength(2);
    }
  });

  it("escalates on conflict detection", async () => {
    const orchestrator = buildOrchestrator({
      specialists: [specialist("sp-1"), specialist("sp-2")],
      executor: {
        execute: async ({ session }) => ({
          summary:
            session.specialist.id === "sp-1"
              ? "topic:spend recommend increase budget"
              : "topic:spend recommend decrease budget",
          confidence: { level: "high" },
        }),
      },
    });

    const result = await orchestrator.orchestrate({
      request: {
        id: "req-3",
        orgId: "org-1",
        teamId: "team-1",
        teamLeadId: "tl-1",
        source: "customer",
        payload: { topicKey: "spend" },
        receivedAt: NOW,
      },
    });

    expect(result.outcome).toBe("escalated");
    if (result.outcome === "escalated") {
      expect(result.escalation.target).toBe("nordi");
    }
  });

  it("handles specialist escalation from runtime", async () => {
    const runtime = createSpecialistRuntime({
      capabilityRegistry: (() => {
        const registry = new InMemoryCapabilityRegistry();
        registry.register("def-sp-1", [
          { id: "execute_task", requiredPermission: "execute_task" },
        ]);
        return registry;
      })(),
      taskExecutor: {
        execute: async () => ({
          summary: "Uncertain",
          confidence: { level: "low", score: 0.1 },
        }),
      },
      policy: {
        requiredCapabilityId: "execute_task",
        minimumConfidence: "high",
        requireActiveSpecialist: true,
        loadMemory: false,
        loadConversationContext: false,
      },
      now: () => NOW,
    });

    const orchestrator = createTeamOrchestrator({
      roster: new InMemorySpecialistRoster([specialist("sp-1")]),
      runtimeFactory: new SharedSpecialistRuntimeFactory(runtime),
      specialistSelector: new PassthroughSpecialistSelector([
        {
          specialistId: "sp-1",
          specialistDefinitionId: "def-sp-1",
          capabilityId: "execute_task",
        },
      ]),
      planBuilder: new DefaultExecutionPlanBuilder(),
      synthesizer: new DefaultTeamSynthesizer(),
      reportBuilder: new DefaultTeamReportBuilder(),
      conflictDetector: new DefaultConflictDetector(),
      policy: {
        maxConcurrentDelegations: 8,
        delegationExecutionMode: "sequential",
        synthesizeOnPartialFailure: false,
        escalateOnConflict: false,
        requireAllSpecialistsComplete: true,
        customerFacingViaTeamLeadOnly: true,
      },
      now: () => NOW,
    });

    const result = await orchestrator.orchestrate({
      request: {
        id: "req-4",
        orgId: "org-1",
        teamId: "team-1",
        teamLeadId: "tl-1",
        source: "customer",
        payload: {},
        receivedAt: NOW,
      },
    });

    expect(result.outcome).toBe("escalated");
    if (result.outcome === "escalated") {
      expect(result.escalation.target).toBe("team_lead_review");
    }
  });

  it("records failed delegation when capability permission missing", async () => {
    const orchestrator = buildOrchestrator({
      specialists: [
        specialist("sp-1", {
          permissions: { canDo: ["other_action"], cannotDo: [] },
        }),
      ],
      executor: {
        execute: async () => ({
          summary: "Should not run",
          confidence: { level: "high" },
        }),
      },
    });

    const result = await orchestrator.orchestrate({
      request: {
        id: "req-5",
        orgId: "org-1",
        teamId: "team-1",
        teamLeadId: "tl-1",
        source: "customer",
        payload: {},
        receivedAt: NOW,
      },
    });

    expect(result.outcome).toBe("complete");
    if (result.outcome === "complete") {
      expect(result.synthesis.summary).not.toContain("Should not run");
    }
  });

  it("rejects invalid lifecycle transitions", () => {
    expect(() => assertTeamTransition("received", "complete")).toThrow(
      TeamOrchestratorError,
    );
  });

  it("rejects concurrent orchestration", async () => {
    const orchestrator = buildOrchestrator({
      specialists: [specialist("sp-1")],
      executor: {
        execute: () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  summary: "delayed",
                  confidence: { level: "high" },
                }),
              40,
            ),
          ),
      },
    });

    const first = orchestrator.orchestrate({
      request: {
        id: "req-6a",
        orgId: "org-1",
        teamId: "team-1",
        teamLeadId: "tl-1",
        source: "customer",
        payload: {},
        receivedAt: NOW,
      },
    });

    await vi.waitFor(() => {
      expect(orchestrator.getSession()?.state).not.toBe("idle");
    });

    const second = await orchestrator.orchestrate({
      request: {
        id: "req-6b",
        orgId: "org-1",
        teamId: "team-1",
        teamLeadId: "tl-1",
        source: "customer",
        payload: {},
        receivedAt: NOW,
      },
    });

    expect(second.outcome).toBe("failed");
    if (second.outcome === "failed") {
      expect(second.error.code).toBe("concurrent_request");
    }
    await first;
  });

  it("generates team report from synthesis", async () => {
    const orchestrator = buildOrchestrator({
      specialists: [specialist("sp-1")],
      executor: {
        execute: async () => ({
          summary: "Reportable output",
          confidence: { level: "high" },
        }),
      },
    });

    const result = await orchestrator.orchestrate({
      request: {
        id: "req-7",
        orgId: "org-1",
        teamId: "team-1",
        teamLeadId: "tl-1",
        source: "scheduled",
        payload: {},
        receivedAt: NOW,
      },
      reportId: "report-req-7",
    });

    expect(result.outcome).toBe("complete");
    if (result.outcome === "complete") {
      expect(result.report.id).toBe("report-req-7");
      expect(result.report.teamLeadId).toBe("tl-1");
    }
  });
});
