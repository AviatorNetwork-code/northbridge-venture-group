import { describe, expect, it } from "vitest";
import {
  createConnectorRouter,
  InMemoryConnectorRegistry,
  type CapabilityRequest,
  type Connector,
  type ConnectorDefinition,
  type ConnectorPermissionEnvelope,
} from "../src/index.js";

const NOW = "2026-07-09T20:00:00.000Z";

function buildDefinition(
  overrides: Partial<ConnectorDefinition> = {},
): ConnectorDefinition {
  return {
    id: "connector-scheduling",
    connectorKind: "scheduling-bridge",
    displayName: "Scheduling Bridge",
    capabilityIds: ["scheduling:book"],
    status: "active",
    orgScope: "platform",
    ...overrides,
  };
}

function buildConnector(
  definition: ConnectorDefinition,
  executeOutput: Record<string, unknown> = { appointmentId: "appt-1" },
): Connector {
  return {
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
      output: executeOutput,
    }),
  };
}

function buildRequest(
  overrides: Partial<CapabilityRequest> = {},
): CapabilityRequest {
  return {
    requestId: "req-1",
    capabilityId: "scheduling:book",
    orgId: "org-1",
    specialistId: "sp-1",
    teamId: "team-1",
    correlationId: "corr-1",
    input: { slot: "2026-07-10T10:00:00Z" },
    timestamp: NOW,
    ...overrides,
  };
}

function buildEnvelope(): ConnectorPermissionEnvelope {
  return {
    orgId: "org-1",
    specialistId: "sp-1",
    teamId: "team-1",
    permissions: { canDo: ["scheduling:book"], cannotDo: [] },
  };
}

describe("@northbridge/workforce-connectors", () => {
  it("registers capabilities and discovers connectors by capability", () => {
    const registry = new InMemoryConnectorRegistry();
    registry.registerCapability({
      id: "scheduling:book",
      requiredPermission: "scheduling:book",
      tags: ["scheduling"],
    });
    registry.registerConnector(buildConnector(buildDefinition()));

    expect(registry.hasCapability("scheduling:book")).toBe(true);
    expect(registry.discoverConnectors({ capabilityId: "scheduling:book" }))
      .toHaveLength(1);
  });

  it("routes capability requests without exposing provider identity to callers", async () => {
    const registry = new InMemoryConnectorRegistry();
    registry.registerCapability({
      id: "scheduling:book",
      requiredPermission: "scheduling:book",
    });
    registry.registerConnector(buildConnector(buildDefinition()));

    const router = createConnectorRouter({ registry, now: () => NOW });
    const result = await router.execute(buildRequest(), buildEnvelope());

    expect(result.status).toBe("success");
    expect(result.output?.appointmentId).toBe("appt-1");
    expect(result).not.toHaveProperty("provider");
    expect(result).not.toHaveProperty("connectorKind");
  });

  it("denies execution when permission is missing", async () => {
    const registry = new InMemoryConnectorRegistry();
    registry.registerCapability({
      id: "scheduling:book",
      requiredPermission: "scheduling:book",
    });
    registry.registerConnector(buildConnector(buildDefinition()));

    const router = createConnectorRouter({ registry, now: () => NOW });
    const result = await router.execute(buildRequest(), {
      orgId: "org-1",
      permissions: { canDo: ["other:action"], cannotDo: [] },
    });

    expect(result.status).toBe("denied");
  });

  it("reports connector health", async () => {
    const registry = new InMemoryConnectorRegistry();
    registry.registerConnector(buildConnector(buildDefinition()));

    const health = await registry.getHealth("connector-scheduling", "org-1");
    expect(health.status).toBe("healthy");
  });
});
