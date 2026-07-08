import type { HireSelection } from "@/lib/workforce/types";
import { HIRE_STORAGE_KEY } from "@/lib/workforce/types";
import { buildPricingSummary, calculateHireTotals } from "@/lib/workforce/pricing";
import {
  getManagerById,
  getSpecialistById,
  getTeamById,
} from "@/lib/workforce/catalog";

export function saveHireSelection(selection: Omit<HireSelection, "estimatedMonthly" | "totalTeamTasks" | "createdAt">) {
  const totals = calculateHireTotals(selection);
  const payload: HireSelection = {
    ...selection,
    estimatedMonthly: totals.monthlySubscription,
    totalTeamTasks: totals.includedTeamTasks,
    createdAt: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    window.localStorage.setItem(HIRE_STORAGE_KEY, JSON.stringify(payload));
  }

  return payload;
}

export function loadHireSelection(): HireSelection | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(HIRE_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as HireSelection;
  } catch {
    return null;
  }
}

export function clearHireSelection() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(HIRE_STORAGE_KEY);
  }
}

export function buildOnboardingTransferSummary(selection: HireSelection) {
  const pricing = buildPricingSummary(selection);

  const specialists = selection.specialists.map((selected) => {
    const specialist = getSpecialistById(selected.catalogId);
    return {
      name: specialist?.name ?? selected.catalogId,
      tier: selected.tier,
    };
  });

  const teams = selection.teams.map((teamId) => getTeamById(teamId)?.name ?? teamId);
  const managers = selection.managers.map((managerId) => getManagerById(managerId)?.name ?? managerId);

  const baseReadiness = 30;
  const specialistBonus = selection.specialists.length * 8;
  const teamBonus = selection.teams.length * 10;
  const connectorBonus = selection.connectors.length * 5;
  const estimatedReadiness = Math.min(95, baseReadiness + specialistBonus + teamBonus + connectorBonus);

  return {
    specialists,
    teams,
    managers,
    connectors: selection.connectors,
    estimatedReadiness,
    monthlySubscription: pricing.monthlySubscription,
    includedTeamTasks: pricing.includedTeamTasks,
    estimatedHoursSaved: pricing.estimatedHoursSaved,
    recommendedNextHire: pricing.recommendedNextHire,
  };
}
