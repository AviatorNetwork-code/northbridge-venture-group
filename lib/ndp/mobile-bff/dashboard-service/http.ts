import type { MobileDashboardQuery } from "./types.js";

function parseBoolean(value: string | null): boolean | undefined {
  if (value === null) return undefined;
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
}

export function parseMobileDashboardQuery(
  searchParams: URLSearchParams,
): MobileDashboardQuery {
  return {
    organizationId: searchParams.get("organizationId") ?? "",
    locale: searchParams.get("locale") ?? undefined,
    timezone: searchParams.get("timezone") ?? undefined,
    appVersion: searchParams.get("appVersion") ?? undefined,
    dashboardVersion: searchParams.get("dashboardVersion") ?? undefined,
    includePlaceholders: parseBoolean(searchParams.get("includePlaceholders")),
  };
}
