import type {
  SpecialistSelection,
  SpecialistSelectionInput,
  SpecialistSelector,
} from "@northbridge/team-orchestrator";
import { resolveFinancialCapabilityForSpecialist } from "@/lib/ndp/domain/financial";
import { ensureMultiAgentSelection, isSimpleTeamRequest } from "@/lib/ndp/teams/shared";
import type { FinancialSpecialistId } from "../constants.js";
import { FINANCIAL_SPECIALIST_IDS } from "../constants.js";

const TAG_TO_SPECIALISTS: Record<string, FinancialSpecialistId[]> = {
  "capability:finance": [
    "financial-specialist",
    "billing-specialist",
    "accounts-receivable-specialist",
    "financial-reporting-specialist",
  ],
  "capability:analytics": ["financial-reporting-specialist", "financial-specialist"],
};

const FINANCE_OVERVIEW_SPECIALISTS: FinancialSpecialistId[] = [
  "financial-specialist",
  "billing-specialist",
  "accounts-receivable-specialist",
  "financial-reporting-specialist",
];

const RECEIVABLES_SPECIALISTS: FinancialSpecialistId[] = [
  "accounts-receivable-specialist",
  "billing-specialist",
  "financial-specialist",
];

const BILLING_SPECIALISTS: FinancialSpecialistId[] = [
  "billing-specialist",
  "accounts-receivable-specialist",
  "financial-specialist",
];

const FINANCIAL_BROAD_DEFAULT: FinancialSpecialistId[] = [
  "financial-specialist",
  "billing-specialist",
];

function extractCapabilityTags(payload: Record<string, unknown>): string[] {
  const tags = payload.capabilityTags ?? payload.intentTags;
  return Array.isArray(tags) ? tags.filter((entry): entry is string => typeof entry === "string") : [];
}

function extractMessage(payload: Record<string, unknown>): string {
  return typeof payload.message === "string" ? payload.message : "";
}

function extractMetadata(payload: Record<string, unknown>): Record<string, unknown> | undefined {
  return typeof payload.metadata === "object" && payload.metadata !== null
    ? (payload.metadata as Record<string, unknown>)
    : undefined;
}

function selectByMessage(message: string): FinancialSpecialistId[] {
  const normalized = message.toLowerCase();

  if (
    normalized.includes("receivable") ||
    normalized.includes("overdue") ||
    normalized.includes("past due") ||
    normalized.includes("collection")
  ) {
    return RECEIVABLES_SPECIALISTS;
  }

  if (
    normalized.includes("invoice") ||
    normalized.includes("billing") ||
    normalized.includes("bill ")
  ) {
    return BILLING_SPECIALISTS;
  }

  if (
    normalized.includes("report") ||
    normalized.includes("p&l") ||
    normalized.includes("profit") ||
    normalized.includes("balance sheet")
  ) {
    return ["financial-reporting-specialist", "financial-specialist"];
  }

  if (
    normalized.includes("cash flow") ||
    normalized.includes("revenue") ||
    normalized.includes("financ") ||
    normalized.includes("expense")
  ) {
    return FINANCE_OVERVIEW_SPECIALISTS;
  }

  if (normalized.includes("payment follow") || normalized.includes("follow up on payment")) {
    return ["accounts-receivable-specialist", "billing-specialist"];
  }

  return [];
}

/**
 * Selects financial specialists based on capability tags and request context.
 * Multi-agent by default; single specialist only for simple requests.
 */
export class FinancialSpecialistSelector implements SpecialistSelector {
  async select(input: SpecialistSelectionInput): Promise<SpecialistSelection[]> {
    const tags = extractCapabilityTags(input.payload);
    const message = extractMessage(input.payload);
    const metadata = extractMetadata(input.payload);
    const normalized = message.toLowerCase();
    const simple = isSimpleTeamRequest({ message, capabilityTags: tags, metadata });

    if (
      simple ||
      (normalized.includes("status") &&
        (normalized.includes("report") || normalized.includes("financial report")))
    ) {
      const specialistId = normalized.includes("receivable") || normalized.includes("outstanding")
        ? "accounts-receivable-specialist"
        : "financial-reporting-specialist";
      if (input.availableSpecialistIds.includes(specialistId)) {
        return [
          {
            specialistId,
            specialistDefinitionId: specialistId,
            capabilityId: resolveFinancialCapabilityForSpecialist(specialistId),
            rationale: "Simple status request — single specialist selected",
          },
        ];
      }
    }

    const selected = new Set<FinancialSpecialistId>();

    for (const tag of tags) {
      for (const specialistId of TAG_TO_SPECIALISTS[tag] ?? []) {
        if (input.availableSpecialistIds.includes(specialistId)) {
          selected.add(specialistId);
        }
      }
    }

    for (const specialistId of selectByMessage(message)) {
      if (input.availableSpecialistIds.includes(specialistId)) {
        selected.add(specialistId);
      }
    }

    if (simple && selected.size === 0) {
      if (normalized.includes("report") || normalized.includes("metric")) {
        if (input.availableSpecialistIds.includes("financial-reporting-specialist")) {
          selected.add("financial-reporting-specialist");
        }
      }
    }

    const specialistIds = ensureMultiAgentSelection(selected, {
      simple,
      available: input.availableSpecialistIds as FinancialSpecialistId[],
      broadDefault: FINANCIAL_BROAD_DEFAULT,
      minSpecialists: 2,
    });

    if (specialistIds.length === 0) {
      for (const specialistId of FINANCIAL_SPECIALIST_IDS) {
        if (input.availableSpecialistIds.includes(specialistId)) {
          specialistIds.push(specialistId);
          break;
        }
      }
    }

    return specialistIds.map((specialistId) => ({
      specialistId,
      specialistDefinitionId: specialistId,
      capabilityId: resolveFinancialCapabilityForSpecialist(specialistId),
      rationale: simple
        ? `Simple request — single specialist selected for tags: ${tags.join(", ") || "default"}`
        : `Multi-agent default — selected for financial request tags: ${tags.join(", ") || "default"}`,
    }));
  }
}
