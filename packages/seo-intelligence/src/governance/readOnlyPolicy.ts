/** Governance — SIE is read-only; no publishing or CMS changes. */
export const SIE_GOVERNANCE = {
  readOnly: true as const,
  allowsAutomaticPublishing: false as const,
  allowsCmsModifications: false as const,
  allowsCommits: false as const,
  allowsAutonomousContentCreation: false as const,
  requiresFounderApproval: true as const,
};

const FORBIDDEN = [
  "publish",
  "cms_write",
  "commit",
  "deploy_content",
  "auto_create_page",
] as const;

export function assertReadOnlyOperation(operation: string): void {
  if ((FORBIDDEN as readonly string[]).includes(operation)) {
    throw new Error(
      `SIE governance violation: "${operation}" is forbidden. SEO recommendations require Founder approval before any content work.`,
    );
  }
}
