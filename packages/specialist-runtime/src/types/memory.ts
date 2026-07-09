import type { WorkforceRole } from "@northbridge/workforce-contracts";
import type { ConfidenceScore } from "./confidence.js";

export type MemoryScope = "task" | "team" | "org";

/**
 * Opaque reference to a memory slice — implementation lives in NEO memory packages.
 */
export interface SpecialistMemoryReference {
  orgId: string;
  specialistId: string;
  taskId: string;
  scope: MemoryScope;
  memoryKey: string;
}

export interface SpecialistMemorySnapshot {
  reference: SpecialistMemoryReference;
  data: Record<string, unknown>;
  loadedAt: string;
}

/**
 * Adapter boundary for @northbridge/conversation-state and future memory stores.
 * This runtime does not implement persistence.
 */
export interface SpecialistMemoryAdapter {
  load(reference: SpecialistMemoryReference): Promise<Record<string, unknown>>;
  save?(
    reference: SpecialistMemoryReference,
    snapshot: Record<string, unknown>,
  ): Promise<void>;
}

export interface EscalationRequest {
  orgId: string;
  taskId: string;
  specialistId: string;
  sourceRole: Extract<WorkforceRole, "specialist">;
  targetRole: WorkforceRole;
  targetId: string;
  reason: string;
  confidence?: ConfidenceScore;
  context?: Record<string, unknown>;
  requestedAt: string;
}
