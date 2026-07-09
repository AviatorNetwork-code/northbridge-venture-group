import type { Specialist } from "@northbridge/workforce-contracts";
import type { SpecialistRuntime, SpecialistRuntimeDependencies } from "@northbridge/specialist-runtime";
import { createSpecialistRuntime } from "@northbridge/specialist-runtime";
import type { ConflictDetector } from "../types/conflict.js";
import type { CrossTeamCollaborationAdapter } from "../types/collaboration.js";
import type {
  DelegatedTask,
  DelegationResult,
} from "../types/delegation.js";
import type { TeamLifecycleEvents } from "../types/lifecycle.js";
import type {
  ExecutionPlanBuilder,
  SpecialistSelector,
} from "../types/plan.js";
import type {
  TeamLeadPolicy,
  TeamOrchestratorHooks,
} from "../types/policy.js";
import type { TeamProgressReporter } from "../types/progress.js";
import type { TeamReportBuilder } from "../types/report.js";
import type { TeamSession } from "../types/request.js";
import type { TeamSynthesizer } from "../types/synthesis.js";
import type {
  OrchestrateTeamInput,
  OrchestrateTeamResult,
  SpecialistRoster,
  SpecialistRuntimeFactory,
  TeamOrchestrator,
} from "./types.js";
import { TeamOrchestratorError } from "./errors.js";
import {
  assertTeamTransition,
  isTeamTerminalState,
} from "./state-machine.js";
import { assignTeamRequestOwner, assertSingleOwner } from "./owner.js";
import { buildDelegatedTask } from "../delegation/build-task.js";

export interface TeamOrchestratorDependencies {
  roster: SpecialistRoster;
  runtimeFactory: SpecialistRuntimeFactory;
  specialistSelector: SpecialistSelector;
  planBuilder: ExecutionPlanBuilder;
  synthesizer: TeamSynthesizer;
  reportBuilder: TeamReportBuilder;
  conflictDetector: ConflictDetector;
  policy?: TeamLeadPolicy;
  progressReporter?: TeamProgressReporter;
  hooks?: TeamOrchestratorHooks;
  lifecycle?: TeamLifecycleEvents;
  collaboration?: CrossTeamCollaborationAdapter;
  now?: () => string;
  createSessionId?: () => string;
}

export class DefaultTeamOrchestrator implements TeamOrchestrator {
  private session: TeamSession | null = null;
  private readonly deps: TeamOrchestratorDependencies;

  constructor(dependencies: TeamOrchestratorDependencies) {
    this.deps = {
      policy: dependencies.policy ?? {
        maxConcurrentDelegations: 8,
        delegationExecutionMode: "sequential",
        synthesizeOnPartialFailure: true,
        escalateOnConflict: true,
        requireAllSpecialistsComplete: false,
        customerFacingViaTeamLeadOnly: true,
      },
      ...dependencies,
      now: dependencies.now ?? (() => new Date().toISOString()),
      createSessionId:
        dependencies.createSessionId ??
        (() => `team-session-${crypto.randomUUID()}`),
    };
  }

  getSession() {
    return this.session;
  }

  getOwner() {
    return this.session?.owner ?? null;
  }

  reset(): void {
    if (this.session && !isTeamTerminalState(this.session.state)) {
      throw new TeamOrchestratorError(
        "invalid_state",
        "Cannot reset while team request is in progress",
        { state: this.session.state },
      );
    }
    this.session = null;
  }

  async orchestrate(input: OrchestrateTeamInput): Promise<OrchestrateTeamResult> {
    if (this.session && !isTeamTerminalState(this.session.state)) {
      return {
        outcome: "failed",
        session: this.session,
        error: new TeamOrchestratorError(
          "concurrent_request",
          "A team request is already in progress",
          { state: this.session.state },
        ),
      };
    }

    const now = this.deps.now!();
    try {
      this.session = {
        sessionId: input.sessionId ?? this.deps.createSessionId!(),
        request: input.request,
        owner: assignTeamRequestOwner(input.request.orgId, input.request.teamId),
        state: "received",
        delegations: [],
        results: [],
        conflicts: [],
        startedAt: now,
        updatedAt: now,
      };

      await this.emit("request.received", "received");
      assertSingleOwner(null, this.session.owner);
      await this.transition("owner_assigned", "owner.assigned");
      await this.reportProgress("ownership", "Team request owner assigned");

      const roster = await this.deps.roster.getSpecialists(
        input.request.orgId,
        input.request.teamId,
      );
      if (roster.length === 0) {
        throw new TeamOrchestratorError(
          "no_specialists",
          "No specialists available on team roster",
        );
      }

      const selections = await this.deps.specialistSelector.select({
        requestId: input.request.id,
        orgId: input.request.orgId,
        teamId: input.request.teamId,
        payload: input.request.payload,
        availableSpecialistIds: roster.map((s) => s.id),
      });

      if (selections.length === 0) {
        throw new TeamOrchestratorError(
          "no_specialists",
          "Specialist selector returned no selections",
        );
      }

      if (selections.length > this.deps.policy!.maxConcurrentDelegations) {
        throw new TeamOrchestratorError(
          "policy_violation",
          "Selection exceeds maxConcurrentDelegations policy",
        );
      }

      const plan = await this.deps.planBuilder.buildPlan({
        requestId: input.request.id,
        orgId: input.request.orgId,
        teamId: input.request.teamId,
        teamLeadId: input.request.teamLeadId,
        payload: input.request.payload,
        selections,
        now,
      });
      this.session.plan = plan;
      await this.transition("plan_created", "plan.created");
      await this.transition("specialists_selected", "specialists.selected");
      await this.reportProgress("planning", "Execution plan created");

      const specialistMap = new Map(
        roster.map((specialist) => [specialist.id, specialist]),
      );

      for (const planned of plan.tasks) {
        const specialist = specialistMap.get(planned.selection.specialistId);
        if (!specialist) {
          throw new TeamOrchestratorError(
            "no_specialists",
            `Specialist ${planned.selection.specialistId} not on roster`,
          );
        }
        const task = buildDelegatedTask(input.request, planned, specialist, now);
        this.session.delegations.push({
          delegationId: `delegation-${planned.planTaskId}`,
          planTaskId: planned.planTaskId,
          task,
          specialist,
          status: "pending",
        });
      }

      await this.transition("tasks_delegated", "tasks.delegated");
      await this.reportProgress("delegation", "Tasks delegated to specialists");

      const results = await this.executeDelegations(this.session.delegations);
      this.session.results = results;
      await this.transition("specialists_executed", "specialists.executed");
      await this.transition("results_collected", "results.collected");
      await this.reportProgress("collection", "Specialist results collected");

      const conflicts = this.deps.conflictDetector.detect({
        results,
        now: this.deps.now!(),
      });
      this.session.conflicts = conflicts;
      await this.transition("conflicts_checked", "conflicts.checked");
      await this.reportProgress("conflict", "Conflicts checked");

      if (conflicts.length > 0 && this.deps.policy!.escalateOnConflict) {
        return this.escalate(
          "Conflicting specialist recommendations detected",
          "nordi",
          { conflicts },
        );
      }

      const successful = results.filter((r) => r.outcome === "complete");
      if (
        this.deps.policy!.requireAllSpecialistsComplete &&
        successful.length !== results.length
      ) {
        return this.escalate(
          "Not all specialist delegations completed successfully",
          "team_lead_review",
        );
      }

      if (
        successful.length === 0 &&
        !this.deps.policy!.synthesizeOnPartialFailure
      ) {
        throw new TeamOrchestratorError(
          "delegation_failed",
          "All specialist delegations failed",
        );
      }

      const synthesis = await this.deps.synthesizer.synthesize({
        request: input.request,
        results,
        conflicts,
        now: this.deps.now!(),
      });
      this.session.synthesis = synthesis;
      await this.transition("synthesis_created", "synthesis.created");
      await this.reportProgress("synthesis", "Team synthesis created");

      const report = this.deps.reportBuilder.build({
        reportId: input.reportId ?? `report-${input.request.id}`,
        request: input.request,
        synthesis,
        periodStart: input.request.receivedAt,
        periodEnd: this.deps.now!(),
        now: this.deps.now!(),
      });

      await this.transition("complete", "request.complete");
      await this.reportProgress("report", "Team report generated", 100);

      return {
        outcome: "complete",
        session: this.session,
        owner: this.session.owner,
        synthesis,
        report,
      };
    } catch (error) {
      if (error instanceof TeamOrchestratorError) {
        return { outcome: "failed", session: this.session ?? undefined, error };
      }
      return {
        outcome: "failed",
        session: this.session ?? undefined,
        error: new TeamOrchestratorError(
          "invalid_state",
          error instanceof Error ? error.message : "Unknown orchestration failure",
          { cause: error, state: this.session?.state },
        ),
      };
    }
  }

  private async executeDelegations(
    delegations: DelegatedTask[],
  ): Promise<DelegationResult[]> {
    const mode = this.deps.policy!.delegationExecutionMode ?? "sequential";

    if (mode === "parallel") {
      return Promise.all(
        delegations.map((delegation) => this.executeDelegation(delegation)),
      );
    }

    const results: DelegationResult[] = [];
    for (const delegation of delegations) {
      results.push(await this.executeDelegation(delegation));
    }
    return results;
  }

  private async executeDelegation(
    delegation: DelegatedTask,
  ): Promise<DelegationResult> {
      delegation.status = "delegated";
      await this.deps.hooks?.onBeforeDelegation?.({
        sessionId: this.session!.sessionId,
        delegationId: delegation.delegationId,
        specialistId: delegation.specialist.id,
      });

      const runtime = this.deps.runtimeFactory.forSpecialist(delegation.specialist);
      const runResult = await runtime.runTask({
        task: delegation.task,
        specialist: delegation.specialist,
        sessionId: `${this.session!.sessionId}:${delegation.delegationId}`,
        capabilityId: delegation.task.context.capabilityId as string | undefined,
        escalationTarget: {
          role: "team_lead",
          id: this.session!.request.teamLeadId,
        },
      });

      const completedAt = this.deps.now!();
      let delegationResult: DelegationResult;

      if (runResult.outcome === "complete") {
        delegation.status = "complete";
        delegationResult = {
          delegationId: delegation.delegationId,
          planTaskId: delegation.planTaskId,
          specialistId: delegation.specialist.id,
          outcome: "complete",
          result: runResult.result,
          confidence: runResult.confidence,
          completedAt,
        };
      } else if (runResult.outcome === "escalated") {
        delegation.status = "escalated";
        const escalation = {
          requestId: this.session!.request.id,
          orgId: this.session!.request.orgId,
          teamId: this.session!.request.teamId,
          teamLeadId: this.session!.request.teamLeadId,
          reason: runResult.escalation.reason,
          target: "team_lead_review" as const,
          sourceDelegationId: delegation.delegationId,
          requestedAt: completedAt,
        };
        delegationResult = {
          delegationId: delegation.delegationId,
          planTaskId: delegation.planTaskId,
          specialistId: delegation.specialist.id,
          outcome: "escalated",
          escalation,
          completedAt,
        };
        await this.deps.hooks?.onEscalation?.(escalation);
      } else {
        delegation.status = "failed";
        delegationResult = {
          delegationId: delegation.delegationId,
          planTaskId: delegation.planTaskId,
          specialistId: delegation.specialist.id,
          outcome: "failed",
          error: runResult.error.message,
          completedAt,
        };
      }

      await this.deps.hooks?.onAfterDelegation?.(delegationResult);
    return delegationResult;
  }

  private async escalate(
    reason: string,
    target: import("../types/escalation.js").TeamEscalationTarget,
    context?: Record<string, unknown>,
  ): Promise<OrchestrateTeamResult> {
    if (!this.session) {
      throw new TeamOrchestratorError("invalid_state", "No active session");
    }
    if (!isTeamTerminalState(this.session.state)) {
      assertTeamTransition(this.session.state, "escalated");
      this.session.state = "escalated";
      this.session.updatedAt = this.deps.now!();
    }

    const escalation = {
      requestId: this.session.request.id,
      orgId: this.session.request.orgId,
      teamId: this.session.request.teamId,
      teamLeadId: this.session.request.teamLeadId,
      reason,
      target,
      requestedAt: this.deps.now!(),
      context,
    };

    await this.deps.hooks?.onEscalation?.(escalation);
    await this.emit("request.escalated", "escalated", { reason, target });

    return {
      outcome: "escalated",
      session: this.session,
      owner: this.session.owner,
      escalation,
    };
  }

  private async transition(
    to: TeamSession["state"],
    eventName: import("../types/lifecycle.js").TeamLifecycleEventName,
  ): Promise<void> {
    if (!this.session) return;
    const from = this.session.state;
    if (from === "received" && to === "owner_assigned") {
      this.session.state = to;
    } else {
      assertTeamTransition(from, to);
      this.session.state = to;
    }
    this.session.updatedAt = this.deps.now!();
    await this.emit(eventName, to);
  }

  private async emit(
    name: import("../types/lifecycle.js").TeamLifecycleEventName,
    state: TeamSession["state"],
    detail?: Record<string, unknown>,
  ): Promise<void> {
    if (!this.session) return;
    await this.deps.lifecycle?.onEvent?.({
      name,
      state,
      sessionId: this.session.sessionId,
      requestId: this.session.request.id,
      timestamp: this.deps.now!(),
      detail,
    });
  }

  private async reportProgress(
    phase: import("../types/progress.js").TeamProgressPhase,
    message: string,
    percent?: number,
  ): Promise<void> {
    if (!this.session || !this.deps.progressReporter) return;
    await this.deps.progressReporter.report({
      sessionId: this.session.sessionId,
      requestId: this.session.request.id,
      teamId: this.session.request.teamId,
      phase,
      message,
      percent,
      timestamp: this.deps.now!(),
    });
    await this.emit("progress.reported", this.session.state, {
      phase,
      message,
      percent,
    });
  }
}

export function createTeamOrchestrator(
  dependencies: TeamOrchestratorDependencies,
): TeamOrchestrator {
  return new DefaultTeamOrchestrator(dependencies);
}

export class InMemorySpecialistRoster implements SpecialistRoster {
  constructor(private readonly specialists: Specialist[]) {}

  async getSpecialists(orgId: string, teamId: string): Promise<Specialist[]> {
    return this.specialists.filter(
      (specialist) =>
        specialist.orgId === orgId && specialist.teamId === teamId,
    );
  }

  async getSpecialistById(
    orgId: string,
    specialistId: string,
  ): Promise<Specialist | undefined> {
    return this.specialists.find(
      (specialist) =>
        specialist.orgId === orgId && specialist.id === specialistId,
    );
  }
}

export class SharedSpecialistRuntimeFactory implements SpecialistRuntimeFactory {
  constructor(private readonly runtime: SpecialistRuntime) {}

  forSpecialist(_specialist: Specialist): SpecialistRuntime {
    return this.runtime;
  }
}

/** Creates an isolated specialist runtime per delegation — required for parallel execution mode. */
export class IsolatedSpecialistRuntimeFactory implements SpecialistRuntimeFactory {
  constructor(private readonly deps: SpecialistRuntimeDependencies) {}

  forSpecialist(_specialist: Specialist): SpecialistRuntime {
    return createSpecialistRuntime(this.deps);
  }
}
