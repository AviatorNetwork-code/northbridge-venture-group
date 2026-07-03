import type { ProductCapabilityRequest } from "../types/request.js";
import type { ProductCapabilityResponse } from "../types/response.js";

export interface SynthesisOptions {
  includePlannedDisclaimer?: boolean;
  includeEscalation?: boolean;
}

export function synthesizePublicAnswer(
  request: ProductCapabilityRequest,
  response: ProductCapabilityResponse,
  options: SynthesisOptions = {},
): string {
  const parts: string[] = [];

  parts.push(response.publicSafeSummary);

  if (response.currentCapabilities.length > 0) {
    const currentLabels = response.currentCapabilities
      .slice(0, 4)
      .map((item) => item.label)
      .join(", ");
    parts.push(`Today, ${response.targetProductId} supports areas such as ${currentLabels}.`);
  }

  if (
    options.includePlannedDisclaimer !== false &&
    response.plannedCapabilities.length > 0
  ) {
    const plannedLabels = response.plannedCapabilities
      .slice(0, 3)
      .map((item) => item.label.replace(/^Planned:\s*/i, ""))
      .join(", ");
    parts.push(
      `On the roadmap (not yet available): ${plannedLabels}. These should not be presented as current capabilities.`,
    );
  }

  if (response.unsupportedClaims.length > 0) {
    const blocked = response.unsupportedClaims
      .slice(0, 2)
      .map((claim) => claim.claim)
      .join("; ");
    parts.push(`Important limitation: ${response.targetProductId} should not be described as ${blocked}.`);
  }

  if (
    (options.includeEscalation !== false && response.escalationRequired) ||
    response.confidence === "low"
  ) {
    parts.push(
      "Given the uncertainty here, I recommend a brief conversation with the Northbridge team before making a decision.",
    );
  }

  if (response.recommendedCTA) {
    parts.push(`Suggested next step: ${response.recommendedCTA}`);
  }

  return parts.join(" ");
}

export function synthesizeConsultantAnswer(
  request: ProductCapabilityRequest,
  response: ProductCapabilityResponse,
): string {
  const positioning = response.recommendedPositioning;
  const base = synthesizePublicAnswer(request, response);

  if (request.publicFacing) {
    return base;
  }

  return `${positioning}\n\n${base}`;
}
