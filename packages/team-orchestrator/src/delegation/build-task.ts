import type { Specialist, Task } from "@northbridge/workforce-contracts";
import type { PlannedTask } from "../types/plan.js";
import type { TeamRequest } from "../types/request.js";

export function buildDelegatedTask(
  request: TeamRequest,
  planned: PlannedTask,
  specialist: Specialist,
  now: string,
): Task {
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
