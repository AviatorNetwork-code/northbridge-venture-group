import type { RequestOwner, TeamReport } from "@northbridge/workforce-contracts";
import type { TeamSession, TeamRequest } from "../types/request.js";
import type { TeamSynthesisResult } from "../types/synthesis.js";
import type { TeamEscalation } from "../types/escalation.js";
export type OrchestrateTeamOutcome = "complete" | "escalated" | "failed";
export interface OrchestrateTeamSuccess {
    outcome: "complete";
    session: TeamSession;
    owner: RequestOwner;
    synthesis: TeamSynthesisResult;
    report: TeamReport;
}
export interface OrchestrateTeamEscalated {
    outcome: "escalated";
    session: TeamSession;
    owner: RequestOwner;
    escalation: TeamEscalation;
}
export interface OrchestrateTeamFailed {
    outcome: "failed";
    session?: TeamSession;
    error: import("../runtime/errors.js").TeamOrchestratorError;
}
export type OrchestrateTeamResult = OrchestrateTeamSuccess | OrchestrateTeamEscalated | OrchestrateTeamFailed;
export interface OrchestrateTeamInput {
    request: TeamRequest;
    sessionId?: string;
    reportId?: string;
}
export interface TeamOrchestrator {
    getSession(): TeamSession | null;
    getOwner(): RequestOwner | null;
    orchestrate(input: OrchestrateTeamInput): Promise<OrchestrateTeamResult>;
    reset(): void;
}
export interface SpecialistRuntimeFactory {
    /** Returns a specialist runtime bound to the given specialist instance. */
    forSpecialist(specialist: import("@northbridge/workforce-contracts").Specialist): import("@northbridge/specialist-runtime").SpecialistRuntime;
}
export interface SpecialistRoster {
    /** Resolve specialist instances available to the team for delegation. */
    getSpecialists(orgId: string, teamId: string): Promise<import("@northbridge/workforce-contracts").Specialist[]>;
    getSpecialistById(orgId: string, specialistId: string): Promise<import("@northbridge/workforce-contracts").Specialist | undefined>;
}
