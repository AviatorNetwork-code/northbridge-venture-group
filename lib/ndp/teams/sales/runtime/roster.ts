import type { Specialist } from "@northbridge/workforce-contracts";
import {
  getManifestBySpecialistId,
  listEmployeeManifestsByTeam,
} from "@/lib/ndp/workforce/manifests";
import { SALES_TEAM_ID } from "../constants.js";

export function buildSalesSpecialistRoster(orgId: string): Specialist[] {
  const manifests = listEmployeeManifestsByTeam(SALES_TEAM_ID);

  return manifests.map((manifest) => ({
    id: manifest.specialistId,
    orgId,
    teamId: SALES_TEAM_ID,
    specialistDefinitionId: manifest.specialistId,
    role: "specialist" as const,
    permissions: manifest.permissions,
    status: "active" as const,
  }));
}

export function getSalesManifestForSpecialist(specialistId: string) {
  const manifest = getManifestBySpecialistId(specialistId);
  if (!manifest || !manifest.teamIds.includes(SALES_TEAM_ID)) {
    return undefined;
  }
  return manifest;
}
