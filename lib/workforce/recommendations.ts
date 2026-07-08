import { buildRecommendations } from "@/lib/cat/knowledge";
import type { BusinessProfile } from "@/lib/cat/types";
import {
  getSpecialistById,
  getTeamForIndustry,
  managerCatalog,
  specialistCatalog,
} from "@/lib/workforce/catalog";
import type { SelectedSpecialist, WorkforceTier } from "@/lib/workforce/types";

export type HireRecommendation = {
  specialistIds: string[];
  teamId?: string;
  managerIds: string[];
  connectorNames: string[];
  catSummary: string;
  deferredItems: Array<{ name: string; reason: string }>;
  optionalItems: Array<{ name: string; reason: string }>;
};

const CAT_NAME_TO_CATALOG_ID: Record<string, string> = {
  "appointment specialist": "scheduling",
  "scheduling specialist": "scheduling",
  "customer service specialist": "customer-service",
  "billing specialist": "finance",
  "finance specialist": "finance",
  "onboarding specialist": "hr",
  "workflow specialist": "customer-service",
  "sales specialist": "sales",
  "marketing specialist": "marketing",
  "inventory specialist": "inventory",
  "hr specialist": "hr",
};

function mapSpecialistNameToCatalogId(name: string): string | undefined {
  const normalized = name.toLowerCase();
  const direct = CAT_NAME_TO_CATALOG_ID[normalized];
  if (direct) return direct;

  const byCatId = specialistCatalog.find((specialist) =>
    specialist.catIds.some((catId) => normalized.includes(catId.replace("-", " "))),
  );
  return byCatId?.id;
}

export function getHireRecommendations(profile: BusinessProfile): HireRecommendation {
  const catRecommendations = buildRecommendations(profile);
  const industry = (profile.industry ?? "general").toLowerCase();

  const specialistIds: string[] = [];
  const deferredItems: HireRecommendation["deferredItems"] = [];
  const optionalItems: HireRecommendation["optionalItems"] = [];
  const connectorNames: string[] = [];
  let teamId: string | undefined;
  const managerIds: string[] = [];

  for (const rec of catRecommendations) {
    if (rec.tier === "specialist" && rec.status === "recommended") {
      const catalogId = mapSpecialistNameToCatalogId(rec.name);
      if (catalogId && !specialistIds.includes(catalogId)) {
        specialistIds.push(catalogId);
      }
    }

    if (rec.tier === "specialist" && rec.status === "optional") {
      optionalItems.push({ name: rec.name, reason: rec.reason });
    }

    if (rec.tier === "team") {
      if (rec.status === "optional") {
        optionalItems.push({ name: rec.name, reason: rec.reason });
        const team = getTeamForIndustry(industry);
        teamId = team?.id;
      } else if (rec.status === "not-recommended") {
        deferredItems.push({ name: rec.name, reason: rec.reason });
      }
    }

    if (rec.tier === "manager" || rec.tier === "regional-manager") {
      if (rec.status === "not-recommended") {
        deferredItems.push({ name: rec.name, reason: rec.reason });
      } else if (rec.status === "optional") {
        optionalItems.push({ name: rec.name, reason: rec.reason });
      }
    }

    if (rec.tier === "connector" && rec.status === "recommended") {
      connectorNames.push(rec.name);
    }
  }

  if (specialistIds.length === 0) {
    specialistIds.push("customer-service");
    if (industry === "dental" || industry === "healthcare") {
      specialistIds.push("scheduling");
    }
  }

  const catSummaryLines = [
    "I recommend starting with:",
    ...specialistIds.map((id) => {
      const specialist = getSpecialistById(id);
      return `✓ ${specialist?.name ?? id}`;
    }),
  ];

  if (profile.employeeCount && profile.employeeCount < 15) {
    catSummaryLines.push(
      "",
      `Your ${profile.industry ?? "business"} is still small.`,
      "A Manager is not recommended yet.",
      "Once your appointment volume increases we can revisit that.",
    );
  }

  if (deferredItems.length > 0) {
    catSummaryLines.push("", "Not recommended yet:");
    for (const item of deferredItems) {
      catSummaryLines.push(`✗ ${item.name} — ${item.reason}`);
    }
  }

  return {
    specialistIds,
    teamId: profile.employeeCount && profile.employeeCount >= 15 ? teamId : undefined,
    managerIds,
    connectorNames,
    catSummary: catSummaryLines.join("\n"),
    deferredItems,
    optionalItems,
  };
}

export function recommendationsToSelection(
  recommendations: HireRecommendation,
  tier: WorkforceTier = "essential",
): SelectedSpecialist[] {
  return recommendations.specialistIds.map((catalogId) => ({ catalogId, tier }));
}

export function buildCatHirePanelMessage(profile: BusinessProfile): string {
  return getHireRecommendations(profile).catSummary;
}
