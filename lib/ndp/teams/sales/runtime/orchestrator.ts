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
import { SALES_EXECUTION_CAPABILITIES } from "@/lib/ndp/domain/sales";
import { SALES_TEAM_ID, SALES_TEAM_LEAD_ID } from "../constants.js";
import { SalesSpecialistSelector } from "./specialist-selector.js";
import { SalesTeamSynthesizer } from "./synthesizer.js";
import { createSalesTaskExecutor } from "./task-executor.js";
import { buildSalesSpecialistRoster } from "./roster.js";

export interface CreateSalesTeamOrchestratorOptions {
  orgId: string;
  now?: () => string;
}

export function createSalesTeamOrchestrator(
  options: CreateSalesTeamOrchestratorOptions,
): TeamOrchestrator {
  const now = options.now ?? (() => new Date().toISOString());
  const specialists = buildSalesSpecialistRoster(options.orgId);
  const capabilityRegistry = new InMemoryCapabilityRegistry();

  for (const specialist of specialists) {
    capabilityRegistry.register(specialist.specialistDefinitionId, [
      ...SALES_EXECUTION_CAPABILITIES.map((entry) => ({
        id: entry.id,
        requiredPermission: entry.requiredPermission ?? "execute_task",
      })),
      { id: "execute_task", requiredPermission: "execute_task" },
    ]);
  }

  const runtimeDeps = {
    capabilityRegistry,
    taskExecutor: createSalesTaskExecutor({ now }),
    policy: {
      requiredCapabilityId: "execute_task",
      minimumConfidence: "low",
      requireActiveSpecialist: true,
      loadMemory: false,
      loadConversationContext: false,
    },
    now,
    createSessionId: () => `sales-session-${crypto.randomUUID()}`,
  };

  return createTeamOrchestrator({
    roster: new InMemorySpecialistRoster(specialists),
    runtimeFactory: new IsolatedSpecialistRuntimeFactory(runtimeDeps),
    specialistSelector: new SalesSpecialistSelector(),
    planBuilder: new DefaultExecutionPlanBuilder(),
    synthesizer: new SalesTeamSynthesizer(),
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

export function resolveSalesTeamLeadId(): string {
  return SALES_TEAM_LEAD_ID;
}

export function resolveSalesTeamId(): string {
  return SALES_TEAM_ID;
}
