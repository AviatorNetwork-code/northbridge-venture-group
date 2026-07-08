import type {
  HirePricingSummary,
  HireSelection,
  SelectedSpecialist,
  WorkforceTier,
} from "@/lib/workforce/types";
import {
  getManagerById,
  getSpecialistById,
  getTeamById,
  managerCatalog,
  specialistCatalog,
} from "@/lib/workforce/catalog";

const ADDITIONAL_TASK_PRICE = 0.5;

export function getSpecialistPrice(catalogId: string, tier: WorkforceTier): number {
  const specialist = getSpecialistById(catalogId);
  if (!specialist) return 0;

  if (tier === "elite") return specialist.elitePrice;
  if (tier === "pro") return specialist.proPrice;
  return specialist.essentialPrice;
}

export function getSpecialistTasks(catalogId: string, tier: WorkforceTier): number {
  const specialist = getSpecialistById(catalogId);
  if (!specialist) return 0;

  if (tier === "elite") return specialist.eliteTasks;
  if (tier === "pro") return specialist.proTasks;
  return specialist.essentialTasks;
}

export function calculateHireTotals(selection: Pick<HireSelection, "specialists" | "teams" | "managers">) {
  let monthlySubscription = 0;
  let includedTeamTasks = 0;

  for (const selected of selection.specialists) {
    monthlySubscription += getSpecialistPrice(selected.catalogId, selected.tier);
    includedTeamTasks += getSpecialistTasks(selected.catalogId, selected.tier);
  }

  for (const teamId of selection.teams) {
    const team = getTeamById(teamId);
    if (team) {
      monthlySubscription += team.monthlyPrice;
      includedTeamTasks += team.teamTasks;
    }
  }

  for (const managerId of selection.managers) {
    const manager = getManagerById(managerId);
    if (manager) {
      monthlySubscription += manager.monthlyPrice;
      includedTeamTasks += manager.teamTasks;
    }
  }

  return { monthlySubscription, includedTeamTasks };
}

export function buildPricingSummary(
  selection: Pick<HireSelection, "specialists" | "teams" | "managers">,
): HirePricingSummary {
  const { monthlySubscription, includedTeamTasks } = calculateHireTotals(selection);
  const estimatedHoursSaved = Math.round(includedTeamTasks * 0.25);
  const laborSavings = estimatedHoursSaved * 35;
  const estimatedRoi =
    monthlySubscription > 0
      ? `${Math.round((laborSavings / monthlySubscription) * 100)}% estimated ROI`
      : "Add specialists to calculate ROI";

  let recommendedNextHire = "Start with 1–2 Specialists";

  if (selection.specialists.length >= 2 && selection.teams.length === 0) {
    recommendedNextHire = "Consider a Team when volume grows across multiple functions";
  } else if (selection.specialists.length >= 6 && selection.managers.length === 0) {
    recommendedNextHire = "Operations Manager when escalations increase";
  } else if (selection.teams.length > 0 && selection.managers.length === 0) {
    recommendedNextHire = "Wait on a Manager until Specialist workload justifies oversight";
  } else if (selection.managers.length > 0) {
    recommendedNextHire = "Measure performance before adding Regional Manager";
  }

  return {
    monthlySubscription,
    includedTeamTasks,
    additionalTaskPrice: ADDITIONAL_TASK_PRICE,
    estimatedHoursSaved,
    estimatedRoi,
    recommendedNextHire,
  };
}

export function upgradeTier(tier: WorkforceTier): WorkforceTier {
  if (tier === "essential") return "pro";
  if (tier === "pro") return "elite";
  return "elite";
}

export function downgradeTier(tier: WorkforceTier): WorkforceTier {
  if (tier === "elite") return "pro";
  if (tier === "pro") return "essential";
  return "essential";
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function shouldRecommendManager(specialistCount: number): boolean {
  const opsManager = managerCatalog.find((m) => m.id === "operations-manager");
  return specialistCount >= (opsManager?.minSpecialists ?? 8);
}

export function defaultSelectedSpecialists(ids: string[]): SelectedSpecialist[] {
  return ids.map((catalogId) => ({ catalogId, tier: "essential" as const }));
}

export function specialistCountForComparison(): Array<{
  id: string;
  name: string;
  essential: string;
  pro: string;
  elite: string;
  tasks: string;
}> {
  return specialistCatalog.map((specialist) => ({
    id: specialist.id,
    name: specialist.name,
    essential: formatCurrency(specialist.essentialPrice),
    pro: formatCurrency(specialist.proPrice),
    elite: formatCurrency(specialist.elitePrice),
    tasks: `${specialist.essentialTasks} / ${specialist.proTasks} / ${specialist.eliteTasks}`,
  }));
}
