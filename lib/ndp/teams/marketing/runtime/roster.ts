import type { Specialist } from "@northbridge/workforce-contracts";
import {
  getManifestBySpecialistId,
  listEmployeeManifestsByTeam,
} from "@/lib/ndp/workforce/manifests";
import { MARKETING_TEAM_ID } from "../constants.js";

export function buildMarketingSpecialistRoster(orgId: string): Specialist[] {
  const manifests = listEmployeeManifestsByTeam(MARKETING_TEAM_ID);

  return manifests.map((manifest) => ({
    id: manifest.specialistId,
    orgId,
    teamId: MARKETING_TEAM_ID,
    specialistDefinitionId: manifest.specialistId,
    role: "specialist" as const,
    permissions: manifest.permissions,
    status: "active" as const,
  }));
}

export function getMarketingManifestForSpecialist(specialistId: string) {
  const manifest = getManifestBySpecialistId(specialistId);
  if (!manifest || !manifest.teamIds.includes(MARKETING_TEAM_ID)) {
    return undefined;
  }
  return manifest;
}
