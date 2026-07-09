export function createAssignment(input) {
    return {
        id: input.id,
        orgId: input.orgId,
        assigneeRole: input.assigneeRole,
        assigneeId: input.assigneeId,
        scopeType: input.scopeType,
        scopeId: input.scopeId,
        effectiveFrom: input.effectiveFrom ?? new Date().toISOString(),
        effectiveTo: input.effectiveTo,
    };
}
export function isAssignmentActive(assignment, at = new Date().toISOString()) {
    if (assignment.effectiveFrom > at) {
        return false;
    }
    if (assignment.effectiveTo && assignment.effectiveTo <= at) {
        return false;
    }
    return true;
}
export function listActiveAssignments(assignments, filters) {
    const at = filters?.at ?? new Date().toISOString();
    return assignments.filter((assignment) => {
        if (filters?.orgId && assignment.orgId !== filters.orgId)
            return false;
        if (filters?.assigneeRole && assignment.assigneeRole !== filters.assigneeRole) {
            return false;
        }
        if (filters?.scopeType && assignment.scopeType !== filters.scopeType) {
            return false;
        }
        if (filters?.scopeId && assignment.scopeId !== filters.scopeId)
            return false;
        return isAssignmentActive(assignment, at);
    });
}
export function assertRoleTierEnabled(role, flags) {
    if (role === "manager" && !flags.managersEnabled) {
        throw new Error("Manager tier is not enabled for this organization");
    }
    if (role === "director" && !flags.directorsEnabled) {
        throw new Error("Director tier is not enabled for this organization");
    }
    if (role === "vice_president" && !flags.vpsEnabled) {
        throw new Error("Vice President tier is not enabled for this organization");
    }
}
