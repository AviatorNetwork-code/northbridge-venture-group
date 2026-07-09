import { describe, expect, it } from "vitest";
import type { Specialist } from "@northbridge/workforce-contracts";
import {
  createSpecialistRuntime,
  InMemoryCapabilityRegistry,
  type TaskExecutor,
} from "@northbridge/specialist-runtime";
import {
  createTeamOrchestrator,
  DefaultConflictDetector,
  DefaultExecutionPlanBuilder,
  DefaultTeamReportBuilder,
  DefaultTeamSynthesizer,
  InMemorySpecialistRoster,
  IsolatedSpecialistRuntimeFactory,
  PassthroughSpecialistSelector,
  SharedSpecialistRuntimeFactory,
} from "../src/index.js";

const NOW = "2026-07-09T22:00:00.000Z";

function specialist(id: string): Specialist {
  return {
    id,
    orgId: "org-1",
    teamId: "team-1",
    specialistDefinitionId: `def-${id}`,
    role: "specialist",
    permissions: { canDo: ["execute_task"], cannotDo: [] },
    status: "active",
  };
}

function buildCapabilityRegistry() {
  const registry = new InMemoryCapabilityRegistry();
  for (const id of ["sp-alpha", "sp-beta", "sp-gamma"]) {
    registry.register(`def-${id}`, [
      { id: "execute_task", requiredPermission: "execute_task" },
    ]);
  }
  return registry;
}

function buildOrchestrator(options: {
  specialists: Specialist[];
  executor: TaskExecutor;
  executionMode?: "sequential" | "parallel";
  escalateOnConflict?: boolean;
}) {
  const executionMode = options.executionMode ?? "sequential";
  const runtimeDeps = {
    capabilityRegistry: buildCapabilityRegistry(),
    taskExecutor: options.executor,
    now: () => NOW,
  };

  const runtimeFactory =
    executionMode === "parallel"
      ? new IsolatedSpecialistRuntimeFactory(runtimeDeps)
      : new SharedSpecialistRuntimeFactory(createSpecialistRuntime(runtimeDeps));

  return createTeamOrchestrator({
    roster: new InMemorySpecialistRoster(options.specialists),
    runtimeFactory,
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
    policy: {
      maxConcurrentDelegations: 8,
      delegationExecutionMode: executionMode,
      synthesizeOnPartialFailure: true,
      escalateOnConflict: options.escalateOnConflict ?? true,
      requireAllSpecialistsComplete: false,
      customerFacingViaTeamLeadOnly: true,
    },
    now: () => NOW,
    createSessionId: () => "multi-agent-session",
  });
}

const baseRequest = {
  id: "req-multi",
  orgId: "org-1",
  teamId: "team-1",
  teamLeadId: "tl-1",
  source: "customer" as const,
  payload: { topicKey: "delivery" },
  receivedAt: NOW,
};

describe("controlled multi-agent team execution", () => {
  it("delegates one request to multiple specialists without direct specialist-to-customer contact", async () => {
    const orchestrator = buildOrchestrator({
      specialists: [specialist("sp-alpha"), specialist("sp-beta"), specialist("sp-gamma")],
      executor: {
        execute: async ({ session }) => ({
          summary: `Internal result from ${session.specialist.id}`,
          confidence: { level: "high" },
        }),
      },
    });

    const result = await orchestrator.orchestrate({ request: baseRequest });

    expect(result.outcome).toBe("complete");
    if (result.outcome !== "complete") return;

    expect(result.session.delegations).toHaveLength(3);
    expect(result.session.results.filter((entry) => entry.outcome === "complete")).toHaveLength(3);
    expect(result.synthesis.contributingSpecialistIds).toEqual([
      "sp-alpha",
      "sp-beta",
      "sp-gamma",
    ]);
    expect(result.synthesis.summary).toContain("Internal result from sp-alpha");
    expect(result.synthesis.summary).toContain("Internal result from sp-beta");
    expect(result.owner.type).toBe("team");
  });

  it("executes specialists sequentially in plan order by default", async () => {
    const executionOrder: string[] = [];

    const orchestrator = buildOrchestrator({
      specialists: [specialist("sp-alpha"), specialist("sp-beta")],
      executionMode: "sequential",
      executor: {
        execute: async ({ session }) => {
          executionOrder.push(session.specialist.id);
          return {
            summary: `Ordered ${session.specialist.id}`,
            confidence: { level: "high" },
          };
        },
      },
    });

    await orchestrator.orchestrate({ request: baseRequest });

    expect(executionOrder).toEqual(["sp-alpha", "sp-beta"]);
  });

  it("executes specialists in parallel when configured", async () => {
    const started: string[] = [];
    const finished: string[] = [];

    const orchestrator = buildOrchestrator({
      specialists: [specialist("sp-alpha"), specialist("sp-beta"), specialist("sp-gamma")],
      executionMode: "parallel",
      executor: {
        execute: async ({ session }) => {
          started.push(session.specialist.id);
          await new Promise((resolve) => setTimeout(resolve, 20));
          finished.push(session.specialist.id);
          return {
            summary: `Parallel ${session.specialist.id}`,
            confidence: { level: "high" },
          };
        },
      },
    });

    await orchestrator.orchestrate({ request: baseRequest });

    expect(started).toHaveLength(3);
    expect(finished).toHaveLength(3);
    expect(started.filter((id) => id === "sp-alpha").length).toBe(1);
  });

  it("aggregates TaskResults into one Team Lead synthesis", async () => {
    const orchestrator = buildOrchestrator({
      specialists: [specialist("sp-alpha"), specialist("sp-beta")],
      executor: {
        execute: async ({ session }) => ({
          summary:
            session.specialist.id === "sp-alpha"
              ? "topic:delivery recommend increase capacity"
              : "topic:delivery capacity review complete",
          confidence: { level: "medium" },
          evidence: [`evidence-${session.specialist.id}`],
        }),
      },
    });

    const result = await orchestrator.orchestrate({ request: baseRequest });

    expect(result.outcome).toBe("complete");
    if (result.outcome !== "complete") return;

    expect(result.synthesis.evidence).toContain("evidence-sp-alpha");
    expect(result.synthesis.evidence).toContain("evidence-sp-beta");
    expect(result.synthesis.summary.split(" ").length).toBeGreaterThan(3);
    expect(result.report.summary).toBe(result.synthesis.summary);
  });

  it("detects conflicts when specialists disagree on the same topic", async () => {
    const orchestrator = buildOrchestrator({
      specialists: [specialist("sp-alpha"), specialist("sp-beta")],
      executor: {
        execute: async ({ session }) => ({
          summary:
            session.specialist.id === "sp-alpha"
              ? "topic:delivery recommend increase capacity"
              : "topic:delivery recommend decrease capacity",
          confidence: { level: "high" },
        }),
      },
    });

    const result = await orchestrator.orchestrate({ request: baseRequest });

    expect(result.outcome).toBe("escalated");
    if (result.outcome !== "escalated") return;

    expect(result.session.conflicts).toHaveLength(1);
    expect(result.session.conflicts[0]?.topicKey).toBe("delivery");
    expect(result.escalation.target).toBe("nordi");
    expect(result.escalation.reason).toContain("Conflicting specialist recommendations");
  });

  it("escalates instead of synthesizing when specialists disagree and policy requires it", async () => {
    const orchestrator = buildOrchestrator({
      specialists: [specialist("sp-alpha"), specialist("sp-beta")],
      escalateOnConflict: true,
      executor: {
        execute: async ({ session }) => ({
          summary:
            session.specialist.id === "sp-alpha"
              ? "topic:budget recommend approve spend"
              : "topic:budget recommend deny spend",
          confidence: { level: "high" },
        }),
      },
    });

    const result = await orchestrator.orchestrate({
      request: { ...baseRequest, payload: { topicKey: "budget" } },
    });

    expect(result.outcome).toBe("escalated");
    if (result.outcome === "escalated") {
      expect(result.session.synthesis).toBeUndefined();
    }
  });

  it("synthesizes one final team response when specialists agree", async () => {
    const orchestrator = buildOrchestrator({
      specialists: [specialist("sp-alpha"), specialist("sp-beta")],
      escalateOnConflict: false,
      executor: {
        execute: async () => ({
          summary: "topic:delivery recommend increase capacity",
          confidence: { level: "high" },
        }),
      },
    });

    const result = await orchestrator.orchestrate({ request: baseRequest });

    expect(result.outcome).toBe("complete");
    if (result.outcome !== "complete") return;

    expect(result.synthesis.summary).toContain("recommend increase capacity");
    expect(result.session.state).toBe("complete");
    expect(result.owner.id).toBe("team-1");
  });
});
