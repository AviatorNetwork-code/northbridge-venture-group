import type {
  SpecialistSelection,
  SpecialistSelectionInput,
  SpecialistSelector,
} from "@northbridge/team-orchestrator";
import {
  resolveMarketingCapabilityForSpecialist,
} from "@/lib/ndp/domain/marketing";
import {
  ensureMultiAgentSelection,
  isSimpleTeamRequest,
} from "@/lib/ndp/teams/shared";
import type { MarketingSpecialistId } from "../constants.js";
import { MARKETING_SPECIALIST_IDS } from "../constants.js";

const TAG_TO_SPECIALISTS: Record<string, MarketingSpecialistId[]> = {
  "capability:customer_acquisition": [
    "marketing-campaign-specialist",
    "marketing-analytics-specialist",
    "advertising-budget-specialist",
  ],
  "capability:content_marketing": [
    "content-posts-specialist",
    "brand-specialist",
  ],
  "capability:analytics": ["marketing-analytics-specialist"],
  "capability:finance": ["advertising-budget-specialist"],
};

const MARKETING_BROAD_DEFAULT: MarketingSpecialistId[] = [
  "marketing-campaign-specialist",
  "marketing-analytics-specialist",
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

/**
 * Selects marketing specialists based on capability tags and request context.
 * Multi-agent by default; single specialist only for simple requests.
 */
export class MarketingSpecialistSelector implements SpecialistSelector {
  async select(input: SpecialistSelectionInput): Promise<SpecialistSelection[]> {
    const tags = extractCapabilityTags(input.payload);
    const message = extractMessage(input.payload);
    const metadata = extractMetadata(input.payload);
    const simple = isSimpleTeamRequest({ message, capabilityTags: tags, metadata });

    const selected = new Set<MarketingSpecialistId>();

    for (const tag of tags) {
      for (const specialistId of TAG_TO_SPECIALISTS[tag] ?? []) {
        if (input.availableSpecialistIds.includes(specialistId)) {
          selected.add(specialistId);
        }
      }
    }

    if (selected.size === 0) {
      const normalized = message.toLowerCase();
      if (
        normalized.includes("customer") ||
        normalized.includes("lead") ||
        normalized.includes("growth")
      ) {
        for (const specialistId of TAG_TO_SPECIALISTS["capability:customer_acquisition"]!) {
          if (input.availableSpecialistIds.includes(specialistId)) {
            selected.add(specialistId);
          }
        }
      } else if (normalized.includes("content") || normalized.includes("post")) {
        for (const specialistId of TAG_TO_SPECIALISTS["capability:content_marketing"]!) {
          if (input.availableSpecialistIds.includes(specialistId)) {
            selected.add(specialistId);
          }
        }
      }
    }

    const specialistIds = ensureMultiAgentSelection(selected, {
      simple,
      available: input.availableSpecialistIds as MarketingSpecialistId[],
      broadDefault: MARKETING_BROAD_DEFAULT,
      minSpecialists: 2,
    });

    if (specialistIds.length === 0) {
      for (const specialistId of MARKETING_SPECIALIST_IDS) {
        if (input.availableSpecialistIds.includes(specialistId)) {
          specialistIds.push(specialistId);
          break;
        }
      }
    }

    return specialistIds.map((specialistId) => ({
      specialistId,
      specialistDefinitionId: specialistId,
      capabilityId: resolveMarketingCapabilityForSpecialist(specialistId),
      rationale: simple
        ? `Simple request — single specialist selected for tags: ${tags.join(", ") || "default"}`
        : `Multi-agent default — selected for marketing request tags: ${tags.join(", ") || "default"}`,
    }));
  }
}
