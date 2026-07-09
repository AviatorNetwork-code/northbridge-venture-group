export function buildOrganizationHierarchy(input) {
    const teamNodes = input.teams.map((team) => ({
        teamId: team.id,
        teamLeadId: team.teamLeadId,
        specialistIds: [...team.specialistIds],
    }));
    return {
        orgId: input.orgId,
        version: input.version ?? 1,
        teams: teamNodes,
        generatedAt: input.generatedAt ?? new Date().toISOString(),
    };
}
export function mergeHierarchyLayers(base, layers, flags) {
    const next = { ...base };
    if (layers.managers?.length) {
        if (!flags.managersEnabled) {
            throw new Error("Cannot attach managers when managersEnabled is false");
        }
        next.managers = layers.managers;
    }
    if (layers.directors?.length) {
        if (!flags.directorsEnabled) {
            throw new Error("Cannot attach directors when directorsEnabled is false");
        }
        next.directors = layers.directors;
    }
    if (layers.vicePresidents?.length) {
        if (!flags.vpsEnabled) {
            throw new Error("Cannot attach vice presidents when vpsEnabled is false");
        }
        next.vicePresidents = layers.vicePresidents;
    }
    return next;
}
export function findTeamInHierarchy(hierarchy, teamId) {
    return hierarchy.teams.find((team) => team.teamId === teamId);
}
