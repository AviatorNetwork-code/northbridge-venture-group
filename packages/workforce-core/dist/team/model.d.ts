import type { Team, TeamLead } from "@northbridge/workforce-contracts";
export interface CreateTeamInput {
    id: string;
    orgId: string;
    teamProductId: string;
    name: string;
    teamLead: TeamLead;
    specialistIds?: string[];
    now?: string;
}
export declare function createTeam(input: CreateTeamInput): Team;
export declare function addSpecialistToTeam(team: Team, specialistId: string): Team;
export declare function removeSpecialistFromTeam(team: Team, specialistId: string): Team;
export declare function suspendTeam(team: Team, now?: string): Team;
export declare function deprovisionTeam(team: Team, now?: string): Team;
