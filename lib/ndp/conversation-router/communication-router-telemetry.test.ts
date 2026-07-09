import { describe, expect, it } from "vitest";
import {
  createDefaultCompositeResolver,
  createWorkforceRouter,
  type RouteRuleSet,
} from "@northbridge/workforce-router";
import {
  createObservabilityExecutionHooks,
  createSpecialistRuntime,
  InMemoryCapabilityRegistry,
} from "@northbridge/specialist-runtime";
import {
  applyOrchestratorObservability,
  createCommunicationRouter,
  createTestOrganization,
  DefaultOwnershipDecisionService,
  InMemoryOrganizationContextLoader,
  InMemorySubscriptionResolver,
  InMemoryTeamResolver,
  TeamOrchestratorExecutionHandler,
  withObservabilityRuntimeDeps,
  type CustomerRequest,
} from "@/lib/ndp/conversation-router";
import {
  createTeamOrchestrator,
  DefaultConflictDetector,
  DefaultExecutionPlanBuilder,
  DefaultTeamReportBuilder,
  DefaultTeamSynthesizer,
  InMemorySpecialistRoster,
  IsolatedSpecialistRuntimeFactory,
  PassthroughSpecialistSelector,
} from "@northbridge/team-orchestrator";
import {
  InMemoryWorkforceTelemetryEmitter,
  type WorkforceEvent,
  type WorkforceTelemetryEmitter,
} from "@northbridge/workforce-observability";

const ORG = "org-acme";
const CUSTOMER = "cust-1";
const NOW = "2026-07-09T12:00:00.000Z";

function sampleRules(): RouteRuleSet {
  return {
    orgId: ORG,
    version: 1,
    rules: [
      {
        ruleId: "route-scheduling",
        priority: 10,
        match: { capabilityTags: ["capability:scheduling"] },
        routeTo: { ownerType: "team", ownerId: "team-scheduling" },
        enabled: true,
      },
    ],
  };
}

function baseRequest(overrides: Partial<CustomerRequest> = {}): CustomerRequest {
  return {
    requestId: "req-telemetry-1",
    orgId: ORG,
    customerId: CUSTOMER,
    threadId: "thread-1",
    channel: "nordi-thread",
    message: "Hello",
    receivedAt: NOW,
    ...overrides,
  };
}

function createFixture(emitter: WorkforceTelemetryEmitter) {
  return createCommunicationRouter({
    organizationLoader: new InMemoryOrganizationContextLoader(
      new Map([
        [
          ORG,
          {
            organization: createTestOrganization(ORG),
            permissions: ["conversation:read", "conversation:write"],
          },
        ],
      ]),
    ),
    subscriptionResolver: new InMemorySubscriptionResolver(
      new Map([
        [
          `${ORG}:${CUSTOMER}`,
          {
            orgId: ORG,
            customerId: CUSTOMER,
            status: "active",
            entitledTeamIds: ["team-scheduling"],
          },
        ],
      ]),
    ),
    teamResolver: new InMemoryTeamResolver(
      new Map([
        [
          `${ORG}:${CUSTOMER}`,
          {
            hiredTeamIds: ["team-scheduling"],
            activeConversations: [],
          },
        ],
      ]),
    ),
    ownershipDecision: new DefaultOwnershipDecisionService(
      createWorkforceRouter({ resolver: createDefaultCompositeResolver() }),
    ),
    resolveRouteRules: async () => sampleRules(),
    telemetryEmitter: emitter,
  });
}

function eventTypes(events: WorkforceEvent[]): string[] {
  return events.map((event) => event.eventType);
}

describe("NDP Communication Router telemetry", () => {
  it("emits customer_request, routing_decision, and customer_response for Nordi-owned requests", async () => {
    const emitter = new InMemoryWorkforceTelemetryEmitter();
    const router = createFixture(emitter);

    await router.handleRequest({
      request: baseRequest({
        intentTags: ["intent:billing"],
        message: "How does billing work?",
      }),
    });

    const types = eventTypes(emitter.events);
    expect(types).toContain("customer_request");
    expect(types).toContain("routing_decision");
    expect(types).toContain("customer_response");
    expect(types).not.toContain("team_execution");
  });

  it("emits full team lifecycle events for team-owned passthrough requests", async () => {
    const emitter = new InMemoryWorkforceTelemetryEmitter();
    const router = createFixture(emitter);

    await router.handleRequest({
      request: baseRequest({
        channel: "team-thread",
        teamId: "team-scheduling",
        requestId: "req-team-passthrough",
        message: "Reschedule appointment",
      }),
    });

    const types = eventTypes(emitter.events);
    expect(types).toEqual([
      "customer_request",
      "routing_decision",
      "team_execution",
      "team_execution",
      "team_synthesis",
      "customer_response",
    ]);
    expect(types.filter((type) => type === "team_execution")).toHaveLength(2);
  });

  it("emits specialist_execution events when using orchestrator adapter with observability runtime deps", async () => {
    const emitter = new InMemoryWorkforceTelemetryEmitter();
    const request = baseRequest({
      channel: "team-thread",
      teamId: "team-scheduling",
      requestId: "req-orchestrator",
      message: "Coordinate work",
    });

    const specialists = ["sp-alpha", "sp-beta"].map((id) => ({
      id,
      orgId: ORG,
      teamId: "team-scheduling",
      specialistDefinitionId: `def-${id}`,
      role: "specialist" as const,
      permissions: { canDo: ["execute_task"], cannotDo: [] },
      status: "active" as const,
    }));

    const registry = new InMemoryCapabilityRegistry();
    for (const id of ["sp-alpha", "sp-beta"]) {
      registry.register(`def-${id}`, [
        { id: "execute_task", requiredPermission: "execute_task" },
      ]);
    }

    const runtimeDeps = withObservabilityRuntimeDeps(
      {
        capabilityRegistry: registry,
        taskExecutor: {
          execute: async ({ session }) => ({
            summary: `Specialist ${session.specialist.id} completed work`,
            confidence: { level: "high" as const },
          }),
        },
        now: () => NOW,
      },
      {
        emitter,
        correlationId: request.requestId,
        orgId: ORG,
        teamId: "team-scheduling",
        now: () => NOW,
      },
    );

    const orchestrator = createTeamOrchestrator(
      applyOrchestratorObservability(
        {
          roster: new InMemorySpecialistRoster(specialists),
          runtimeFactory: new IsolatedSpecialistRuntimeFactory(runtimeDeps),
          specialistSelector: new PassthroughSpecialistSelector(
            specialists.map((entry) => ({
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
            delegationExecutionMode: "parallel",
            synthesizeOnPartialFailure: true,
            escalateOnConflict: true,
            requireAllSpecialistsComplete: false,
            customerFacingViaTeamLeadOnly: true,
          },
        },
        {
          emitter,
          correlationId: request.requestId,
          orgId: ORG,
          teamId: "team-scheduling",
          now: () => NOW,
        },
      ),
    );

    const instrumentedRouter = createCommunicationRouter({
      organizationLoader: new InMemoryOrganizationContextLoader(
        new Map([
          [
            ORG,
            {
              organization: createTestOrganization(ORG),
              permissions: ["conversation:read", "conversation:write"],
            },
          ],
        ]),
      ),
      subscriptionResolver: new InMemorySubscriptionResolver(
        new Map([
          [
            `${ORG}:${CUSTOMER}`,
            {
              orgId: ORG,
              customerId: CUSTOMER,
              status: "active",
              entitledTeamIds: ["team-scheduling"],
            },
          ],
        ]),
      ),
      teamResolver: new InMemoryTeamResolver(
        new Map([
          [
            `${ORG}:${CUSTOMER}`,
            {
              hiredTeamIds: ["team-scheduling"],
              activeConversations: [],
            },
          ],
        ]),
      ),
      ownershipDecision: new DefaultOwnershipDecisionService(
        createWorkforceRouter({ resolver: createDefaultCompositeResolver() }),
      ),
      resolveRouteRules: async () => sampleRules(),
      telemetryEmitter: emitter,
      teamHandler: new TeamOrchestratorExecutionHandler({
        orchestrator,
        resolveTeamLeadId: async () => "tl-scheduling",
        telemetryEmitter: emitter,
      }),
    });

    await instrumentedRouter.handleRequest({ request });

    const specialistEvents = emitter.listByType("specialist_execution");
    expect(specialistEvents.length).toBeGreaterThanOrEqual(4);
    expect(eventTypes(emitter.events)).toContain("team_synthesis");
  });

  it("emits escalation when orchestrator escalates on conflict", async () => {
    const emitter = new InMemoryWorkforceTelemetryEmitter();
    const request = baseRequest({
      channel: "team-thread",
      teamId: "team-scheduling",
      requestId: "req-escalation",
      message: "Conflicting recommendations",
    });

    const specialists = ["sp-alpha", "sp-beta"].map((id) => ({
      id,
      orgId: ORG,
      teamId: "team-scheduling",
      specialistDefinitionId: `def-${id}`,
      role: "specialist" as const,
      permissions: { canDo: ["execute_task"], cannotDo: [] },
      status: "active" as const,
    }));

    const registry = new InMemoryCapabilityRegistry();
    for (const id of ["sp-alpha", "sp-beta"]) {
      registry.register(`def-${id}`, [
        { id: "execute_task", requiredPermission: "execute_task" },
      ]);
    }

    let call = 0;
    const runtimeDeps = {
      capabilityRegistry: registry,
      taskExecutor: {
        execute: async () => {
          call += 1;
          return {
            summary:
              call === 1
                ? "topic:budget recommend increase spend"
                : "topic:budget recommend reduce spend",
            confidence: { level: "high" as const },
          };
        },
      },
      now: () => NOW,
    };

    const orchestrator = createTeamOrchestrator({
      roster: new InMemorySpecialistRoster(specialists),
      runtimeFactory: new IsolatedSpecialistRuntimeFactory(runtimeDeps),
      specialistSelector: new PassthroughSpecialistSelector(
        specialists.map((entry) => ({
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
        delegationExecutionMode: "sequential",
        synthesizeOnPartialFailure: true,
        escalateOnConflict: true,
        requireAllSpecialistsComplete: false,
        customerFacingViaTeamLeadOnly: true,
      },
    });

    const router = createCommunicationRouter({
      organizationLoader: new InMemoryOrganizationContextLoader(
        new Map([
          [
            ORG,
            {
              organization: createTestOrganization(ORG),
              permissions: ["conversation:read", "conversation:write"],
            },
          ],
        ]),
      ),
      subscriptionResolver: new InMemorySubscriptionResolver(
        new Map([
          [
            `${ORG}:${CUSTOMER}`,
            {
              orgId: ORG,
              customerId: CUSTOMER,
              status: "active",
              entitledTeamIds: ["team-scheduling"],
            },
          ],
        ]),
      ),
      teamResolver: new InMemoryTeamResolver(
        new Map([
          [
            `${ORG}:${CUSTOMER}`,
            {
              hiredTeamIds: ["team-scheduling"],
              activeConversations: [],
            },
          ],
        ]),
      ),
      ownershipDecision: new DefaultOwnershipDecisionService(
        createWorkforceRouter({ resolver: createDefaultCompositeResolver() }),
      ),
      resolveRouteRules: async () => sampleRules(),
      telemetryEmitter: emitter,
      teamHandler: new TeamOrchestratorExecutionHandler({
        orchestrator,
        resolveTeamLeadId: async () => "tl-scheduling",
        telemetryEmitter: emitter,
      }),
    });

    const response = await router.handleRequest({ request });

    expect(response.metadata?.escalated).toBe(true);
    expect(emitter.listByType("escalation").length).toBe(1);
    expect(eventTypes(emitter.events)).not.toContain("team_synthesis");
  });

  it("preserves correlation id across all emitted events", async () => {
    const emitter = new InMemoryWorkforceTelemetryEmitter();
    const router = createFixture(emitter);
    const requestId = "corr-req-99";

    await router.handleRequest({
      request: baseRequest({
        requestId,
        channel: "team-thread",
        teamId: "team-scheduling",
      }),
    });

    expect(emitter.events.length).toBeGreaterThan(0);
    for (const event of emitter.events) {
      expect(event.correlationId).toBe(requestId);
    }
  });

  it("does not block customer response when telemetry emit fails", async () => {
    const failingEmitter: WorkforceTelemetryEmitter = {
      emit: () => {
        throw new Error("telemetry backend unavailable");
      },
    };

    const router = createFixture(failingEmitter);

    const response = await router.handleRequest({
      request: baseRequest({
        intentTags: ["intent:billing"],
        message: "Need help",
      }),
    });

    expect(response.owner.type).toBe("nordi");
    expect(response.reply).toContain("Nordi received");
  });

  it("uses no-op telemetry by default without changing responses", async () => {
    const router = createCommunicationRouter({
      organizationLoader: new InMemoryOrganizationContextLoader(
        new Map([
          [
            ORG,
            {
              organization: createTestOrganization(ORG),
              permissions: ["conversation:read", "conversation:write"],
            },
          ],
        ]),
      ),
      subscriptionResolver: new InMemorySubscriptionResolver(
        new Map([
          [
            `${ORG}:${CUSTOMER}`,
            {
              orgId: ORG,
              customerId: CUSTOMER,
              status: "active",
              entitledTeamIds: ["team-scheduling"],
            },
          ],
        ]),
      ),
      teamResolver: new InMemoryTeamResolver(
        new Map([
          [
            `${ORG}:${CUSTOMER}`,
            {
              hiredTeamIds: ["team-scheduling"],
              activeConversations: [],
            },
          ],
        ]),
      ),
      ownershipDecision: new DefaultOwnershipDecisionService(
        createWorkforceRouter({ resolver: createDefaultCompositeResolver() }),
      ),
      resolveRouteRules: async () => sampleRules(),
    });

    const response = await router.handleRequest({
      request: baseRequest({ intentTags: ["intent:billing"] }),
    });

    expect(response.reply).toContain("Nordi received");
  });
});

describe("specialist-runtime observability hooks", () => {
  it("emits specialist_execution events through runtime hooks", async () => {
    const emitter = new InMemoryWorkforceTelemetryEmitter();
    const hooks = createObservabilityExecutionHooks({
      emitter,
      correlationId: "corr-runtime",
      now: () => NOW,
    });

    const registry = new InMemoryCapabilityRegistry();
    registry.register("generic-specialist", [
      { id: "execute_task", requiredPermission: "execute_task" },
    ]);

    const runtime = createSpecialistRuntime({
      capabilityRegistry: registry,
      taskExecutor: {
        execute: async () => ({
          summary: "done",
          confidence: { level: "high" },
        }),
      },
      hooks,
      now: () => NOW,
      createSessionId: () => "session-1",
      policy: {
        requiredCapabilityId: "execute_task",
        minimumConfidence: "low",
        requireActiveSpecialist: true,
        loadMemory: false,
        loadConversationContext: false,
      },
    });

    await runtime.runTask({
      specialist: {
        id: "sp-1",
        orgId: ORG,
        teamId: "team-scheduling",
        specialistDefinitionId: "generic-specialist",
        role: "specialist",
        permissions: { canDo: ["execute_task"], cannotDo: [] },
        status: "active",
      },
      task: {
        id: "task-1",
        orgId: ORG,
        teamId: "team-scheduling",
        specialistId: "sp-1",
        assignedByTeamLeadId: "tl-1",
        status: "pending",
        permissions: { canDo: ["execute_task"], cannotDo: [] },
        context: {},
        createdAt: NOW,
        updatedAt: NOW,
      },
    });

    expect(emitter.listByType("specialist_execution")).toHaveLength(2);
    expect(emitter.events.every((event) => event.correlationId === "corr-runtime")).toBe(
      true,
    );
  });
});
