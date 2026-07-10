import type {
  SpecialistSelection,
  SpecialistSelectionInput,
  SpecialistSelector,
} from "@northbridge/team-orchestrator";
import { resolveCustomerServiceCapabilityForSpecialist } from "@/lib/ndp/domain/customer-service";
import { ensureMultiAgentSelection, isSimpleTeamRequest } from "@/lib/ndp/teams/shared";
import type { CustomerServiceSpecialistId } from "../constants.js";
import { CUSTOMER_SERVICE_SPECIALIST_IDS } from "../constants.js";

const TAG_TO_SPECIALISTS: Record<string, CustomerServiceSpecialistId[]> = {
  "capability:customer_service": [
    "customer-service-specialist",
    "reception-specialist",
    "customer-success-specialist",
  ],
  "capability:scheduling": [
    "appointment-specialist",
    "reminder-specialist",
    "reception-specialist",
  ],
};

const INQUIRY_SPECIALISTS: CustomerServiceSpecialistId[] = [
  "customer-service-specialist",
  "reception-specialist",
  "customer-success-specialist",
];

const SCHEDULING_SPECIALISTS: CustomerServiceSpecialistId[] = [
  "appointment-specialist",
  "reception-specialist",
  "reminder-specialist",
];

const COMPLAINT_SPECIALISTS: CustomerServiceSpecialistId[] = [
  "customer-service-specialist",
  "customer-success-specialist",
  "reception-specialist",
];

const CUSTOMER_SERVICE_BROAD_DEFAULT: CustomerServiceSpecialistId[] = [
  "customer-service-specialist",
  "reception-specialist",
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

function selectByMessage(message: string): CustomerServiceSpecialistId[] {
  const normalized = message.toLowerCase();

  if (
    normalized.includes("complaint") ||
    normalized.includes("unhappy") ||
    normalized.includes("dissatisfied")
  ) {
    return COMPLAINT_SPECIALISTS;
  }

  if (
    normalized.includes("appointment") ||
    normalized.includes("schedule") ||
    normalized.includes("reschedule") ||
    normalized.includes("book")
  ) {
    return SCHEDULING_SPECIALISTS;
  }

  if (
    normalized.includes("inquiry") ||
    normalized.includes("inquiries") ||
    normalized.includes("customer service") ||
    normalized.includes("help with customers")
  ) {
    return INQUIRY_SPECIALISTS;
  }

  if (normalized.includes("reminder") || normalized.includes("no-show")) {
    return ["reminder-specialist", "appointment-specialist"];
  }

  if (normalized.includes("satisfaction") || normalized.includes("retention")) {
    return ["customer-success-specialist", "customer-service-specialist"];
  }

  return [];
}

/**
 * Selects customer service specialists based on capability tags and request context.
 * Multi-agent by default; single specialist only for simple requests.
 */
export class CustomerServiceSpecialistSelector implements SpecialistSelector {
  async select(input: SpecialistSelectionInput): Promise<SpecialistSelection[]> {
    const tags = extractCapabilityTags(input.payload);
    const message = extractMessage(input.payload);
    const metadata = extractMetadata(input.payload);
    const normalized = message.toLowerCase();
    const simple = isSimpleTeamRequest({ message, capabilityTags: tags, metadata });

    if (
      simple ||
      (normalized.includes("pending") &&
        (normalized.includes("reminder") || normalized.includes("reminders")))
    ) {
      const specialistId = normalized.includes("appointment")
        ? "appointment-specialist"
        : "reminder-specialist";
      if (input.availableSpecialistIds.includes(specialistId)) {
        return [
          {
            specialistId,
            specialistDefinitionId: specialistId,
            capabilityId: resolveCustomerServiceCapabilityForSpecialist(specialistId),
            rationale: "Simple status request — single specialist selected",
          },
        ];
      }
    }

    const selected = new Set<CustomerServiceSpecialistId>();

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
      if (
        normalized.includes("reminder") ||
        normalized.includes("pending") ||
        normalized.includes("due")
      ) {
        if (input.availableSpecialistIds.includes("reminder-specialist")) {
          selected.add("reminder-specialist");
        }
      }
    }

    const specialistIds = ensureMultiAgentSelection(selected, {
      simple,
      available: input.availableSpecialistIds as CustomerServiceSpecialistId[],
      broadDefault: CUSTOMER_SERVICE_BROAD_DEFAULT,
      minSpecialists: 2,
    });

    if (specialistIds.length === 0) {
      for (const specialistId of CUSTOMER_SERVICE_SPECIALIST_IDS) {
        if (input.availableSpecialistIds.includes(specialistId)) {
          specialistIds.push(specialistId);
          break;
        }
      }
    }

    return specialistIds.map((specialistId) => ({
      specialistId,
      specialistDefinitionId: specialistId,
      capabilityId: resolveCustomerServiceCapabilityForSpecialist(specialistId),
      rationale: simple
        ? `Simple request — single specialist selected for tags: ${tags.join(", ") || "default"}`
        : `Multi-agent default — selected for customer service request tags: ${tags.join(", ") || "default"}`,
    }));
  }
}
