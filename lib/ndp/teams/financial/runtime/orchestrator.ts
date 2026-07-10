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
import { FINANCIAL_EXECUTION_CAPABILITIES } from "@/lib/ndp/domain/financial";
import { FINANCIAL_TEAM_ID, FINANCIAL_TEAM_LEAD_ID } from "../constants.js";
import { FinancialSpecialistSelector } from "./specialist-selector.js";
import { FinancialTeamSynthesizer } from "./synthesizer.js";
import { createFinancialTaskExecutor } from "./task-executor.js";
import { buildFinancialSpecialistRoster } from "./roster.js";

export interface CreateFinancialTeamOrchestratorOptions {
  orgId: string;
  now?: () => string;
}

export function createFinancialTeamOrchestrator(
  options: CreateFinancialTeamOrchestratorOptions,
): TeamOrchestrator {
  const now = options.now ?? (() => new Date().toISOString());
  const specialists = buildFinancialSpecialistRoster(options.orgId);
  const capabilityRegistry = new InMemoryCapabilityRegistry();

  for (const specialist of specialists) {
    capabilityRegistry.register(specialist.specialistDefinitionId, [
      ...FINANCIAL_EXECUTION_CAPABILITIES.map((entry) => ({
        id: entry.id,
        requiredPermission: entry.requiredPermission ?? "execute_task",
      })),
      { id: "execute_task", requiredPermission: "execute_task" },
    ]);
  }

  const runtimeDeps = {
    capabilityRegistry,
    taskExecutor: createFinancialTaskExecutor({ now }),
    policy: {
      requiredCapabilityId: "execute_task",
      minimumConfidence: "low",
      requireActiveSpecialist: true,
      loadMemory: false,
      loadConversationContext: false,
    },
    now,
    createSessionId: () => `financial-session-${crypto.randomUUID()}`,
  };

  return createTeamOrchestrator({
    roster: new InMemorySpecialistRoster(specialists),
    runtimeFactory: new IsolatedSpecialistRuntimeFactory(runtimeDeps),
    specialistSelector: new FinancialSpecialistSelector(),
    planBuilder: new DefaultExecutionPlanBuilder(),
    synthesizer: new FinancialTeamSynthesizer(),
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

export function resolveFinancialTeamLeadId(): string {
  return FINANCIAL_TEAM_LEAD_ID;
}

export function resolveFinancialTeamId(): string {
  return FINANCIAL_TEAM_ID;
}
