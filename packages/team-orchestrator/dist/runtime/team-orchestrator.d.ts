import type { Specialist } from "@northbridge/workforce-contracts";
import type { SpecialistRuntime } from "@northbridge/specialist-runtime";
import type { ConflictDetector } from "../types/conflict.js";
import type { CrossTeamCollaborationAdapter } from "../types/collaboration.js";
import type { TeamLifecycleEvents } from "../types/lifecycle.js";
import type { ExecutionPlanBuilder, SpecialistSelector } from "../types/plan.js";
import type { TeamLeadPolicy, TeamOrchestratorHooks } from "../types/policy.js";
import type { TeamProgressReporter } from "../types/progress.js";
import type { TeamReportBuilder } from "../types/report.js";
import type { TeamSession } from "../types/request.js";
import type { TeamSynthesizer } from "../types/synthesis.js";
import type { OrchestrateTeamInput, OrchestrateTeamResult, SpecialistRoster, SpecialistRuntimeFactory, TeamOrchestrator } from "./types.js";
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
export declare class DefaultTeamOrchestrator implements TeamOrchestrator {
    private session;
    private readonly deps;
    constructor(dependencies: TeamOrchestratorDependencies);
    getSession(): TeamSession | null;
    getOwner(): {
        type: "manager" | "director" | "vice_president" | "team" | "nordi";
        orgId: string;
        id?: string | undefined;
    } | null;
    reset(): void;
    orchestrate(input: OrchestrateTeamInput): Promise<OrchestrateTeamResult>;
    private executeDelegations;
    private escalate;
    private transition;
    private emit;
    private reportProgress;
}
export declare function createTeamOrchestrator(dependencies: TeamOrchestratorDependencies): TeamOrchestrator;
export declare class InMemorySpecialistRoster implements SpecialistRoster {
    private readonly specialists;
    constructor(specialists: Specialist[]);
    getSpecialists(orgId: string, teamId: string): Promise<Specialist[]>;
    getSpecialistById(orgId: string, specialistId: string): Promise<Specialist | undefined>;
}
export declare class SharedSpecialistRuntimeFactory implements SpecialistRuntimeFactory {
    private readonly runtime;
    constructor(runtime: SpecialistRuntime);
    forSpecialist(_specialist: Specialist): SpecialistRuntime;
}
