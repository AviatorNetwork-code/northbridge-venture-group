import type { OrganizationIntelligenceContext } from "@northbridge/operations-intelligence";
import {
  buildExampleSkywardOrganizationInput,
  buildOrganizationContext,
} from "@northbridge/operations-intelligence";

export interface OperationsContextRefOptions {
  organizationId: string;
  contextVersion?: string;
}

/**
 * Stable reference key for Operations Intelligence context in prompt assembly and runtime metadata.
 */
export function resolveOrganizationContextRef(
  options: OperationsContextRefOptions,
): string {
  const version = options.contextVersion ?? "1.0.0";
  return `operations-intelligence:${options.organizationId}:v${version}`;
}

export interface BuildOperationsContextReferencesInput extends OperationsContextRefOptions {
  conversationContextRef?: string;
  customerContextRef?: string;
  teamContextRef?: string;
}

/**
 * Context reference set for prompt assembly using Operations Intelligence.
 */
export function buildOperationsContextReferences(
  input: BuildOperationsContextReferencesInput,
) {
  return {
    organizationContextRef: resolveOrganizationContextRef(input),
    conversationContextRef: input.conversationContextRef,
    customerContextRef: input.customerContextRef,
    teamContextRef: input.teamContextRef,
  };
}

/**
 * Builds an Operations Intelligence context for development and tests.
 * Adapts the Skyward example to the requested organizationId.
 */
export function buildOperationsIntelligenceContextForOrg(
  organizationId: string,
  options?: { now?: () => string; contextVersion?: string },
): OrganizationIntelligenceContext {
  const now = options?.now ?? (() => new Date().toISOString());
  const base = buildExampleSkywardOrganizationInput();

  const input = {
    profile: { ...base.profile, organizationId },
    services: base.services.map((entry) => ({ ...entry, organizationId })),
    departments: base.departments.map((entry) => ({ ...entry, organizationId })),
    goals: base.goals.map((entry) => ({ ...entry, organizationId })),
    policies: base.policies.map((entry) => ({ ...entry, organizationId })),
    facts: {
      ...base.facts,
      organizationId,
      facts: base.facts.facts.map((entry) => ({ ...entry, organizationId })),
    },
    websiteIntelligence: base.websiteIntelligence
      ? { ...base.websiteIntelligence, organizationId }
      : undefined,
  };

  return buildOrganizationContext(input, {
    now,
    contextVersion: options?.contextVersion,
  });
}
