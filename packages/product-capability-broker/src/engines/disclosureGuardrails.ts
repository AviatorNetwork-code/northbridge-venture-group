import type { DisclosureLevel } from "../types/disclosure.js";
import { isDisclosureAllowed } from "../types/disclosure.js";
import type { CapabilityItem, ProductCapabilityResponse } from "../types/response.js";

const INTERNAL_TERMS =
  /NEO|NEOS|governance system|package architecture|engineering doctrine|internal broker/i;

export interface GuardrailResult {
  response: ProductCapabilityResponse;
  warnings: string[];
  blockedFromPublic: string[];
}

export function applyDisclosureGuardrails(
  response: ProductCapabilityResponse,
  allowedLevel: DisclosureLevel,
  publicFacing: boolean,
): GuardrailResult {
  const warnings: string[] = [];
  const blockedFromPublic: string[] = [];

  const filterItems = (items: CapabilityItem[], bucket: "current" | "planned") =>
    items.filter((item) => {
      if (isDisclosureAllowed(item.disclosureLevel, allowedLevel)) {
        return true;
      }
      blockedFromPublic.push(`${bucket}:${item.id}`);
      warnings.push(
        `Blocked ${bucket} capability "${item.label}" — disclosure ${item.disclosureLevel} exceeds allowed ${allowedLevel}`,
      );
      return false;
    });

  const sanitized: ProductCapabilityResponse = {
    ...response,
    currentCapabilities: filterItems(response.currentCapabilities, "current"),
    plannedCapabilities: filterItems(response.plannedCapabilities, "planned"),
    privateNotes: publicFacing ? undefined : response.privateNotes,
    publicSafeSummary: sanitizePublicText(response.publicSafeSummary),
    recommendedPositioning: sanitizePublicText(response.recommendedPositioning),
  };

  if (publicFacing && sanitized.privateNotes) {
    sanitized.privateNotes = undefined;
    warnings.push("Stripped privateNotes from public-facing response");
  }

  if (INTERNAL_TERMS.test(sanitized.publicSafeSummary)) {
    sanitized.publicSafeSummary = sanitized.publicSafeSummary.replace(INTERNAL_TERMS, "platform");
    warnings.push("Removed internal architecture terms from publicSafeSummary");
  }

  return { response: sanitized, warnings, blockedFromPublic };
}

export function enforceRoadmapDisclosureRules(
  response: ProductCapabilityResponse,
): ProductCapabilityResponse {
  const plannedWithLabels = response.plannedCapabilities.map((item) => ({
    ...item,
    description: ensurePlannedLanguage(item.description),
    label: item.label.startsWith("Planned:") ? item.label : `Planned: ${item.label}`,
  }));

  return {
    ...response,
    plannedCapabilities: plannedWithLabels,
    publicSafeSummary: ensurePlannedMentionInSummary(
      response.publicSafeSummary,
      plannedWithLabels.length > 0,
    ),
  };
}

function ensurePlannedLanguage(description: string): string {
  if (/planned|future|roadmap|not yet available|in development/i.test(description)) {
    return description;
  }
  return `Planned (not yet available): ${description}`;
}

function ensurePlannedMentionInSummary(summary: string, hasPlanned: boolean): string {
  if (!hasPlanned || /planned|not yet available|in development/i.test(summary)) {
    return summary;
  }
  return `${summary} Some capabilities described are planned and not yet generally available.`;
}

function sanitizePublicText(text: string): string {
  return text.replace(INTERNAL_TERMS, "Northbridge").trim();
}

export function blockUnsupportedClaimsInAnswer(
  answer: string,
  unsupportedClaims: ProductCapabilityResponse["unsupportedClaims"],
): { answer: string; blocked: ProductCapabilityResponse["unsupportedClaims"] } {
  let sanitized = answer;
  const blocked: ProductCapabilityResponse["unsupportedClaims"] = [];

  for (const claim of unsupportedClaims) {
    const pattern = new RegExp(claim.claim.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    if (pattern.test(sanitized)) {
      blocked.push(claim);
      sanitized = sanitized.replace(
        pattern,
        `[not supported: ${claim.claim.toLowerCase()}]`,
      );
    }
  }

  return { answer: sanitized, blocked };
}
