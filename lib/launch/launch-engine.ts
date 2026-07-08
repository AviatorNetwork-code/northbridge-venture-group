import { buildRecommendations as buildCatRecommendations } from "@/lib/cat/knowledge";
import type { BusinessProfile } from "@/lib/cat/types";
import type { ConnectorInstance } from "@/lib/connectors/connector-types";
import {
  buildOnboardingConnectorSummary,
  getRecommendedConnectorIds,
} from "@/lib/connectors/connector-recommendations";
import { summarizeConnectorHealth } from "@/lib/connectors/connector-health";
import {
  getManagerById,
  getSpecialistById,
  getTeamById,
  specialistCatalog,
} from "@/lib/workforce/catalog";
import { getHireRecommendations } from "@/lib/workforce/recommendations";
import type { HireSelection } from "@/lib/workforce/types";
import {
  calculateLaunchScores,
  estimateGoLive,
  resolveLaunchStatus,
} from "@/lib/launch/launch-score";
import type {
  LaunchAssessment,
  LaunchBlocker,
  LaunchChecklistItem,
  LaunchRecommendation,
} from "@/lib/launch/launch-types";

export type LaunchEngineInput = {
  profile: BusinessProfile;
  hireSelection: HireSelection | null;
  connectorInstances: ConnectorInstance[];
};

function buildBusinessSummary(profile: BusinessProfile) {
  const fields = [
    profile.industry,
    profile.employeeCount,
    profile.communicationChannels?.length,
    profile.existingSoftware?.length,
  ];
  const filled = fields.filter(Boolean).length;

  return {
    industry: profile.industry,
    employees: profile.employeeCount,
    locations: profile.employeeCount && profile.employeeCount > 25 ? 2 : 1,
    communicationChannels: profile.communicationChannels ?? [],
    currentSoftware: profile.existingSoftware ?? [],
    profileComplete: filled >= 3,
  };
}

function buildWorkforceSummary(hireSelection: HireSelection | null, profile: BusinessProfile) {
  const hireRecs = getHireRecommendations(profile);
  const specialists =
    hireSelection?.specialists.map((selected) => {
      const specialist = getSpecialistById(selected.catalogId);
      return { name: specialist?.name ?? selected.catalogId, tier: selected.tier };
    }) ?? [];

  const teams = hireSelection?.teams.map((id) => getTeamById(id)?.name ?? id) ?? [];
  const managers = hireSelection?.managers.map((id) => getManagerById(id)?.name ?? id) ?? [];

  const hiredIds = new Set(hireSelection?.specialists.map((s) => s.catalogId) ?? []);
  const missingCapabilities = hireRecs.specialistIds
    .filter((id) => !hiredIds.has(id))
    .map((id) => getSpecialistById(id)?.name ?? id);

  const futureHires: string[] = [];
  if (hireRecs.deferredItems.length > 0) {
    futureHires.push(...hireRecs.deferredItems.map((item) => item.name));
  }
  if (hireRecs.optionalItems.length > 0) {
    futureHires.push(...hireRecs.optionalItems.slice(0, 2).map((item) => item.name));
  }

  const coveragePercent =
    hireRecs.specialistIds.length > 0
      ? Math.round((specialists.length / hireRecs.specialistIds.length) * 100)
      : specialists.length > 0
        ? 100
        : 0;

  return {
    specialists,
    teams,
    managers,
    missingCapabilities,
    futureHires,
    coveragePercent,
  };
}

function buildConnectorLaunchSummary(
  instances: ConnectorInstance[],
  profile: BusinessProfile,
) {
  const summary = buildOnboardingConnectorSummary(instances, profile);
  const health = summarizeConnectorHealth(instances);
  const { recommended, optional } = getRecommendedConnectorIds(profile);

  const connected = instances
    .filter((item) => item.status === "connected" || item.status === "syncing")
    .map((item) => item.name);

  const missing = instances
    .filter(
      (item) =>
        recommended.includes(item.id) &&
        item.status !== "connected" &&
        item.status !== "syncing",
    )
    .map((item) => item.name);

  const optionalNames = instances
    .filter((item) => optional.includes(item.id))
    .map((item) => item.name);

  const launchImpact =
    missing.length === 0
      ? "All recommended connectors are connected."
      : `${missing.length} recommended connector${missing.length === 1 ? "" : "s"} needed for full launch.`;

  return {
    connected,
    recommended: recommended.map((id) => instances.find((i) => i.id === id)?.name ?? id),
    optional: optionalNames,
    missing,
    health: health.avgHealth,
    lastSync: health.lastSyncLabel,
    launchImpact,
  };
}

function buildChecklist(
  instances: ConnectorInstance[],
  hireSelection: HireSelection | null,
  profile: BusinessProfile,
): LaunchChecklistItem[] {
  const items: LaunchChecklistItem[] = [];
  const { recommended } = getRecommendedConnectorIds(profile);
  const hireRecs = getHireRecommendations(profile);

  for (const connectorId of recommended) {
    const instance = instances.find((item) => item.id === connectorId);
    const connected = instance?.status === "connected" || instance?.status === "syncing";
    items.push({
      id: `connector-${connectorId}`,
      label: instance?.name ?? connectorId,
      complete: connected,
      category: "connector",
      impact: ["gmail", "google-calendar"].includes(connectorId) ? "critical" : "recommended",
    });
  }

  for (const specialistId of hireRecs.specialistIds) {
    const specialist = getSpecialistById(specialistId);
    const hired = hireSelection?.specialists.some((s) => s.catalogId === specialistId);
    items.push({
      id: `workforce-${specialistId}`,
      label: specialist?.name ?? specialistId,
      complete: Boolean(hired),
      category: "workforce",
      impact: "recommended",
    });
  }

  if (profile.industry) {
    items.push({
      id: "business-profile",
      label: "Business profile discovered",
      complete: true,
      category: "business",
      impact: "recommended",
    });
  }

  return items;
}

function buildBlockers(
  checklist: LaunchChecklistItem[],
  workforce: ReturnType<typeof buildWorkforceSummary>,
): { blockers: LaunchBlocker[]; warnings: LaunchBlocker[] } {
  const blockers: LaunchBlocker[] = [];
  const warnings: LaunchBlocker[] = [];

  if (workforce.specialists.length === 0) {
    blockers.push({
      id: "no-workforce",
      label: "No Specialists hired",
      reason: "Hire at least one Specialist before launch.",
      severity: "critical",
    });
  }

  for (const item of checklist) {
    if (!item.complete && item.impact === "critical") {
      blockers.push({
        id: `blocker-${item.id}`,
        label: `${item.label} not connected`,
        reason: `Connect ${item.label} to enable core operations.`,
        severity: "critical",
      });
    } else if (!item.complete && item.impact === "recommended") {
      warnings.push({
        id: `warning-${item.id}`,
        label: `${item.label} pending`,
        reason: `Launch possible with limited functionality without ${item.label}.`,
        severity: "warning",
      });
    }
  }

  return { blockers, warnings };
}

function buildLaunchRecommendations(
  profile: BusinessProfile,
  workforce: ReturnType<typeof buildWorkforceSummary>,
  connectors: ReturnType<typeof buildConnectorLaunchSummary>,
): LaunchRecommendation[] {
  const recs: LaunchRecommendation[] = [];
  const catRecs = buildCatRecommendations(profile);

  if (connectors.missing.length > 0) {
    recs.push({
      id: "connect-next",
      label: `Connect ${connectors.missing[0]} first`,
      reason: "Highest-impact missing connector for your business.",
      canWait: false,
    });
  }

  for (const item of catRecs) {
    if (item.tier === "manager" && item.status === "not-recommended") {
      recs.push({
        id: "no-manager",
        label: "Manager not recommended yet",
        reason: item.reason,
        canWait: true,
      });
    }
  }

  if (workforce.missingCapabilities.length > 0) {
    recs.push({
      id: "hire-missing",
      label: `Consider ${workforce.missingCapabilities[0]}`,
      reason: "Recommended specialist not yet in your workforce.",
      canWait: true,
    });
  }

  if (connectors.optional.includes("HubSpot")) {
    recs.push({
      id: "skip-hubspot",
      label: "HubSpot can wait",
      reason: "CRM is optional for your current launch scope.",
      canWait: true,
    });
  }

  return recs;
}

function buildCatSummary(
  scores: LaunchAssessment["scores"],
  status: LaunchAssessment["status"],
  blockers: LaunchBlocker[],
  warnings: LaunchBlocker[],
  recommendations: LaunchRecommendation[],
): string {
  const lines = [
    `Your launch score is **${scores.overall}%** — status: **${status.replace("-", " ")}**.`,
    "",
  ];

  if (blockers.length > 0) {
    lines.push("**Blocking launch:**");
    for (const blocker of blockers) {
      lines.push(`✗ ${blocker.label} — ${blocker.reason}`);
    }
    lines.push("");
  }

  if (warnings.length > 0) {
    lines.push("**Can launch with limitations:**");
    for (const warning of warnings.slice(0, 3)) {
      lines.push(`○ ${warning.label} — ${warning.reason}`);
    }
    lines.push("");
  }

  if (recommendations.length > 0) {
    lines.push("**CAT guidance:**");
    for (const rec of recommendations.slice(0, 4)) {
      const prefix = rec.canWait ? "○" : "✓";
      lines.push(`${prefix} ${rec.label} — ${rec.reason}`);
    }
  }

  lines.push("", "I recommend the minimum to launch — never oversell.");

  return lines.join("\n");
}

export function buildLaunchAssessment(input: LaunchEngineInput): LaunchAssessment {
  const { profile, hireSelection, connectorInstances } = input;
  const business = buildBusinessSummary(profile);
  const workforce = buildWorkforceSummary(hireSelection, profile);
  const connectors = buildConnectorLaunchSummary(connectorInstances, profile);
  const hireRecs = getHireRecommendations(profile);
  const checklist = buildChecklist(connectorInstances, hireSelection, profile);
  const { blockers, warnings } = buildBlockers(checklist, workforce);

  const businessFieldsTotal = 4;
  const businessFieldsFilled = [
    business.industry,
    business.employees,
    business.communicationChannels.length > 0,
    business.currentSoftware.length > 0,
  ].filter(Boolean).length;

  const connectorsConnected = connectors.connected.filter((name) =>
    connectors.recommended.includes(name),
  ).length;

  const scores = calculateLaunchScores({
    businessComplete: business.profileComplete,
    businessFieldsFilled,
    businessFieldsTotal,
    connectorsConnected,
    connectorsRecommended: Math.max(connectors.recommended.length, 1),
    workforceSpecialists: workforce.specialists.length,
    workforceRecommended: Math.max(hireRecs.specialistIds.length, 1),
    criticalBlockers: blockers.length,
  });

  const status = resolveLaunchStatus(scores.overall, blockers.length);
  const recommendations = buildLaunchRecommendations(profile, workforce, connectors);
  const catSummary = buildCatSummary(scores, status, blockers, warnings, recommendations);

  const completeCount = checklist.filter((item) => item.complete).length;
  const launchMessage =
    status === "ready"
      ? "Your AI Workforce can begin working today."
      : status === "nearly-ready"
        ? `Ready to launch with ${completeCount} of ${checklist.length} items complete. Minor setup remaining.`
        : status === "needs-attention"
          ? `Ready to launch with limited functionality. ${warnings.length} items can wait.`
          : "Resolve critical blockers before launch.";

  return {
    status,
    scores,
    estimatedGoLive: estimateGoLive(status, scores.overall),
    blockers,
    warnings,
    recommendations,
    checklist,
    business,
    workforce,
    connectors,
    catSummary,
    launchMessage,
  };
}

export function getDefaultWorkforceIfEmpty(hireSelection: HireSelection | null, profile: BusinessProfile): HireSelection | null {
  if (hireSelection && hireSelection.specialists.length > 0) return hireSelection;

  const recs = getHireRecommendations(profile);
  if (recs.specialistIds.length === 0) return hireSelection;

  return {
    specialists: recs.specialistIds.map((catalogId) => ({ catalogId, tier: "essential" })),
    teams: [],
    managers: [],
    connectors: recs.connectorNames,
    businessProfile: profile,
    estimatedMonthly: 0,
    totalTeamTasks: 0,
    createdAt: new Date().toISOString(),
  };
}

export function getCoverageMap(specialists: string[]) {
  return specialistCatalog.map((specialist) => ({
    name: specialist.name,
    covered: specialists.some((name) => name.includes(specialist.name.split(" ")[0])),
  }));
}
