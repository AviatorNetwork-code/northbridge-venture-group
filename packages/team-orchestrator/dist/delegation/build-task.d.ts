import type { Specialist, Task } from "@northbridge/workforce-contracts";
import type { PlannedTask } from "../types/plan.js";
import type { TeamRequest } from "../types/request.js";
export declare function buildDelegatedTask(request: TeamRequest, planned: PlannedTask, specialist: Specialist, now: string): Task;
