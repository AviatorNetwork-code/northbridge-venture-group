export type MemoryScope = "session" | "thread" | "customer" | "organization";

export type MemoryRetentionPolicy = "ephemeral" | "standard" | "extended";

export interface MemoryPolicy {
  scope: MemoryScope;
  retention: MemoryRetentionPolicy;
  loadConversationContext: boolean;
  loadOrgContext: boolean;
  loadCustomerProfile: boolean;
}

export interface PermissionPolicy {
  canDo: string[];
  cannotDo: string[];
}

export type KpiMetricType = "count" | "rate" | "duration" | "score";

export interface KpiDefinition {
  id: string;
  label: string;
  description: string;
  metricType: KpiMetricType;
  targetValue?: number;
  unit?: string;
}

export type EscalationTarget = "team_lead" | "manager" | "human_operator";

export interface EscalationPolicy {
  escalateOnConflict: boolean;
  escalateOnLowConfidence: boolean;
  escalateOnPermissionDenied: boolean;
  target: EscalationTarget;
  maxRetriesBeforeEscalation: number;
}

export type ConfidenceLevel = "high" | "medium" | "low";

export interface ConfidencePolicy {
  minimumConfidence: ConfidenceLevel;
  requireHighForCustomerFacing: boolean;
  allowPartialResults: boolean;
}

export interface ToolCapabilityRequirement {
  capabilityId: string;
  required: boolean;
  description?: string;
}
