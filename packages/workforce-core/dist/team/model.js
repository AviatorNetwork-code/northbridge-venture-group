export function createTeam(input) {
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
export function addSpecialistToTeam(team, specialistId) {
    if (team.specialistIds.includes(specialistId)) {
        return team;
    }
    return {
        ...team,
        specialistIds: [...team.specialistIds, specialistId],
        updatedAt: new Date().toISOString(),
    };
}
export function removeSpecialistFromTeam(team, specialistId) {
    return {
        ...team,
        specialistIds: team.specialistIds.filter((id) => id !== specialistId),
        updatedAt: new Date().toISOString(),
    };
}
export function suspendTeam(team, now) {
    return { ...team, status: "suspended", updatedAt: now ?? new Date().toISOString() };
}
export function deprovisionTeam(team, now) {
    return {
        ...team,
        status: "deprovisioned",
        updatedAt: now ?? new Date().toISOString(),
    };
}
