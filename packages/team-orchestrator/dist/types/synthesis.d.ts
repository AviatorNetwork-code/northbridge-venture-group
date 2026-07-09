import type { TeamConflict } from "./conflict.js";
import type { DelegationResult } from "./delegation.js";
import type { TeamRequest } from "./request.js";
export interface TeamSynthesisInput {
    request: TeamRequest;
    results: DelegationResult[];
    conflicts: TeamConflict[];
    now?: string;
}
export interface TeamSynthesisResult {
    summary: string;
    evidence: string[];
    contributingSpecialistIds: string[];
    conflictsResolved: TeamConflict[];
    synthesizedAt: string;
}
export interface TeamSynthesizer {
    synthesize(input: TeamSynthesisInput): Promise<TeamSynthesisResult>;
}
export declare class DefaultTeamSynthesizer implements TeamSynthesizer {
    synthesize(input: TeamSynthesisInput): Promise<TeamSynthesisResult>;
}
