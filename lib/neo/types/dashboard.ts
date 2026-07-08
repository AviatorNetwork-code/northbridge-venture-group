import type { SystemHealth } from "./common";

export interface KpiMetric {
  id: string;
  label: string;
  value: number | string;
  unit?: string;
  trend?: number;
  trendLabel?: string;
  format?: "number" | "currency" | "percent" | "duration";
}

export interface ExecutiveDashboard {
  kpis: KpiMetric[];
  activeSpecialists: number;
  activeManagers: number;
  runningWorkflows: number;
  waitingApprovals: number;
  connectedIntegrations: number;
  customerConversations: number;
  revenueMtd: number;
  revenueTrend: number;
  systemHealth: SystemHealth;
  lastUpdated: string;
}
