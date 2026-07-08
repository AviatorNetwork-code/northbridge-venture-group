import type { WorkforceStatus } from "./common";

export interface WorkforceMember {
  id: string;
  name: string;
  role: "specialist" | "manager";
  department: string;
  status: WorkforceStatus;
  currentAssignment?: string;
  queueSize: number;
  tasksCompleted24h: number;
  avgResponseMinutes: number;
  utilizationPercent: number;
  managerId?: string;
}

export interface WorkforceSnapshot {
  members: WorkforceMember[];
  orgChart: OrgNode[];
  lastUpdated: string;
}

export interface OrgNode {
  id: string;
  name: string;
  role: string;
  department: string;
  status: WorkforceStatus;
  children: string[];
}
