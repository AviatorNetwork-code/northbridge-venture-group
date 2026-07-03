/** Governance — VPRE is read-only; no UI/code/design changes. */
export const VPRE_GOVERNANCE = {
  readOnly: true as const,
  allowsUiModifications: false as const,
  allowsCodeGeneration: false as const,
  allowsAutomaticCommits: false as const,
  allowsAutonomousDesignChanges: false as const,
  requiresFounderApproval: true as const,
};

const FORBIDDEN_OPERATIONS = [
  "modify_ui",
  "generate_code",
  "commit",
  "apply_design",
  "deploy",
  "autofix",
  "write_css",
  "edit_component",
] as const;

export function assertReadOnlyOperation(operation: string): void {
  if ((FORBIDDEN_OPERATIONS as readonly string[]).includes(operation)) {
    throw new Error(
      `VPRE governance violation: operation "${operation}" is forbidden. Visual reviews are recommendations only — Founder approval required.`,
    );
  }
}

export function wrapExecutiveReport<T extends { governance?: unknown }>(
  report: T,
): T & { governance: typeof VPRE_GOVERNANCE } {
  assertReadOnlyOperation("emit_report");
  return {
    ...report,
    governance: VPRE_GOVERNANCE,
  };
}
