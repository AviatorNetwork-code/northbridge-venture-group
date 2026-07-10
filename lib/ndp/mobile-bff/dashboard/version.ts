import { DASHBOARD_MODEL_VERSION } from "@/lib/ndp/dashboard";

export const DASHBOARD_BFF_API_VERSION = "1.0.0";
export const DASHBOARD_BFF_SCHEMA_VERSION = "1.0.0";

export const SUPPORTED_API_VERSIONS = [DASHBOARD_BFF_API_VERSION] as const;
export const SUPPORTED_DASHBOARD_VERSIONS = [DASHBOARD_MODEL_VERSION] as const;

export type SupportedApiVersion = (typeof SUPPORTED_API_VERSIONS)[number];
export type SupportedDashboardVersion = (typeof SUPPORTED_DASHBOARD_VERSIONS)[number];

export function isSupportedApiVersion(value: string): value is SupportedApiVersion {
  return (SUPPORTED_API_VERSIONS as readonly string[]).includes(value);
}

export function isSupportedDashboardVersion(value: string): value is SupportedDashboardVersion {
  return (SUPPORTED_DASHBOARD_VERSIONS as readonly string[]).includes(value);
}
