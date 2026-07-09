/**
 * Maps Team Catalog specialists to execution capabilities.
 * Specialists request capabilities — never provider names.
 */
export const SPECIALIST_EXECUTION_CAPABILITIES: Record<string, string[]> = {
  "appointment-specialist": [
    "schedule.create",
    "schedule.update",
    "schedule.cancel",
  ],
  "reminder-specialist": ["schedule.list", "messaging.sms.send"],
  "reception-specialist": ["messaging.email.send", "messaging.sms.send"],
  "customer-follow-up-specialist": [
    "messaging.email.send",
    "crm.contact.update",
  ],
  "lead-qualification-specialist": [
    "crm.contact.create",
    "crm.contact.update",
    "crm.deal.create",
  ],
  "proposal-specialist": ["crm.deal.create", "storage.file.upload"],
  "crm-specialist": [
    "crm.contact.create",
    "crm.contact.update",
    "crm.deal.create",
  ],
  "billing-specialist": [
    "accounting.invoice.create",
    "accounting.payment.record",
  ],
  "accounts-receivable-specialist": [
    "accounting.invoice.create",
    "accounting.payment.record",
    "accounting.report.read",
  ],
  "financial-reporting-specialist": ["accounting.report.read"],
  "marketing-campaign-specialist": [
    "marketing.ad.create",
    "marketing.ad.read",
  ],
  "content-posts-specialist": ["storage.file.upload", "storage.file.read"],
  "email-marketing-specialist": [
    "messaging.email.send",
    "marketing.ad.read",
  ],
  "advertising-budget-specialist": [
    "marketing.ad.create",
    "marketing.ad.read",
  ],
  "marketing-analytics-specialist": ["marketing.ad.read", "accounting.report.read"],
};

export interface SpecialistCapabilityCompatibilityIssue {
  specialistId: string;
  capabilityId: string;
  code: "unknown_capability" | "missing_registry_capability";
}

export function getSpecialistExecutionCapabilities(
  specialistId: string,
): string[] {
  return SPECIALIST_EXECUTION_CAPABILITIES[specialistId] ?? [];
}

export function validateSpecialistCapabilityCompatibility(input: {
  specialistId: string;
  hasCapability: (capabilityId: string) => boolean;
}): SpecialistCapabilityCompatibilityIssue[] {
  const issues: SpecialistCapabilityCompatibilityIssue[] = [];
  const capabilities = getSpecialistExecutionCapabilities(input.specialistId);

  for (const capabilityId of capabilities) {
    if (!input.hasCapability(capabilityId)) {
      issues.push({
        specialistId: input.specialistId,
        capabilityId,
        code: "missing_registry_capability",
      });
    }
  }

  return issues;
}

export function validateAllMappedSpecialists(input: {
  hasCapability: (capabilityId: string) => boolean;
}): SpecialistCapabilityCompatibilityIssue[] {
  const issues: SpecialistCapabilityCompatibilityIssue[] = [];

  for (const specialistId of Object.keys(SPECIALIST_EXECUTION_CAPABILITIES)) {
    issues.push(
      ...validateSpecialistCapabilityCompatibility({
        specialistId,
        hasCapability: input.hasCapability,
      }),
    );
  }

  return issues;
}
