import type {
  SpecialistSelection,
  SpecialistSelectionInput,
  SpecialistSelector,
} from "@northbridge/team-orchestrator";
import {
  resolveMarketingCapabilityForSpecialist,
} from "@/lib/ndp/domain/marketing";
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
  "capability:analytics": [
    "marketing-analytics-specialist",
    "marketing-campaign-specialist",
  ],
  "capability:finance": ["advertising-budget-specialist"],
};

function extractCapabilityTags(payload: Record<string, unknown>): string[] {
  const tags = payload.capabilityTags ?? payload.intentTags;
  return Array.isArray(tags) ? tags.filter((entry): entry is string => typeof entry === "string") : [];
}

function extractMessage(payload: Record<string, unknown>): string {
  return typeof payload.message === "string" ? payload.message.toLowerCase() : "";
}

/**
 * Selects marketing specialists based on capability tags and request context.
 */
export class MarketingSpecialistSelector implements SpecialistSelector {
  async select(input: SpecialistSelectionInput): Promise<SpecialistSelection[]> {
    const tags = extractCapabilityTags(input.payload);
    const message = extractMessage(input.payload);

    const selected = new Set<MarketingSpecialistId>();

    for (const tag of tags) {
      for (const specialistId of TAG_TO_SPECIALISTS[tag] ?? []) {
        if (input.availableSpecialistIds.includes(specialistId)) {
          selected.add(specialistId);
        }
      }
    }

    if (selected.size === 0) {
      if (
        message.includes("customer") ||
        message.includes("lead") ||
        message.includes("growth")
      ) {
        for (const specialistId of TAG_TO_SPECIALISTS["capability:customer_acquisition"]!) {
          if (input.availableSpecialistIds.includes(specialistId)) {
            selected.add(specialistId);
          }
        }
      } else if (message.includes("content") || message.includes("post")) {
        for (const specialistId of TAG_TO_SPECIALISTS["capability:content_marketing"]!) {
          if (input.availableSpecialistIds.includes(specialistId)) {
            selected.add(specialistId);
          }
        }
      }
    }

    if (selected.size === 0) {
      for (const specialistId of MARKETING_SPECIALIST_IDS) {
        if (input.availableSpecialistIds.includes(specialistId)) {
          selected.add(specialistId);
          break;
        }
      }
    }

    return [...selected].map((specialistId) => ({
      specialistId,
      specialistDefinitionId: specialistId,
      capabilityId: resolveMarketingCapabilityForSpecialist(specialistId),
      rationale: `Selected for marketing request tags: ${tags.join(", ") || "default"}`,
    }));
  }
}
