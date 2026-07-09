import { describe, expect, it } from "vitest";
import {
  CapabilityResolver,
  createNdpConnectorRegistry,
  createOrgConnectorDescriptor,
  getSpecialistExecutionCapabilities,
  InMemoryConnectorRegistry,
  NDP_CONNECTOR_PROVIDER_CATALOG,
  NDP_EXECUTION_CAPABILITIES,
  registerDefaultSchedulingConnectors,
  validateAllMappedSpecialists,
} from "@/lib/ndp/connectors";
import {
  InMemoryWorkforceTelemetryEmitter,
} from "@northbridge/workforce-observability";

const ORG = "org-acme";

describe("NDP Connector Registry", () => {
  it("registers capabilities and providers from catalog", () => {
    const registry = createNdpConnectorRegistry();

    expect(registry.listCapabilities()).toHaveLength(NDP_EXECUTION_CAPABILITIES.length);
    expect(registry.listProviders()).toHaveLength(NDP_CONNECTOR_PROVIDER_CATALOG.length);
    expect(registry.hasCapability("schedule.create")).toBe(true);
    expect(registry.getProvider("provider:google-calendar")).toBeDefined();
  });

  it("registers org connector descriptors", () => {
    const registry = new InMemoryConnectorRegistry();
    registry.registerCapability(NDP_EXECUTION_CAPABILITIES[0]!);
    registry.registerProvider(NDP_CONNECTOR_PROVIDER_CATALOG[0]!);
    registry.registerDescriptor(
      createOrgConnectorDescriptor({
        orgId: ORG,
        providerId: "provider:google-calendar",
        capabilityIds: ["schedule.create"],
      }),
    );

    expect(registry.listDescriptors(ORG)).toHaveLength(1);
    expect(registry.getDescriptor(`${ORG}:provider:google-calendar`)).toBeDefined();
  });

  it("looks up capabilities by category", () => {
    const registry = createNdpConnectorRegistry();
    const scheduling = registry.listCapabilities({ category: "scheduling" });

    expect(scheduling.every((entry) => entry.category === "scheduling")).toBe(true);
    expect(scheduling.length).toBeGreaterThan(0);
  });

  it("looks up providers by capability", () => {
    const registry = createNdpConnectorRegistry();
    const providers = registry.listProviders({ capabilityId: "schedule.create" });

    expect(providers.map((entry) => entry.id)).toEqual(
      expect.arrayContaining([
        "provider:google-calendar",
        "provider:microsoft-outlook",
        "provider:calendly",
      ]),
    );
  });
});

describe("Capability resolution", () => {
  function createSchedulingFixture() {
    const registry = createNdpConnectorRegistry();
    registerDefaultSchedulingConnectors(registry, ORG, "provider:google-calendar");
    return new CapabilityResolver({ registry });
  }

  it("selects preferred provider", () => {
    const resolver = createSchedulingFixture();
    const result = resolver.resolve({
      orgId: ORG,
      capabilityId: "schedule.create",
    });

    expect(result.status).toBe("resolved");
    expect(result.providerId).toBe("provider:google-calendar");
    expect(result.selectionReason).toBe("preferred provider");
  });

  it("selects fallback provider when preferred is disabled", () => {
    const registry = createNdpConnectorRegistry();
    registerDefaultSchedulingConnectors(registry, ORG, "provider:google-calendar");

    const preferredDescriptor = registry.getDescriptor(
      `${ORG}:provider:google-calendar`,
    );
    registry.registerDescriptor({
      ...preferredDescriptor!,
      enabled: false,
    });

    const resolver = new CapabilityResolver({ registry });
    const result = resolver.resolve({
      orgId: ORG,
      capabilityId: "schedule.create",
    });

    expect(result.status).toBe("fallback");
    expect(result.providerId).toBe("provider:microsoft-outlook");
  });

  it("respects organization-specific provider overrides", () => {
    const registry = createNdpConnectorRegistry();
    registerDefaultSchedulingConnectors(registry, ORG, "provider:google-calendar");

    registry.registerOrgPolicy({
      orgId: ORG,
      capabilityId: "schedule.create",
      preferredProviderId: "provider:calendly",
      fallbackProviderIds: ["provider:google-calendar"],
    });

    const resolver = new CapabilityResolver({ registry });
    const result = resolver.resolve({
      orgId: ORG,
      capabilityId: "schedule.create",
    });

    expect(result.providerId).toBe("provider:calendly");
    expect(result.status).toBe("resolved");
  });

  it("returns unavailable when connector is disabled", () => {
    const registry = createNdpConnectorRegistry();
    registerDefaultSchedulingConnectors(registry, ORG, "provider:google-calendar");

    for (const descriptor of registry.listDescriptors(ORG)) {
      registry.registerDescriptor({ ...descriptor, enabled: false });
    }

    const resolver = new CapabilityResolver({ registry });
    const result = resolver.resolve({
      orgId: ORG,
      capabilityId: "schedule.create",
    });

    expect(result.status).toBe("unavailable");
  });

  it("returns not_found for unknown capability", () => {
    const resolver = createSchedulingFixture();
    const result = resolver.resolve({
      orgId: ORG,
      capabilityId: "unknown.capability",
    });

    expect(result.status).toBe("not_found");
  });

  it("supports region-specific provider filtering", () => {
    const registry = createNdpConnectorRegistry();
    registry.registerOrgPolicy({
      orgId: ORG,
      capabilityId: "accounting.invoice.create",
      preferredProviderId: "provider:quickbooks",
      fallbackProviderIds: ["provider:xero"],
    });

    for (const providerId of ["provider:quickbooks", "provider:xero"]) {
      registry.registerDescriptor(
        createOrgConnectorDescriptor({
          orgId: ORG,
          providerId,
          capabilityIds: ["accounting.invoice.create"],
        }),
      );
    }

    const resolver = new CapabilityResolver({ registry });

    const usResult = resolver.resolve({
      orgId: ORG,
      capabilityId: "accounting.invoice.create",
      region: "us",
    });
    expect(usResult.providerId).toBe("provider:quickbooks");

    registry.registerOrgPolicy({
      orgId: ORG,
      capabilityId: "accounting.invoice.create",
      preferredProviderId: "provider:quickbooks",
      fallbackProviderIds: ["provider:xero"],
      region: "eu",
    });

    const euResult = resolver.resolve({
      orgId: ORG,
      capabilityId: "accounting.invoice.create",
      region: "eu",
    });
    expect(euResult.providerId).toBe("provider:xero");
    expect(euResult.status).toBe("fallback");
  });

  it("emits resolution telemetry without executing providers", async () => {
    const emitter = new InMemoryWorkforceTelemetryEmitter();
    const registry = createNdpConnectorRegistry();
    registerDefaultSchedulingConnectors(registry, ORG);

    const resolver = new CapabilityResolver({ registry, telemetryEmitter: emitter });
    resolver.resolve({
      orgId: ORG,
      capabilityId: "schedule.create",
      correlationId: "corr-1",
    });

    const events = emitter.listByType("tool_execution");
    expect(events).toHaveLength(1);
    expect(events[0]?.metadata).toMatchObject({
      phase: "connector_resolution",
      resolutionOnly: true,
      capabilityId: "schedule.create",
    });
  });
});

describe("Team Catalog capability compatibility", () => {
  it("maps appointment specialist to execution capabilities not providers", () => {
    const capabilities = getSpecialistExecutionCapabilities("appointment-specialist");

    expect(capabilities).toEqual([
      "schedule.create",
      "schedule.update",
      "schedule.cancel",
    ]);
    expect(capabilities.some((entry) => entry.includes("google"))).toBe(false);
  });

  it("validates mapped specialists against registry capabilities", () => {
    const registry = createNdpConnectorRegistry();
    const issues = validateAllMappedSpecialists({
      hasCapability: (id) => registry.hasCapability(id),
    });

    expect(issues).toEqual([]);
  });
});

describe("Organization capability availability", () => {
  it("resolves availability for all registered capabilities", () => {
    const registry = createNdpConnectorRegistry();
    registerDefaultSchedulingConnectors(registry, ORG);
    const resolver = new CapabilityResolver({ registry });

    const availability = resolver.resolveOrganizationAvailability({
      orgId: ORG,
      capabilityIds: ["schedule.create", "schedule.update", "crm.contact.create"],
    });

    expect(availability.orgId).toBe(ORG);
    expect(availability.capabilities).toHaveLength(3);
    expect(availability.capabilities[0]?.available).toBe(true);
    expect(availability.capabilities[2]?.available).toBe(false);
  });
});
