import { createExampleMobileAuthenticationProvider } from "./auth.js";
import { buildMobileDashboardResponse } from "./dashboard-service.js";
import { createExampleMobileDashboardLoaders } from "./loaders.js";
import { createExampleOrganizationAccessResolver } from "./organization-access.js";
import type { MobileDashboardDependencies } from "./types.js";

export { buildMobileDashboardResponse } from "./dashboard-service.js";
export { parseMobileDashboardQuery } from "./http.js";
export { createExampleMobileAuthenticationProvider } from "./auth.js";
export { createExampleOrganizationAccessResolver } from "./organization-access.js";
export { createExampleMobileDashboardLoaders } from "./loaders.js";
export {
  InMemoryActiveTeamEntitlementsLoader,
  InMemoryFeatureFlagsLoader,
  InMemoryMobileOperationsIntelligenceLoader,
  InMemoryTeamOperationalReportsLoader,
} from "./loaders.js";
export {
  InMemoryMobileDashboardTelemetryEmitter,
  WorkforceMobileDashboardTelemetryEmitter,
} from "./observability.js";
export { MobileDashboardError, toMobileDashboardErrorBody } from "./errors.js";

export type {
  AuthenticatedMobileCustomer,
  BuildMobileDashboardInput,
  MobileAuthenticationProvider,
  MobileDashboardDependencies,
  MobileDashboardQuery,
  MobileDashboardResult,
  MobileDashboardTelemetryEmitter,
  MobileOperationsIntelligenceLoader,
  OrganizationAccessResolver,
  MOBILE_DASHBOARD_OIL_POLICY,
} from "./types.js";

export { MOBILE_DASHBOARD_OIL_POLICY } from "./types.js";

export function createExampleMobileDashboardDependencies(
  overrides?: Partial<MobileDashboardDependencies>,
): MobileDashboardDependencies {
  const loaders = createExampleMobileDashboardLoaders();

  return {
    authentication: createExampleMobileAuthenticationProvider(),
    organizationAccess: createExampleOrganizationAccessResolver(),
    entitlements: loaders.entitlements,
    teamReports: loaders.teamReports,
    operationsIntelligence: loaders.operationsIntelligence,
    featureFlags: loaders.featureFlags,
    includeDebugMetadata: false,
    ...overrides,
  };
}

export function createDefaultMobileDashboardDependencies(): MobileDashboardDependencies {
  return createExampleMobileDashboardDependencies();
}

export async function buildMobileDashboardResponseWithDefaults(
  input: Parameters<typeof buildMobileDashboardResponse>[0],
  overrides?: Partial<MobileDashboardDependencies>,
) {
  return buildMobileDashboardResponse(input, {
    ...createDefaultMobileDashboardDependencies(),
    ...overrides,
  });
}
