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

export function createTeam(input: CreateTeamInput): Team {
  if (input.teamLead.orgId !== input.orgId) {
    throw new Error("Team Lead orgId must match team orgId");
  }
  if (input.teamLead.teamId !== input.id) {
    throw new Error("Team Lead teamId must match team id");
  }

  const now = input.now ?? new Date().toISOString();
  return {
    id: input.id,
    orgId: input.orgId,
    teamProductId: input.teamProductId,
    name: input.name.trim(),
    status: "active",
    teamLeadId: input.teamLead.id,
    specialistIds: input.specialistIds ?? [],
    createdAt: now,
    updatedAt: now,
  };
}

export function addSpecialistToTeam(team: Team, specialistId: string): Team {
  if (team.specialistIds.includes(specialistId)) {
    return team;
  }
  return {
    ...team,
    specialistIds: [...team.specialistIds, specialistId],
    updatedAt: new Date().toISOString(),
  };
}

export function removeSpecialistFromTeam(
  team: Team,
  specialistId: string,
): Team {
  return {
    ...team,
    specialistIds: team.specialistIds.filter((id) => id !== specialistId),
    updatedAt: new Date().toISOString(),
  };
}

export function suspendTeam(team: Team, now?: string): Team {
  return { ...team, status: "suspended", updatedAt: now ?? new Date().toISOString() };
}

export function deprovisionTeam(team: Team, now?: string): Team {
  return {
    ...team,
    status: "deprovisioned",
    updatedAt: now ?? new Date().toISOString(),
  };
}
