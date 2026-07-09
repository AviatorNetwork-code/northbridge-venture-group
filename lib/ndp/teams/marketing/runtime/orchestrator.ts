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
import {
  MARKETING_TEAM_ID,
  MARKETING_TEAM_LEAD_ID,
} from "../constants.js";
import { MarketingSpecialistSelector } from "./specialist-selector.js";
import { MarketingTeamSynthesizer } from "./synthesizer.js";
import { createMarketingTaskExecutor } from "./task-executor.js";
import { buildMarketingSpecialistRoster } from "./roster.js";
import { MARKETING_EXECUTION_CAPABILITIES } from "@/lib/ndp/domain/marketing";

export interface CreateMarketingTeamOrchestratorOptions {
  orgId: string;
  now?: () => string;
}

/**
 * Creates a production Marketing Team orchestrator wired to platform layers.
 */
export function createMarketingTeamOrchestrator(
  options: CreateMarketingTeamOrchestratorOptions,
): TeamOrchestrator {
  const now = options.now ?? (() => new Date().toISOString());
  const specialists = buildMarketingSpecialistRoster(options.orgId);
  const capabilityRegistry = new InMemoryCapabilityRegistry();

  for (const specialist of specialists) {
    capabilityRegistry.register(specialist.specialistDefinitionId, [
      ...MARKETING_EXECUTION_CAPABILITIES.map((entry) => ({
        id: entry.id,
        requiredPermission: entry.requiredPermission ?? "execute_task",
      })),
      { id: "execute_task", requiredPermission: "execute_task" },
    ]);
  }

  const runtimeDeps = {
    capabilityRegistry,
    taskExecutor: createMarketingTaskExecutor({ now }),
    policy: {
      requiredCapabilityId: "execute_task",
      minimumConfidence: "low",
      requireActiveSpecialist: true,
      loadMemory: false,
      loadConversationContext: false,
    },
    now,
    createSessionId: () => `marketing-session-${crypto.randomUUID()}`,
  };

  return createTeamOrchestrator({
    roster: new InMemorySpecialistRoster(specialists),
    runtimeFactory: new IsolatedSpecialistRuntimeFactory(runtimeDeps),
    specialistSelector: new MarketingSpecialistSelector(),
    planBuilder: new DefaultExecutionPlanBuilder(),
    synthesizer: new MarketingTeamSynthesizer(),
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

export function resolveMarketingTeamLeadId(): string {
  return MARKETING_TEAM_LEAD_ID;
}

export function resolveMarketingTeamId(): string {
  return MARKETING_TEAM_ID;
}
