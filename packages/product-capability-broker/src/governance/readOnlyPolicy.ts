/** Governance policy — PCB is read-only and does not mutate products. */
export const PCB_GOVERNANCE = {
  readOnly: true as const,
  allowsAutomaticProductChanges: false as const,
  allowsPublicRoadmapCommitments: false as const,
  allowsAutonomousCapabilityInvention: false as const,
  requiresProductOwnership: true as const,
  requiresFounderApprovalForRoadmapChanges: true as const,
};

const FORBIDDEN_OPERATIONS = [
  "write_product",
  "modify_capability",
  "commit_roadmap",
  "publish_public_commitment",
  "invent_capability",
  "execute_product_change",
] as const;

export type ForbiddenPCBOperation = (typeof FORBIDDEN_OPERATIONS)[number];

export function assertReadOnlyOperation(operation: string): void {
  if ((FORBIDDEN_OPERATIONS as readonly string[]).includes(operation)) {
    throw new Error(
      `PCB governance violation: operation "${operation}" is forbidden. Product knowledge is owned by product adapters only.`,
    );
  }
}

export function assertNoAutonomousInvention(requesterId: string, answeredBy: string): void {
  if (requesterId === answeredBy) {
    throw new Error(
      "PCB governance violation: requester cannot answer its own capability request without a product adapter.",
    );
  }
}
