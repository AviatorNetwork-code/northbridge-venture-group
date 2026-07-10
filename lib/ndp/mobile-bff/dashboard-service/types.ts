import type { OrganizationIntelligenceContext } from "@northbridge/operations-intelligence";
import type { DashboardResponse } from "@/lib/ndp/mobile-bff/dashboard";
import type { OrganizationAccessResolution } from "./organization-access.js";

export interface AuthenticatedMobileCustomer {
  customerId: string;
  sessionId: string;
  displayName?: string;
}

export interface MobileAuthRequestContext {
  authorizationHeader?: string | null;
  correlationId: string;
}

export interface MobileAuthenticationProvider {
  authenticate(
    context: MobileAuthRequestContext,
  ): Promise<AuthenticatedMobileCustomer | null>;
}

export interface MobileOrganizationAccess {
  organizationId: string;
  customerId: string;
}

export interface OrganizationAccessResolver {
  resolve(input: {
    customerId: string;
    organizationId: string;
  }): Promise<OrganizationAccessResolution>;
}

export interface ActiveTeamEntitlementsLoader {
  load(input: {
    customerId: string;
    organizationId: string;
  }): Promise<string[]>;
}

export interface TeamOperationalReportsLoader {
  load(input: {
    organizationId: string;
    customerId: string;
    activeTeamIds: string[];
  }): Promise<unknown[]>;
}

export interface MobileOperationsIntelligenceLoader {
  load(input: {
    organizationId: string;
    customerId: string;
  }): Promise<OrganizationIntelligenceContext | null>;
}

export interface FeatureFlagsLoader {
  load(input: {
    customerId: string;
    organizationId: string;
  }): Promise<Record<string, boolean>>;
}

export interface MobileDashboardQuery {
  organizationId: string;
  locale?: string;
  timezone?: string;
  appVersion?: string;
  dashboardVersion?: string;
  includePlaceholders?: boolean;
}

export interface BuildMobileDashboardInput {
  correlationId: string;
  authorizationHeader?: string | null;
  query: MobileDashboardQuery;
  now?: string;
}

export interface MobileDashboardDependencies {
  authentication: MobileAuthenticationProvider;
  organizationAccess: OrganizationAccessResolver;
  entitlements: ActiveTeamEntitlementsLoader;
  teamReports: TeamOperationalReportsLoader;
  operationsIntelligence: MobileOperationsIntelligenceLoader;
  featureFlags: FeatureFlagsLoader;
  telemetry?: MobileDashboardTelemetryEmitter;
  includeDebugMetadata?: boolean;
}

export interface MobileDashboardSuccess {
  ok: true;
  status: 200;
  body: DashboardResponse;
  serialized: string;
}

export interface MobileDashboardFailure {
  ok: false;
  status: number;
  body: MobileDashboardErrorBody;
}

export type MobileDashboardResult = MobileDashboardSuccess | MobileDashboardFailure;

export interface MobileDashboardErrorBody {
  error: {
    code: string;
    message: string;
    correlationId: string;
    supportedDashboardVersions?: string[];
  };
}

export interface MobileDashboardTelemetryEmitter {
  emit(event: MobileDashboardTelemetryEvent): Promise<void>;
}

export interface MobileDashboardTelemetryEvent {
  phase:
    | "mobile_dashboard_requested"
    | "mobile_dashboard_authorized"
    | "mobile_dashboard_built"
    | "mobile_dashboard_failed";
  correlationId: string;
  organizationId?: string;
  customerId?: string;
  durationMs?: number;
  status: "completed" | "failed" | "denied" | "unauthorized";
  metadata?: Record<string, unknown>;
}

export const MOBILE_DASHBOARD_OIL_POLICY = {
  allowMissingOperationsIntelligence: true,
} as const;
