import { NDP_LAUNCH_TEAMS } from "../../catalog/teams.js";
import type { DigitalEmployeeManifest } from "../types/manifest.js";
import type { ToolCapabilityRequirement } from "../types/policies.js";
import {
  createDefaultKpis,
  createSpecialistConfidencePolicy,
  createSpecialistEscalationPolicy,
  createSpecialistMemoryPolicy,
  createSpecialistPermissions,
} from "../defaults/policies.js";

function teamIdsForSpecialist(specialistId: string): string[] {
  return NDP_LAUNCH_TEAMS.filter((team) =>
    team.specialistIds.includes(specialistId),
  ).map((team) => team.id);
}

function tools(capabilityIds: string[], required = true): ToolCapabilityRequirement[] {
  return capabilityIds.map((capabilityId) => ({
    capabilityId,
    required,
  }));
}

function manifest(input: {
  employeeId: string;
  displayName: string;
  category: DigitalEmployeeManifest["category"];
  specialistId: string;
  capabilities: string[];
  connectorCapabilities: string[];
  knowledgePackIds: string[];
  permissions?: ReturnType<typeof createSpecialistPermissions>;
  memoryPolicy?: ReturnType<typeof createSpecialistMemoryPolicy>;
  confidencePolicy?: ReturnType<typeof createSpecialistConfidencePolicy>;
  escalationPolicy?: ReturnType<typeof createSpecialistEscalationPolicy>;
  metadata?: Record<string, unknown>;
}): DigitalEmployeeManifest {
  const teamIds = teamIdsForSpecialist(input.specialistId);

  return {
    employeeId: input.employeeId,
    displayName: input.displayName,
    role: "specialist",
    category: input.category,
    teamIds,
    specialistId: input.specialistId,
    capabilities: input.capabilities,
    connectorCapabilities: input.connectorCapabilities,
    knowledgePackIds: input.knowledgePackIds,
    permissions: input.permissions ?? createSpecialistPermissions(),
    memoryPolicy: input.memoryPolicy ?? createSpecialistMemoryPolicy(),
    kpis: createDefaultKpis(input.category),
    escalationPolicy:
      input.escalationPolicy ?? createSpecialistEscalationPolicy(),
    confidencePolicy:
      input.confidencePolicy ?? createSpecialistConfidencePolicy(),
    toolRequirements: tools(input.connectorCapabilities),
    lifecycleStatus: "active",
    launchVisible: true,
    metadata: input.metadata,
  };
}

const ORG_STANDARDS = ["knowledge-pack-northbridge-communication-standards"];
const PRO_COMMUNICATION = ["knowledge-pack-professional-communication"];

/**
 * Launch-visible Digital Employee manifests for reusable cross-industry specialists.
 * Metadata only — no prompts or tool execution.
 */
export const NDP_LAUNCH_EMPLOYEE_MANIFESTS: DigitalEmployeeManifest[] = [
  manifest({
    employeeId: "employee-marketing-campaign",
    displayName: "Marketing Campaign Specialist",
    category: "marketing",
    specialistId: "marketing-campaign-specialist",
    capabilities: ["capability:customer_acquisition", "capability:analytics"],
    connectorCapabilities: [
      "marketing.ad.create",
      "marketing.ad.read",
      "campaign.create",
      "campaign.review",
    ],
    knowledgePackIds: [
      ...PRO_COMMUNICATION,
      "knowledge-pack-marketing-fundamentals",
      "knowledge-pack-campaign-planning",
      ...ORG_STANDARDS,
    ],
    permissions: createSpecialistPermissions(["marketing:write"]),
  }),
  manifest({
    employeeId: "employee-content-posts",
    displayName: "Content & Posts Specialist",
    category: "marketing",
    specialistId: "content-posts-specialist",
    capabilities: ["capability:content_marketing"],
    connectorCapabilities: [
      "storage.file.upload",
      "storage.file.read",
      "content.plan",
      "content.calendar",
    ],
    knowledgePackIds: [
      ...PRO_COMMUNICATION,
      "knowledge-pack-business-writing",
      "knowledge-pack-marketing-fundamentals",
      "knowledge-pack-content-strategy",
      ...ORG_STANDARDS,
    ],
    permissions: createSpecialistPermissions(["content:write"]),
  }),
  manifest({
    employeeId: "employee-brand",
    displayName: "Brand Specialist",
    category: "marketing",
    specialistId: "brand-specialist",
    capabilities: ["capability:content_marketing"],
    connectorCapabilities: [
      "storage.file.read",
      "storage.file.upload",
      "content.plan",
    ],
    knowledgePackIds: [
      ...PRO_COMMUNICATION,
      "knowledge-pack-business-writing",
      "knowledge-pack-marketing-fundamentals",
      "knowledge-pack-branding",
      ...ORG_STANDARDS,
    ],
    permissions: createSpecialistPermissions(["content:read"]),
  }),
  manifest({
    employeeId: "employee-marketing-analytics",
    displayName: "Marketing Analytics Specialist",
    category: "marketing",
    specialistId: "marketing-analytics-specialist",
    capabilities: ["capability:analytics", "capability:customer_acquisition"],
    connectorCapabilities: [
      "marketing.ad.read",
      "accounting.report.read",
      "marketing.analyze",
    ],
    knowledgePackIds: [
      ...PRO_COMMUNICATION,
      "knowledge-pack-marketing-fundamentals",
      "knowledge-pack-marketing-analytics",
      ...ORG_STANDARDS,
    ],
    permissions: createSpecialistPermissions(["analytics:read"]),
  }),
  manifest({
    employeeId: "employee-advertising-budget",
    displayName: "Advertising Budget Specialist",
    category: "marketing",
    specialistId: "advertising-budget-specialist",
    capabilities: ["capability:customer_acquisition", "capability:finance"],
    connectorCapabilities: [
      "marketing.ad.create",
      "marketing.ad.read",
      "budget.review",
    ],
    knowledgePackIds: [
      ...PRO_COMMUNICATION,
      "knowledge-pack-marketing-fundamentals",
      "knowledge-pack-financial-fundamentals",
      "knowledge-pack-budget-optimization",
      ...ORG_STANDARDS,
    ],
    permissions: createSpecialistPermissions(["marketing:write", "finance:read"]),
  }),
  manifest({
    employeeId: "employee-sales",
    displayName: "Sales Specialist",
    category: "sales",
    specialistId: "sales-specialist",
    capabilities: ["capability:sales_pipeline"],
    connectorCapabilities: ["sales.analyze", "pipeline.review", "crm.update"],
    knowledgePackIds: [
      ...PRO_COMMUNICATION,
      "knowledge-pack-sales-fundamentals",
      "knowledge-pack-consultative-selling",
      "knowledge-pack-sales-pipeline-management",
      ...ORG_STANDARDS,
    ],
    permissions: createSpecialistPermissions(["sales:write"]),
  }),
  manifest({
    employeeId: "employee-lead-qualification",
    displayName: "Lead Qualification Specialist",
    category: "sales",
    specialistId: "lead-qualification-specialist",
    capabilities: ["capability:sales_pipeline"],
    connectorCapabilities: ["lead.qualify", "pipeline.review", "crm.update"],
    knowledgePackIds: [
      ...PRO_COMMUNICATION,
      "knowledge-pack-sales-fundamentals",
      "knowledge-pack-lead-qualification",
      ...ORG_STANDARDS,
    ],
    permissions: createSpecialistPermissions(["sales:write"]),
  }),
  manifest({
    employeeId: "employee-proposal-quote",
    displayName: "Proposal & Quote Specialist",
    category: "sales",
    specialistId: "proposal-quote-specialist",
    capabilities: ["capability:sales_pipeline"],
    connectorCapabilities: ["proposal.prepare", "pipeline.review"],
    knowledgePackIds: [
      ...PRO_COMMUNICATION,
      "knowledge-pack-business-writing",
      "knowledge-pack-sales-fundamentals",
      "knowledge-pack-proposal-quote-strategy",
      ...ORG_STANDARDS,
    ],
    permissions: createSpecialistPermissions(["sales:write"]),
  }),
  manifest({
    employeeId: "employee-follow-up",
    displayName: "Follow-up Specialist",
    category: "sales",
    specialistId: "follow-up-specialist",
    capabilities: ["capability:sales_pipeline", "capability:customer_service"],
    connectorCapabilities: ["followup.plan", "crm.update"],
    knowledgePackIds: [
      ...PRO_COMMUNICATION,
      "knowledge-pack-sales-fundamentals",
      "knowledge-pack-follow-up-strategy",
      "knowledge-pack-customer-service-fundamentals",
      ...ORG_STANDARDS,
    ],
    permissions: createSpecialistPermissions(["sales:write", "messaging:send"]),
  }),
  manifest({
    employeeId: "employee-crm",
    displayName: "CRM Specialist",
    category: "sales",
    specialistId: "crm-specialist",
    capabilities: ["capability:sales_pipeline", "capability:analytics"],
    connectorCapabilities: ["crm.update", "pipeline.review", "sales.analyze"],
    knowledgePackIds: [
      ...PRO_COMMUNICATION,
      "knowledge-pack-sales-fundamentals",
      "knowledge-pack-crm-hygiene",
      "knowledge-pack-sales-pipeline-management",
      ...ORG_STANDARDS,
    ],
    permissions: createSpecialistPermissions(["crm:write"]),
  }),
  manifest({
    employeeId: "employee-customer-service",
    displayName: "Customer Service Specialist",
    category: "customer-experience",
    specialistId: "customer-service-specialist",
    capabilities: ["capability:customer_service"],
    connectorCapabilities: ["customer.answer", "reception.triage"],
    knowledgePackIds: [
      ...PRO_COMMUNICATION,
      "knowledge-pack-customer-service-fundamentals",
      "knowledge-pack-complaint-handling",
      "knowledge-pack-service-recovery",
      "knowledge-pack-northbridge-customer-success-doctrine",
      ...ORG_STANDARDS,
    ],
    permissions: createSpecialistPermissions(["messaging:send"]),
    memoryPolicy: createSpecialistMemoryPolicy({ loadCustomerProfile: true }),
  }),
  manifest({
    employeeId: "employee-reception",
    displayName: "Reception Specialist",
    category: "customer-experience",
    specialistId: "reception-specialist",
    capabilities: ["capability:customer_service"],
    connectorCapabilities: ["reception.triage", "customer.answer"],
    knowledgePackIds: [
      ...PRO_COMMUNICATION,
      "knowledge-pack-customer-service-fundamentals",
      "knowledge-pack-reception-fundamentals",
      "knowledge-pack-northbridge-customer-success-doctrine",
      ...ORG_STANDARDS,
    ],
    permissions: createSpecialistPermissions(["messaging:send"]),
  }),
  manifest({
    employeeId: "employee-appointment",
    displayName: "Appointment Specialist",
    category: "customer-experience",
    specialistId: "appointment-specialist",
    capabilities: ["capability:scheduling"],
    connectorCapabilities: [
      "appointment.schedule",
      "appointment.reschedule",
      "schedule.create",
      "schedule.update",
      "schedule.cancel",
    ],
    knowledgePackIds: [
      ...PRO_COMMUNICATION,
      "knowledge-pack-scheduling-fundamentals",
      "knowledge-pack-appointment-handling",
      ...ORG_STANDARDS,
    ],
    permissions: createSpecialistPermissions(["scheduling:write"]),
  }),
  manifest({
    employeeId: "employee-reminder",
    displayName: "Reminder Specialist",
    category: "customer-experience",
    specialistId: "reminder-specialist",
    capabilities: ["capability:scheduling", "capability:customer_service"],
    connectorCapabilities: ["reminder.prepare", "schedule.list", "messaging.sms.send"],
    knowledgePackIds: [
      ...PRO_COMMUNICATION,
      "knowledge-pack-scheduling-fundamentals",
      "knowledge-pack-reminder-strategy",
      "knowledge-pack-customer-service-fundamentals",
      ...ORG_STANDARDS,
    ],
    permissions: createSpecialistPermissions(["scheduling:read", "messaging:send"]),
  }),
  manifest({
    employeeId: "employee-customer-success",
    displayName: "Customer Success Specialist",
    category: "customer-experience",
    specialistId: "customer-success-specialist",
    capabilities: ["capability:customer_service"],
    connectorCapabilities: ["customer.success.review", "crm.contact.update"],
    knowledgePackIds: [
      ...PRO_COMMUNICATION,
      "knowledge-pack-customer-service-fundamentals",
      "knowledge-pack-customer-success-fundamentals",
      "knowledge-pack-northbridge-customer-success-doctrine",
      ...ORG_STANDARDS,
    ],
    permissions: createSpecialistPermissions(["messaging:send", "crm:write"]),
    memoryPolicy: createSpecialistMemoryPolicy({
      scope: "customer",
      loadCustomerProfile: true,
    }),
  }),
  manifest({
    employeeId: "employee-financial",
    displayName: "Financial Specialist",
    category: "financial",
    specialistId: "financial-specialist",
    capabilities: ["capability:finance"],
    connectorCapabilities: [
      "accounting.report.read",
      "accounting.invoice.create",
    ],
    knowledgePackIds: [
      ...PRO_COMMUNICATION,
      "knowledge-pack-business-writing",
      "knowledge-pack-financial-fundamentals",
      ...ORG_STANDARDS,
    ],
    permissions: createSpecialistPermissions(["finance:read"]),
    confidencePolicy: createSpecialistConfidencePolicy({
      minimumConfidence: "high",
      requireHighForCustomerFacing: true,
    }),
  }),
  manifest({
    employeeId: "employee-billing",
    displayName: "Billing Specialist",
    category: "financial",
    specialistId: "billing-specialist",
    capabilities: ["capability:finance"],
    connectorCapabilities: [
      "accounting.invoice.create",
      "accounting.payment.record",
    ],
    knowledgePackIds: [
      ...PRO_COMMUNICATION,
      "knowledge-pack-financial-fundamentals",
      ...ORG_STANDARDS,
    ],
    permissions: createSpecialistPermissions(["finance:write"]),
    confidencePolicy: createSpecialistConfidencePolicy({
      minimumConfidence: "high",
    }),
  }),
  manifest({
    employeeId: "employee-accounts-receivable",
    displayName: "Accounts Receivable Specialist",
    category: "financial",
    specialistId: "accounts-receivable-specialist",
    capabilities: ["capability:finance"],
    connectorCapabilities: [
      "accounting.invoice.create",
      "accounting.payment.record",
      "accounting.report.read",
    ],
    knowledgePackIds: [
      ...PRO_COMMUNICATION,
      "knowledge-pack-financial-fundamentals",
      ...ORG_STANDARDS,
    ],
    permissions: createSpecialistPermissions(["finance:write"]),
  }),
  manifest({
    employeeId: "employee-financial-reporting",
    displayName: "Financial Reporting Specialist",
    category: "financial",
    specialistId: "financial-reporting-specialist",
    capabilities: ["capability:finance", "capability:analytics"],
    connectorCapabilities: ["accounting.report.read"],
    knowledgePackIds: [
      ...PRO_COMMUNICATION,
      "knowledge-pack-financial-fundamentals",
      ...ORG_STANDARDS,
    ],
    permissions: createSpecialistPermissions(["finance:read", "analytics:read"]),
    confidencePolicy: createSpecialistConfidencePolicy({
      minimumConfidence: "high",
      requireHighForCustomerFacing: true,
    }),
  }),
];

export const NDP_LAUNCH_EMPLOYEE_ID_SET = new Set(
  NDP_LAUNCH_EMPLOYEE_MANIFESTS.map((entry) => entry.employeeId),
);

export function getLaunchEmployeeManifest(
  employeeId: string,
): DigitalEmployeeManifest | undefined {
  return NDP_LAUNCH_EMPLOYEE_MANIFESTS.find(
    (entry) => entry.employeeId === employeeId,
  );
}

export function getManifestBySpecialistId(
  specialistId: string,
): DigitalEmployeeManifest | undefined {
  return NDP_LAUNCH_EMPLOYEE_MANIFESTS.find(
    (entry) => entry.specialistId === specialistId,
  );
}

export function listLaunchVisibleEmployeeManifests(): DigitalEmployeeManifest[] {
  return NDP_LAUNCH_EMPLOYEE_MANIFESTS.filter((entry) => entry.launchVisible);
}

export function listEmployeeManifestsByTeam(
  teamId: string,
): DigitalEmployeeManifest[] {
  return NDP_LAUNCH_EMPLOYEE_MANIFESTS.filter((entry) =>
    entry.teamIds.includes(teamId),
  );
}
