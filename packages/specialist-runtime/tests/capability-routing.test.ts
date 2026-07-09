import { describe, expect, it } from "vitest";
import type { Specialist, Task } from "@northbridge/workforce-contracts";
import {
  createConnectorRouter,
  InMemoryConnectorRegistry,
  type Connector,
  type ConnectorDefinition,
} from "@northbridge/workforce-connectors";
import {
  createCapabilityRoutedTaskExecutor,
  createCapabilityToolRouter,
  createSpecialistRuntime,
  InMemoryCapabilityRegistry,
  type TaskExecutionInput,
} from "../src/index.js";

const NOW = "2026-07-09T20:00:00.000Z";

function buildSpecialist(): Specialist {
  return {
    id: "sp-1",
    orgId: "org-1",
    teamId: "team-1",
    specialistDefinitionId: "generic-specialist",
    role: "specialist",
    permissions: { canDo: ["crm:lookup"], cannotDo: [] },
    status: "active",
  };
}

function buildTask(): Task {
  return {
    id: "task-1",
    orgId: "org-1",
    teamId: "team-1",
    specialistId: "sp-1",
    assignedByTeamLeadId: "tl-1",
    status: "pending",
    permissions: { canDo: ["crm:lookup"], cannotDo: [] },
    context: { capabilityId: "crm:lookup", instruction: "Find contact" },
    createdAt: NOW,
    updatedAt: NOW,
  };
}

function buildConnectorRegistry(): InMemoryConnectorRegistry {
  const registry = new InMemoryConnectorRegistry();
  registry.registerCapability({
    id: "crm:lookup",
    requiredPermission: "crm:lookup",
  });

  const definition: ConnectorDefinition = {
    id: "connector-crm",
    connectorKind: "crm-bridge",
    displayName: "CRM Bridge",
    capabilityIds: ["crm:lookup"],
    status: "active",
    orgScope: "platform",
  };

  const connector: Connector = {
    definition,
    health: async () => ({
      connectorId: definition.id,
      status: "healthy",
      checkedAt: NOW,
    }),
    checkPermission: () => ({ allowed: true }),
    execute: async (request) => ({
      requestId: request.requestId,
      capabilityId: request.capabilityId,
      status: "success",
      output: {
        summary: "Contact found",
        contactId: "contact-42",
      },
    }),
  };

  registry.registerConnector(connector);
  return registry;
}

describe("capability-routed execution", () => {
  it("routes specialist tasks through capability requests without provider coupling", async () => {
    const connectorRegistry = buildConnectorRegistry();
    const router = createCapabilityToolRouter(
      createConnectorRouter({ registry: connectorRegistry, now: () => NOW }),
    );

    const executor = createCapabilityRoutedTaskExecutor({ router, now: () => NOW });
    const capabilityRegistry = new InMemoryCapabilityRegistry();
    capabilityRegistry.register("generic-specialist", [
      {
        id: "execute_task",
        requiredPermission: "crm:lookup",
      },
    ]);

    const runtime = createSpecialistRuntime({
      capabilityRegistry,
      taskExecutor: executor,
      policy: {
        requiredCapabilityId: "execute_task",
        minimumConfidence: "low",
        requireActiveSpecialist: true,
        loadMemory: false,
        loadConversationContext: false,
      },
      now: () => NOW,
      createSessionId: () => "session-1",
    });

    const result = await runtime.runTask({
      task: buildTask(),
      specialist: buildSpecialist(),
    });

    expect(result.outcome).toBe("complete");
    if (result.outcome === "complete") {
      expect(result.result.summary).toBe("Contact found");
    }
  });

  it("uses capability id from task context", async () => {
    const connectorRegistry = buildConnectorRegistry();
    const router = createCapabilityToolRouter(
      createConnectorRouter({ registry: connectorRegistry, now: () => NOW }),
    );

    let capturedCapabilityId = "";
    const executor = createCapabilityRoutedTaskExecutor({
      router,
      now: () => NOW,
      resolveCapabilityId: (input: TaskExecutionInput) => {
        capturedCapabilityId =
          (input.context.task.context?.capabilityId as string) ?? "";
        return capturedCapabilityId;
      },
    });

    await executor.execute({
      session: {
        sessionId: "session-1",
        specialist: buildSpecialist(),
        task: buildTask(),
        state: "executing",
        startedAt: NOW,
        updatedAt: NOW,
      },
      context: {
        orgId: "org-1",
        teamId: "team-1",
        specialist: buildSpecialist(),
        task: buildTask(),
        payload: {},
      },
    });

    expect(capturedCapabilityId).toBe("crm:lookup");
  });
});
