import { NIP001_LIMITS } from "./limits.js";

export type DensityCheckInput = {
  titleLength?: number;
  subtitleLength?: number;
  metricCount?: number;
  rowCount?: number;
  primaryActionCount?: number;
  secondaryActionCount?: number;
  followUpChipCount?: number;
  emptyStateActionCount?: number;
};

export type DensityViolation = {
  field: string;
  limit: number;
  actual: number;
  message: string;
};

export type DensityCheckResult =
  | { ok: true }
  | { ok: false; violations: DensityViolation[] };

function violation(
  field: string,
  limit: number,
  actual: number,
): DensityViolation {
  return {
    field,
    limit,
    actual,
    message: `${field} exceeds NIP-001 limit (${actual} > ${limit})`,
  };
}

/**
 * Validate interaction envelope density against NIP-001 limits.
 */
export function validateInteractionDensity(
  input: DensityCheckInput,
): DensityCheckResult {
  const violations: DensityViolation[] = [];
  const { card, maxFollowUpChips, maxEmptyStateActions } = NIP001_LIMITS;

  if (
    input.titleLength !== undefined &&
    input.titleLength > card.maxTitleLength
  ) {
    violations.push(
      violation("title", card.maxTitleLength, input.titleLength),
    );
  }

  if (
    input.subtitleLength !== undefined &&
    input.subtitleLength > card.maxSubtitleLength
  ) {
    violations.push(
      violation("subtitle", card.maxSubtitleLength, input.subtitleLength),
    );
  }

  if (
    input.metricCount !== undefined &&
    input.metricCount > card.maxCollapsedMetrics
  ) {
    violations.push(
      violation("metrics", card.maxCollapsedMetrics, input.metricCount),
    );
  }

  if (input.rowCount !== undefined && input.rowCount > card.maxExpandedRows) {
    violations.push(
      violation("rows", card.maxExpandedRows, input.rowCount),
    );
  }

  if (
    input.primaryActionCount !== undefined &&
    input.primaryActionCount > card.maxPrimaryActions
  ) {
    violations.push(
      violation("primaryActions", card.maxPrimaryActions, input.primaryActionCount),
    );
  }

  if (
    input.secondaryActionCount !== undefined &&
    input.secondaryActionCount > card.maxSecondaryActions
  ) {
    violations.push(
      violation(
        "secondaryActions",
        card.maxSecondaryActions,
        input.secondaryActionCount,
      ),
    );
  }

  if (
    input.followUpChipCount !== undefined &&
    input.followUpChipCount > maxFollowUpChips
  ) {
    violations.push(
      violation("followUpChips", maxFollowUpChips, input.followUpChipCount),
    );
  }

  if (
    input.emptyStateActionCount !== undefined &&
    input.emptyStateActionCount > maxEmptyStateActions
  ) {
    violations.push(
      violation("emptyStateActions", maxEmptyStateActions, input.emptyStateActionCount),
    );
  }

  return violations.length === 0 ? { ok: true } : { ok: false, violations };
}
