import type { Specialist } from "@northbridge/workforce-contracts";
import {
  getManifestBySpecialistId,
  listEmployeeManifestsByTeam,
} from "@/lib/ndp/workforce/manifests";
import { CUSTOMER_SERVICE_TEAM_ID } from "../constants.js";

export function buildCustomerServiceSpecialistRoster(orgId: string): Specialist[] {
  const manifests = listEmployeeManifestsByTeam(CUSTOMER_SERVICE_TEAM_ID);

  return manifests.map((manifest) => ({
    id: manifest.specialistId,
    orgId,
    teamId: CUSTOMER_SERVICE_TEAM_ID,
    specialistDefinitionId: manifest.specialistId,
    role: "specialist" as const,
    permissions: manifest.permissions,
    status: "active" as const,
  }));
}

export function getCustomerServiceManifestForSpecialist(specialistId: string) {
  const manifest = getManifestBySpecialistId(specialistId);
  if (!manifest || !manifest.teamIds.includes(CUSTOMER_SERVICE_TEAM_ID)) {
    return undefined;
  }
  return manifest;
}
