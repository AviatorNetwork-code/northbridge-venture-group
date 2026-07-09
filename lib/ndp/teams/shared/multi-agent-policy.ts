import type { TeamLeadPolicy } from "@northbridge/team-orchestrator";

/**
 * Launch teams that operate multi-agent by default.
 * @see docs/northbridge-digital-workforce-multi-agent-default-policy-v1.md
 */
export const NDP_MULTI_AGENT_LAUNCH_TEAM_IDS = [
  "team-marketing",
  "team-sales",
  "team-customer-service",
  "team-financial",
  "team-flight-school",
  "team-dental-office",
  "team-law-firm",
  "team-hvac",
  "team-general-service",
] as const;

/**
 * Default Team Lead policy for all NDP customer-facing teams.
 * Multi-agent parallel execution unless the request is simple or ordering matters.
 */
export const NDP_DEFAULT_TEAM_LEAD_POLICY: TeamLeadPolicy = {
  maxConcurrentDelegations: 8,
  delegationExecutionMode: "parallel",
  synthesizeOnPartialFailure: true,
  escalateOnConflict: true,
  requireAllSpecialistsComplete: false,
  customerFacingViaTeamLeadOnly: true,
};

export interface TeamRequestScopeInput {
  message?: string;
  capabilityTags?: string[];
  intentTags?: string[];
  metadata?: Record<string, unknown>;
}

const NARROW_KPI_PATTERN =
  /\b(ctr|cost per lead|cpc|roas|kpi|conversion rate|status of|current metric)\b/i;

const NARROW_LOOKUP_PATTERN =
  /^(what is|show me|get me|tell me) (the |our )?(current )?(status|number|count|metric|kpi)\b/i;

/**
 * Simple requests may delegate to a single specialist.
 * Broad requests must delegate to multiple specialists by default.
 */
export function isSimpleTeamRequest(input: TeamRequestScopeInput): boolean {
  if (input.metadata?.requestScope === "simple") {
    return true;
  }

  const message = (input.message ?? "").trim();
  if (!message) {
    return false;
  }

  const tags = input.capabilityTags ?? [];

  if (
    tags.length <= 1 &&
    (NARROW_KPI_PATTERN.test(message) || NARROW_LOOKUP_PATTERN.test(message))
  ) {
    return true;
  }

  return false;
}

/**
 * Ensures multi-agent default: when not simple, require at least minSpecialists.
 */
export function ensureMultiAgentSelection<T extends string>(
  selected: Set<T>,
  options: {
    simple: boolean;
    available: readonly T[];
    broadDefault: readonly T[];
    minSpecialists?: number;
  },
): T[] {
  const min = options.minSpecialists ?? 2;

  if (options.simple) {
    return [...selected];
  }

  if (selected.size >= min) {
    return [...selected];
  }

  for (const specialistId of options.broadDefault) {
    if (options.available.includes(specialistId)) {
      selected.add(specialistId);
    }
    if (selected.size >= min) {
      break;
    }
  }

  return [...selected];
}

export function resolveDelegationExecutionMode(
  metadata?: Record<string, unknown>,
): TeamLeadPolicy["delegationExecutionMode"] {
  if (metadata?.executionOrder === "sequential") {
    return "sequential";
  }
  return NDP_DEFAULT_TEAM_LEAD_POLICY.delegationExecutionMode;
}
