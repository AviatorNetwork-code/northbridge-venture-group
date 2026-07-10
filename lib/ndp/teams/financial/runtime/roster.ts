import type { Specialist } from "@northbridge/workforce-contracts";
import {
  getManifestBySpecialistId,
  listEmployeeManifestsByTeam,
} from "@/lib/ndp/workforce/manifests";
import { FINANCIAL_TEAM_ID } from "../constants.js";

export function buildFinancialSpecialistRoster(orgId: string): Specialist[] {
  const manifests = listEmployeeManifestsByTeam(FINANCIAL_TEAM_ID);

  return manifests.map((manifest) => ({
    id: manifest.specialistId,
    orgId,
    teamId: FINANCIAL_TEAM_ID,
    specialistDefinitionId: manifest.specialistId,
    role: "specialist" as const,
    permissions: manifest.permissions,
    status: "active" as const,
  }));
}

export function getFinancialManifestForSpecialist(specialistId: string) {
  const manifest = getManifestBySpecialistId(specialistId);
  if (!manifest || !manifest.teamIds.includes(FINANCIAL_TEAM_ID)) {
    return undefined;
  }
  return manifest;
}
