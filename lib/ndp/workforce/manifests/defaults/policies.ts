import type {
  ConfidencePolicy,
  EscalationPolicy,
  KpiDefinition,
  MemoryPolicy,
  PermissionPolicy,
} from "../types/policies.js";

export const DEFAULT_MEMORY_POLICY: MemoryPolicy = {
  scope: "thread",
  retention: "standard",
  loadConversationContext: true,
  loadOrgContext: false,
  loadCustomerProfile: true,
};

export const DEFAULT_ESCALATION_POLICY: EscalationPolicy = {
  escalateOnConflict: true,
  escalateOnLowConfidence: true,
  escalateOnPermissionDenied: true,
  target: "team_lead",
  maxRetriesBeforeEscalation: 1,
};

export const DEFAULT_CONFIDENCE_POLICY: ConfidencePolicy = {
  minimumConfidence: "medium",
  requireHighForCustomerFacing: false,
  allowPartialResults: true,
};

export const DEFAULT_SPECIALIST_PERMISSIONS: PermissionPolicy = {
  canDo: ["execute_task"],
  cannotDo: ["bypass_escalation", "modify_org_policy"],
};

export function createDefaultKpis(category: string): KpiDefinition[] {
  return [
    {
      id: `${category}-task-completion-rate`,
      label: "Task completion rate",
      description: "Percentage of assigned tasks completed successfully",
      metricType: "rate",
      targetValue: 0.9,
      unit: "ratio",
    },
    {
      id: `${category}-average-response-time`,
      label: "Average response time",
      description: "Mean time to produce a specialist output",
      metricType: "duration",
      unit: "seconds",
    },
    {
      id: `${category}-escalation-rate`,
      label: "Escalation rate",
      description: "Percentage of tasks escalated to team lead",
      metricType: "rate",
      targetValue: 0.1,
      unit: "ratio",
    },
  ];
}

export function createSpecialistMemoryPolicy(
  overrides: Partial<MemoryPolicy> = {},
): MemoryPolicy {
  return { ...DEFAULT_MEMORY_POLICY, ...overrides };
}

export function createSpecialistConfidencePolicy(
  overrides: Partial<ConfidencePolicy> = {},
): ConfidencePolicy {
  return { ...DEFAULT_CONFIDENCE_POLICY, ...overrides };
}

export function createSpecialistEscalationPolicy(
  overrides: Partial<EscalationPolicy> = {},
): EscalationPolicy {
  return { ...DEFAULT_ESCALATION_POLICY, ...overrides };
}

export function createSpecialistPermissions(
  additionalCanDo: string[] = [],
  additionalCannotDo: string[] = [],
): PermissionPolicy {
  return {
    canDo: [...DEFAULT_SPECIALIST_PERMISSIONS.canDo, ...additionalCanDo],
    cannotDo: [
      ...DEFAULT_SPECIALIST_PERMISSIONS.cannotDo,
      ...additionalCannotDo,
    ],
  };
}
