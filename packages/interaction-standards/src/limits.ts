/**
 * NIP-001 enforceable limits. Products must not redefine these constants.
 * @see docs/standards/platform/NIP-001-CAT-INTERACTION-STANDARD.md
 */
export const NIP001_LIMITS = {
  maxParagraphsPerTurn: 3,
  maxPrimaryQuestionsPerTurn: 1,
  maxBulletsWithoutExpansion: 5,
  maxFollowUpChips: 4,
  maxEmptyStateActions: 3,
  card: {
    maxTitleLength: 80,
    maxSubtitleLength: 120,
    maxCollapsedMetrics: 4,
    maxCollapsedRows: 6,
    maxExpandedRows: 12,
    maxPrimaryActions: 3,
    maxSecondaryActions: 2,
    maxBadges: 3,
  },
  action: {
    maxLabelLength: 24,
  },
} as const;

export type Nip001Limits = typeof NIP001_LIMITS;
