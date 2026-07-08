export interface AnalyticsDataPoint {
  label: string;
  value: number;
}

export interface AnalyticsSnapshot {
  workflowsPerDay: AnalyticsDataPoint[];
  automationPercent: number;
  avgResponseTimeMinutes: number;
  tasksCompleted: AnalyticsDataPoint[];
  specialistUtilization: AnalyticsDataPoint[];
  connectorHealth: AnalyticsDataPoint[];
  conversationVolume: AnalyticsDataPoint[];
  customerSatisfaction: number;
  lastUpdated: string;
}
