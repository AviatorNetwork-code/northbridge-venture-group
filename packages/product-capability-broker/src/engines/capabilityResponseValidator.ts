import type { CapabilityConfidence } from "../types/request.js";
import type {
  CapabilityItem,
  ProductCapabilityResponse,
  UnsupportedClaim,
} from "../types/response.js";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

const CONFIDENCE_RANK: Record<CapabilityConfidence, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

export function validateCapabilityResponse(
  response: ProductCapabilityResponse,
  requiredConfidence: CapabilityConfidence,
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!response.responseId) errors.push("responseId is required");
  if (!response.targetProductId) errors.push("targetProductId is required");
  if (!response.answeredBy) errors.push("answeredBy is required");
  if (!response.publicSafeSummary.trim()) {
    errors.push("publicSafeSummary is required");
  }
  if (!response.recommendedPositioning.trim()) {
    errors.push("recommendedPositioning is required");
  }

  if (response.currentCapabilities.length === 0 && response.plannedCapabilities.length === 0) {
    warnings.push("Response contains no current or planned capabilities");
  }

  const overlap = findCapabilityOverlap(
    response.currentCapabilities,
    response.plannedCapabilities,
  );
  if (overlap.length > 0) {
    errors.push(`Planned capabilities overlap current: ${overlap.join(", ")}`);
  }

  if (
    CONFIDENCE_RANK[response.confidence] < CONFIDENCE_RANK[requiredConfidence]
  ) {
    if (!response.escalationRequired) {
      errors.push(
        `Confidence ${response.confidence} below required ${requiredConfidence} without escalationRequired`,
      );
    }
  }

  if (response.confidence === "low" && !response.escalationRequired) {
    errors.push("Low confidence responses must set escalationRequired");
  }

  if (response.evidence.length === 0) {
    warnings.push("No evidence attached to capability response");
  }

  for (const claim of response.unsupportedClaims) {
    if (!claim.claim.trim() || !claim.reason.trim()) {
      errors.push("Unsupported claims must include claim and reason");
    }
  }

  if (containsGuaranteeLanguage(response.publicSafeSummary)) {
    errors.push("publicSafeSummary contains unsupported guarantee language");
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

function findCapabilityOverlap(
  current: CapabilityItem[],
  planned: CapabilityItem[],
): string[] {
  const currentIds = new Set(current.map((item) => item.id));
  return planned.filter((item) => currentIds.has(item.id)).map((item) => item.id);
}

function containsGuaranteeLanguage(text: string): boolean {
  if (/not be presented as a guaranteed|not guaranteed|no guarantee|without guarantee/i.test(text)) {
    return false;
  }
  return /guaranteed|100%|always will|definitely will|ensure you will get/i.test(text);
}

export function detectHallucinationRisk(
  response: ProductCapabilityResponse,
  question: string,
): string[] {
  const risks: string[] = [];
  const normalizedQuestion = question.toLowerCase();

  for (const claim of response.unsupportedClaims) {
    if (normalizedQuestion.includes(claim.claim.toLowerCase().slice(0, 20))) {
      risks.push(`Question may imply unsupported claim: ${claim.claim}`);
    }
  }

  if (
    response.confidence === "low" &&
    !/consultation|follow.?up|contact|team/i.test(response.publicSafeSummary)
  ) {
    risks.push("Low confidence response missing human follow-up guidance");
  }

  return risks;
}

export function findBlockedClaimsForQuestion(
  response: ProductCapabilityResponse,
  question: string,
): UnsupportedClaim[] {
  const normalized = question.toLowerCase();
  return response.unsupportedClaims.filter((claim) => {
    const claimNorm = claim.claim.toLowerCase();
    const keywords = claimNorm.split(/\s+/).filter((w) => w.length > 4);
    return keywords.some((word) => normalized.includes(word));
  });
}
