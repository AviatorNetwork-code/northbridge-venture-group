import { describe, expect, it, vi } from "vitest";
import {
  createSpecialistRuntime,
  InMemoryCapabilityRegistry,
  InMemoryProgressReporter,
  SpecialistRuntimeError,
  assertTransition,
  canTransition,
} from "../src/index.js";
import type {
  Specialist,
  Task,
} from "@northbridge/workforce-contracts";
import type {
  SpecialistMemoryAdapter,
  TaskExecutor,
} from "../src/index.js";

const NOW = "2026-07-09T20:00:00.000Z";

function buildSpecialist(overrides: Partial<Specialist> = {}): Specialist {
  return {
    id: "sp-1",
    orgId: "org-1",
    teamId: "team-1",
    specialistDefinitionId: "generic-specialist",
    role: "specialist",
    permissions: { canDo: ["execute_task"], cannotDo: [] },
    status: "active",
    ...overrides,
  };
}

function buildTask(overrides: Partial<Task> = {}): Task {
  return {
    id: "task-1",
    orgId: "org-1",
    teamId: "team-1",
    specialistId: "sp-1",
    assignedByTeamLeadId: "tl-1",
    status: "pending",
    permissions: { canDo: ["execute_task"], cannotDo: [] },
    context: { instruction: "complete work" },
    createdAt: NOW,
    updatedAt: NOW,
    ...overrides,
  };
}

function buildRegistry(): InMemoryCapabilityRegistry {
  const registry = new InMemoryCapabilityRegistry();
  registry.register("generic-specialist", [
    {
      id: "execute_task",
      requiredPermission: "execute_task",
      description: "Execute assigned task",
    },
  ]);
  return registry;
}

describe("specialist-runtime lifecycle", () => {
  it("runs full lifecycle to complete", async () => {
    const transitions: string[] = [];
    const executor: TaskExecutor = {
      execute: async () => ({
        summary: "Work completed",
        evidence: ["ev-1"],
        confidence: { level: "high", score: 0.95 },
      }),
    };

    const runtime = createSpecialistRuntime({
      capabilityRegistry: buildRegistry(),
      taskExecutor: executor,
      now: () => NOW,
      createSessionId: () => "session-1",
      lifecycle: {
        onTransition: (event) => {
          transitions.push(`${event.from}->${event.to}`);
        },
      },
    });

    const result = await runtime.runTask({
      task: buildTask(),
      specialist: buildSpecialist(),
    });

    expect(result.outcome).toBe("complete");
    if (result.outcome === "complete") {
      expect(result.result.summary).toBe("Work completed");
      expect(result.confidence.level).toBe("high");
    }
    expect(runtime.getState()).toBe("complete");
    expect(transitions).toContain("idle->task_assigned");
    expect(transitions).toContain("result_validated->complete");
  });

  it("rejects invalid state transitions", () => {
    expect(canTransition("idle", "executing")).toBe(false);
    expect(() => assertTransition("idle", "executing")).toThrow(
      SpecialistRuntimeError,
    );
  });

  it("fails when specialist is inactive", async () => {
    const runtime = createSpecialistRuntime({
      capabilityRegistry: buildRegistry(),
      taskExecutor: { execute: async () => ({ summary: "x", confidence: { level: "high" } }) },
      now: () => NOW,
    });

    const result = await runtime.runTask({
      task: buildTask(),
      specialist: buildSpecialist({ status: "suspended" }),
    });

    expect(result.outcome).toBe("failed");
    if (result.outcome === "failed") {
      expect(result.error.code).toBe("specialist_inactive");
    }
  });

  it("denies execution when permission is missing", async () => {
    const runtime = createSpecialistRuntime({
      capabilityRegistry: buildRegistry(),
      taskExecutor: { execute: async () => ({ summary: "x", confidence: { level: "high" } }) },
      now: () => NOW,
    });

    const result = await runtime.runTask({
      task: buildTask({
        permissions: { canDo: ["other_action"], cannotDo: [] },
      }),
      specialist: buildSpecialist(),
    });

    expect(result.outcome).toBe("failed");
    if (result.outcome === "failed") {
      expect(result.error.code).toBe("capability_denied");
    }
  });

  it("escalates when capability validation fails and target provided", async () => {
    const runtime = createSpecialistRuntime({
      capabilityRegistry: new InMemoryCapabilityRegistry(),
      taskExecutor: { execute: async () => ({ summary: "x", confidence: { level: "high" } }) },
      now: () => NOW,
    });

    const result = await runtime.runTask({
      task: buildTask(),
      specialist: buildSpecialist(),
      escalationTarget: { role: "team_lead", id: "tl-1" },
    });

    expect(result.outcome).toBe("escalated");
    if (result.outcome === "escalated") {
      expect(result.escalation.targetRole).toBe("team_lead");
      expect(result.escalation.reason).toContain("not registered");
    }
    expect(runtime.getState()).toBe("escalated");
  });

  it("escalates on low confidence when policy requires high", async () => {
    const runtime = createSpecialistRuntime({
      capabilityRegistry: buildRegistry(),
      taskExecutor: {
        execute: async () => ({
          summary: "Uncertain output",
          confidence: { level: "low", score: 0.2 },
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

    const result = await runtime.runTask({
      task: buildTask(),
      specialist: buildSpecialist(),
      escalationTarget: { role: "team_lead", id: "tl-1" },
    });

    expect(result.outcome).toBe("escalated");
  });

  it("reports progress and loads memory through adapters", async () => {
    const progress = new InMemoryProgressReporter();
    const memory: SpecialistMemoryAdapter = {
      load: vi.fn(async () => ({ priorTasks: 2 })),
    };
    const executor: TaskExecutor = {
      execute: async ({ context }) => ({
        summary: `Done with ${JSON.stringify(context.payload.memory)}`,
        confidence: { level: "medium" },
      }),
    };

    const runtime = createSpecialistRuntime({
      capabilityRegistry: buildRegistry(),
      taskExecutor: executor,
      memoryAdapter: memory,
      progressReporter: progress,
      now: () => NOW,
    });

    const result = await runtime.runTask({
      task: buildTask(),
      specialist: buildSpecialist(),
    });

    expect(memory.load).toHaveBeenCalled();
    expect(progress.events.some((event) => event.phase === "memory")).toBe(true);
    expect(result.outcome).toBe("complete");
  });

  it("prevents reset while session is in progress", async () => {
    let resolveExecution: (value: unknown) => void = () => {};
    const executor: TaskExecutor = {
      execute: () =>
        new Promise((resolve) => {
          resolveExecution = resolve;
        }).then(() => ({
          summary: "late",
          confidence: { level: "high" },
        })),
    };

    const runtime = createSpecialistRuntime({
      capabilityRegistry: buildRegistry(),
      taskExecutor: executor,
      now: () => NOW,
    });

    const pending = runtime.runTask({
      task: buildTask(),
      specialist: buildSpecialist(),
    });

    await vi.waitFor(() => {
      expect(runtime.getState()).toBe("executing");
    });

    expect(() => runtime.reset()).toThrow(SpecialistRuntimeError);
    resolveExecution(undefined);
    await pending;
    runtime.reset();
    expect(runtime.getState()).toBe("idle");
  });

  it("rejects concurrent task execution", async () => {
    const runtime = createSpecialistRuntime({
      capabilityRegistry: buildRegistry(),
      taskExecutor: {
        execute: () =>
          new Promise((resolve) =>
            setTimeout(
              () => resolve({ summary: "done", confidence: { level: "high" } }),
              50,
            ),
          ),
      },
      now: () => NOW,
    });

    const first = runtime.runTask({
      task: buildTask(),
      specialist: buildSpecialist(),
    });

    await vi.waitFor(() => {
      expect(runtime.getState()).not.toBe("idle");
    });

    const second = await runtime.runTask({
      task: buildTask({ id: "task-2" }),
      specialist: buildSpecialist(),
    });

    expect(second.outcome).toBe("failed");
    await first;
  });
});
