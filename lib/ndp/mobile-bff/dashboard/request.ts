export interface DashboardRequest {
  organizationId: string;
  customerId: string;
  activeTeamIds: string[];
  locale?: string;
  timezone?: string;
  appVersion?: string;
  dashboardVersionRequested?: string;
  featureFlags?: Record<string, boolean>;
  includePlaceholders?: boolean;
  includeDebugMetadata?: boolean;
}

export const DEFAULT_DASHBOARD_REQUEST_LOCALE = "en-US";
