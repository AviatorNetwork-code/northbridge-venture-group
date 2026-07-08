import type { WorkflowStatus } from "./common";

export interface WorkflowTask {
  id: string;
  title: string;
  assignee: string;
  status: "pending" | "running" | "completed" | "blocked";
  startedAt?: string;
  completedAt?: string;
}

export interface WorkflowApproval {
  id: string;
  title: string;
  requestedBy: string;
  waitingSince: string;
  priority: "low" | "medium" | "high";
}

export interface WorkflowEscalation {
  id: string;
  title: string;
  reason: string;
  escalatedAt: string;
  assignee: string;
}

export interface WorkflowEvent {
  id: string;
  type:
    | "task_started"
    | "task_completed"
    | "approval_requested"
    | "escalated"
    | "blocked"
    | "resolved";
  message: string;
  timestamp: string;
  workflowId: string;
}

export interface WorkflowItem {
  id: string;
  name: string;
  status: WorkflowStatus;
  owner: string;
  startedAt: string;
  progress: number;
  tasks: WorkflowTask[];
  approvals: WorkflowApproval[];
  escalations: WorkflowEscalation[];
  history: WorkflowEvent[];
}

export interface WorkflowCenterSnapshot {
  workflows: WorkflowItem[];
  eventStream: WorkflowEvent[];
  lastUpdated: string;
}
