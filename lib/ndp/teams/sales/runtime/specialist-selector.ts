import type {
  SpecialistSelection,
  SpecialistSelectionInput,
  SpecialistSelector,
} from "@northbridge/team-orchestrator";
import { resolveSalesCapabilityForSpecialist } from "@/lib/ndp/domain/sales";
import { ensureMultiAgentSelection, isSimpleTeamRequest } from "@/lib/ndp/teams/shared";
import type { SalesSpecialistId } from "../constants.js";
import { SALES_SPECIALIST_IDS } from "../constants.js";

const TAG_TO_SPECIALISTS: Record<string, SalesSpecialistId[]> = {
  "capability:sales_pipeline": [
    "sales-specialist",
    "lead-qualification-specialist",
    "follow-up-specialist",
    "crm-specialist",
  ],
  "capability:analytics": ["crm-specialist", "sales-specialist"],
  "capability:customer_service": ["follow-up-specialist"],
};

const CLOSE_LEADS_SPECIALISTS: SalesSpecialistId[] = [
  "sales-specialist",
  "lead-qualification-specialist",
  "proposal-quote-specialist",
  "follow-up-specialist",
];

const CUSTOMER_GROWTH_SPECIALISTS: SalesSpecialistId[] = [
  "sales-specialist",
  "lead-qualification-specialist",
  "follow-up-specialist",
  "crm-specialist",
];

const SALES_BROAD_DEFAULT: SalesSpecialistId[] = [
  "sales-specialist",
  "crm-specialist",
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

function selectByMessage(message: string): SalesSpecialistId[] {
  const normalized = message.toLowerCase();

  if (
    normalized.includes("close") ||
    normalized.includes("convert") ||
    normalized.includes("price") && normalized.includes("nobody")
  ) {
    return CLOSE_LEADS_SPECIALISTS;
  }

  if (
    normalized.includes("customer") ||
    normalized.includes("more leads") ||
    normalized.includes("converting leads")
  ) {
    return CUSTOMER_GROWTH_SPECIALISTS;
  }

  if (normalized.includes("follow up") || normalized.includes("follow-up") || normalized.includes("prospect")) {
    return ["follow-up-specialist", "crm-specialist"];
  }

  if (normalized.includes("proposal") || normalized.includes("quote") || normalized.includes("price")) {
    return ["proposal-quote-specialist", "sales-specialist"];
  }

  if (normalized.includes("pipeline") || normalized.includes("crm")) {
    return ["crm-specialist", "sales-specialist"];
  }

  return [];
}

/**
 * Selects sales specialists based on capability tags and request context.
 * Multi-agent by default; single specialist only for simple requests.
 */
export class SalesSpecialistSelector implements SpecialistSelector {
  async select(input: SpecialistSelectionInput): Promise<SpecialistSelection[]> {
    const tags = extractCapabilityTags(input.payload);
    const message = extractMessage(input.payload);
    const metadata = extractMetadata(input.payload);
    const normalized = message.toLowerCase();
    const simple = isSimpleTeamRequest({ message, capabilityTags: tags, metadata });

    if (
      simple ||
      (normalized.includes("pending") &&
        (normalized.includes("follow-up") || normalized.includes("follow up")))
    ) {
      const specialistId = normalized.includes("crm")
        ? "crm-specialist"
        : "follow-up-specialist";
      if (input.availableSpecialistIds.includes(specialistId)) {
        return [
          {
            specialistId,
            specialistDefinitionId: specialistId,
            capabilityId: resolveSalesCapabilityForSpecialist(specialistId),
            rationale: "Simple status request — single specialist selected",
          },
        ];
      }
    }

    const selected = new Set<SalesSpecialistId>();

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
      const normalizedMessage = message.toLowerCase();
      if (
        normalizedMessage.includes("follow-up") ||
        normalizedMessage.includes("follow up") ||
        normalizedMessage.includes("pending")
      ) {
        if (input.availableSpecialistIds.includes("follow-up-specialist")) {
          selected.add("follow-up-specialist");
        } else if (input.availableSpecialistIds.includes("crm-specialist")) {
          selected.add("crm-specialist");
        }
      }
    }

    const specialistIds = ensureMultiAgentSelection(selected, {
      simple,
      available: input.availableSpecialistIds as SalesSpecialistId[],
      broadDefault: SALES_BROAD_DEFAULT,
      minSpecialists: 2,
    });

    if (specialistIds.length === 0) {
      for (const specialistId of SALES_SPECIALIST_IDS) {
        if (input.availableSpecialistIds.includes(specialistId)) {
          specialistIds.push(specialistId);
          break;
        }
      }
    }

    return specialistIds.map((specialistId) => ({
      specialistId,
      specialistDefinitionId: specialistId,
      capabilityId: resolveSalesCapabilityForSpecialist(specialistId),
      rationale: simple
        ? `Simple request — single specialist selected for tags: ${tags.join(", ") || "default"}`
        : `Multi-agent default — selected for sales request tags: ${tags.join(", ") || "default"}`,
    }));
  }
}
