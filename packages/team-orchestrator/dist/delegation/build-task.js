export function buildDelegatedTask(request, planned, specialist, now) {
    return {
        id: `task-${request.id}-${planned.planTaskId}`,
        orgId: request.orgId,
        teamId: request.teamId,
        specialistId: specialist.id,
        assignedByTeamLeadId: request.teamLeadId,
        status: "pending",
        permissions: specialist.permissions,
        context: {
            ...planned.instructions,
            teamRequestId: request.id,
            topicKey: planned.topicKey,
        },
        customerThreadRef: request.customerThreadRef,
        createdAt: now,
        updatedAt: now,
    };
}
