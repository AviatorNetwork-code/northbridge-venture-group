import { InMemoryCapabilityRegistry } from "@northbridge/specialist-runtime";
import {
  createTeamOrchestrator,
  DefaultConflictDetector,
  DefaultExecutionPlanBuilder,
  InMemorySpecialistRoster,
  InMemoryTeamProgressReporter,
  IsolatedSpecialistRuntimeFactory,
  type TeamOrchestrator,
} from "@northbridge/team-orchestrator";
import { NDP_DEFAULT_TEAM_LEAD_POLICY } from "@/lib/ndp/teams/shared";
import { CUSTOMER_SERVICE_EXECUTION_CAPABILITIES } from "@/lib/ndp/domain/customer-service";
import { CUSTOMER_SERVICE_TEAM_ID, CUSTOMER_SERVICE_TEAM_LEAD_ID } from "../constants.js";
import { CustomerServiceSpecialistSelector } from "./specialist-selector.js";
import { CustomerServiceTeamSynthesizer } from "./synthesizer.js";
import { createCustomerServiceTaskExecutor } from "./task-executor.js";
import { buildCustomerServiceSpecialistRoster } from "./roster.js";

export interface CreateCustomerServiceTeamOrchestratorOptions {
  orgId: string;
  now?: () => string;
}

export function createCustomerServiceTeamOrchestrator(
  options: CreateCustomerServiceTeamOrchestratorOptions,
): TeamOrchestrator {
  const now = options.now ?? (() => new Date().toISOString());
  const specialists = buildCustomerServiceSpecialistRoster(options.orgId);
  const capabilityRegistry = new InMemoryCapabilityRegistry();

  for (const specialist of specialists) {
    capabilityRegistry.register(specialist.specialistDefinitionId, [
      ...CUSTOMER_SERVICE_EXECUTION_CAPABILITIES.map((entry) => ({
        id: entry.id,
        requiredPermission: entry.requiredPermission ?? "execute_task",
      })),
      { id: "execute_task", requiredPermission: "execute_task" },
    ]);
  }

  const runtimeDeps = {
    capabilityRegistry,
    taskExecutor: createCustomerServiceTaskExecutor({ now }),
    policy: {
      requiredCapabilityId: "execute_task",
      minimumConfidence: "low",
      requireActiveSpecialist: true,
      loadMemory: false,
      loadConversationContext: false,
    },
    now,
    createSessionId: () => `customer-service-session-${crypto.randomUUID()}`,
  };

  return createTeamOrchestrator({
    roster: new InMemorySpecialistRoster(specialists),
    runtimeFactory: new IsolatedSpecialistRuntimeFactory(runtimeDeps),
    specialistSelector: new CustomerServiceSpecialistSelector(),
    planBuilder: new DefaultExecutionPlanBuilder(),
    synthesizer: new CustomerServiceTeamSynthesizer(),
    reportBuilder: {
      build: (input) => ({
        id: input.reportId,
        orgId: input.request.orgId,
        teamId: input.request.teamId,
        teamLeadId: input.request.teamLeadId,
        periodStart: input.periodStart,
        periodEnd: input.periodEnd,
        summary: input.synthesis.summary,
        metrics: input.metrics ?? [],
        generatedAt: input.now ?? now(),
      }),
    },
    conflictDetector: new DefaultConflictDetector(),
    progressReporter: new InMemoryTeamProgressReporter(),
    policy: NDP_DEFAULT_TEAM_LEAD_POLICY,
  });
}

export function resolveCustomerServiceTeamLeadId(): string {
  return CUSTOMER_SERVICE_TEAM_LEAD_ID;
}

export function resolveCustomerServiceTeamId(): string {
  return CUSTOMER_SERVICE_TEAM_ID;
}
