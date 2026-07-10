import type { ConnectorCapability } from "../types/capability.js";

/**
 * Execution-level capabilities requested by Digital Employees.
 * Specialists reference these IDs — never provider names.
 */
export const NDP_EXECUTION_CAPABILITIES: ConnectorCapability[] = [
  // Scheduling
  {
    id: "schedule.create",
    label: "Create appointment",
    description: "Create a new calendar appointment",
    category: "scheduling",
    requiredPermission: "scheduling:write",
    tags: ["scheduling"],
  },
  {
    id: "schedule.update",
    label: "Update appointment",
    description: "Modify an existing appointment",
    category: "scheduling",
    requiredPermission: "scheduling:write",
    tags: ["scheduling"],
  },
  {
    id: "schedule.cancel",
    label: "Cancel appointment",
    description: "Cancel an existing appointment",
    category: "scheduling",
    requiredPermission: "scheduling:write",
    tags: ["scheduling"],
  },
  {
    id: "schedule.list",
    label: "List appointments",
    description: "Retrieve calendar availability and appointments",
    category: "scheduling",
    requiredPermission: "scheduling:read",
    tags: ["scheduling"],
  },
  // CRM
  {
    id: "crm.contact.create",
    label: "Create contact",
    description: "Create a CRM contact record",
    category: "crm",
    requiredPermission: "crm:write",
    tags: ["crm"],
  },
  {
    id: "crm.contact.update",
    label: "Update contact",
    description: "Update an existing CRM contact",
    category: "crm",
    requiredPermission: "crm:write",
    tags: ["crm"],
  },
  {
    id: "crm.deal.create",
    label: "Create deal",
    description: "Create a sales opportunity or deal",
    category: "crm",
    requiredPermission: "crm:write",
    tags: ["crm", "sales"],
  },
  // Accounting
  {
    id: "accounting.invoice.create",
    label: "Create invoice",
    description: "Create a customer invoice",
    category: "accounting",
    requiredPermission: "accounting:write",
    tags: ["accounting"],
  },
  {
    id: "accounting.payment.record",
    label: "Record payment",
    description: "Record a customer payment",
    category: "accounting",
    requiredPermission: "accounting:write",
    tags: ["accounting"],
  },
  {
    id: "accounting.report.read",
    label: "Read financial report",
    description: "Retrieve financial summary data",
    category: "accounting",
    requiredPermission: "accounting:read",
    tags: ["accounting"],
  },
  // Messaging
  {
    id: "messaging.email.send",
    label: "Send email",
    description: "Send an email message",
    category: "messaging",
    requiredPermission: "messaging:send",
    tags: ["messaging", "email"],
  },
  {
    id: "messaging.sms.send",
    label: "Send SMS",
    description: "Send an SMS message",
    category: "messaging",
    requiredPermission: "messaging:send",
    tags: ["messaging", "sms"],
  },
  {
    id: "messaging.whatsapp.send",
    label: "Send WhatsApp message",
    description: "Send a WhatsApp Business message",
    category: "messaging",
    requiredPermission: "messaging:send",
    tags: ["messaging", "whatsapp"],
  },
  // Marketing
  {
    id: "marketing.ad.create",
    label: "Create ad campaign",
    description: "Create or launch an advertising campaign",
    category: "marketing",
    requiredPermission: "marketing:write",
    tags: ["marketing", "ads"],
  },
  {
    id: "marketing.ad.read",
    label: "Read ad performance",
    description: "Retrieve advertising performance metrics",
    category: "marketing",
    requiredPermission: "marketing:read",
    tags: ["marketing", "analytics"],
  },
  {
    id: "campaign.create",
    label: "Create campaign",
    description: "Plan and structure a marketing campaign",
    category: "marketing",
    requiredPermission: "marketing:write",
    tags: ["marketing", "campaign"],
  },
  {
    id: "campaign.review",
    label: "Review campaign",
    description: "Review campaign performance and structure",
    category: "marketing",
    requiredPermission: "marketing:read",
    tags: ["marketing", "campaign"],
  },
  {
    id: "content.plan",
    label: "Plan content",
    description: "Plan content themes and messaging",
    category: "marketing",
    requiredPermission: "content:write",
    tags: ["marketing", "content"],
  },
  {
    id: "content.calendar",
    label: "Content calendar",
    description: "Build and review content calendar schedules",
    category: "marketing",
    requiredPermission: "content:write",
    tags: ["marketing", "content", "scheduling"],
  },
  {
    id: "marketing.analyze",
    label: "Analyze marketing performance",
    description: "Analyze trends, KPIs, and campaign metrics",
    category: "marketing",
    requiredPermission: "analytics:read",
    tags: ["marketing", "analytics"],
  },
  {
    id: "budget.review",
    label: "Review marketing budget",
    description: "Review budget allocation and ROI",
    category: "marketing",
    requiredPermission: "finance:read",
    tags: ["marketing", "finance", "budget"],
  },
  // Sales domain execution (mock workflow capabilities)
  {
    id: "sales.analyze",
    label: "Analyze sales performance",
    description: "Analyze pipeline health and conversion trends",
    category: "sales",
    requiredPermission: "sales:write",
    tags: ["sales", "analytics", "pipeline"],
  },
  {
    id: "lead.qualify",
    label: "Qualify lead",
    description: "Score and qualify inbound leads",
    category: "sales",
    requiredPermission: "sales:write",
    tags: ["sales", "leads", "qualification"],
  },
  {
    id: "proposal.prepare",
    label: "Prepare proposal",
    description: "Draft proposal and quote structure",
    category: "sales",
    requiredPermission: "sales:write",
    tags: ["sales", "proposal", "quote"],
  },
  {
    id: "followup.plan",
    label: "Plan follow-up",
    description: "Plan prospect follow-up cadence and messaging",
    category: "sales",
    requiredPermission: "sales:write",
    tags: ["sales", "follow-up", "messaging"],
  },
  {
    id: "crm.update",
    label: "Update CRM records",
    description: "Review and update CRM pipeline records",
    category: "sales",
    requiredPermission: "crm:write",
    tags: ["sales", "crm", "pipeline"],
  },
  {
    id: "pipeline.review",
    label: "Review sales pipeline",
    description: "Review pipeline stages, velocity, and bottlenecks",
    category: "sales",
    requiredPermission: "sales:write",
    tags: ["sales", "pipeline"],
  },
  // Storage
  {
    id: "storage.file.upload",
    label: "Upload file",
    description: "Upload a file to cloud storage",
    category: "storage",
    requiredPermission: "storage:write",
    tags: ["storage"],
  },
  {
    id: "storage.file.read",
    label: "Read file",
    description: "Retrieve a file from cloud storage",
    category: "storage",
    requiredPermission: "storage:read",
    tags: ["storage"],
  },
];

export const NDP_EXECUTION_CAPABILITY_ID_SET = new Set(
  NDP_EXECUTION_CAPABILITIES.map((entry) => entry.id),
);

export function getExecutionCapability(
  id: string,
): ConnectorCapability | undefined {
  return NDP_EXECUTION_CAPABILITIES.find((entry) => entry.id === id);
}

/**
 * Maps routing capability tags (capability:*) to execution capabilities.
 */
export const ROUTING_TAG_TO_EXECUTION_CAPABILITIES: Record<string, string[]> = {
  "capability:scheduling": [
    "schedule.create",
    "schedule.update",
    "schedule.cancel",
    "schedule.list",
  ],
  "capability:sales_pipeline": [
    "crm.contact.create",
    "crm.contact.update",
    "crm.deal.create",
    "sales.analyze",
    "lead.qualify",
    "proposal.prepare",
    "followup.plan",
    "crm.update",
    "pipeline.review",
  ],
  "capability:customer_service": ["messaging.email.send", "messaging.sms.send"],
  "capability:finance": [
    "accounting.invoice.create",
    "accounting.payment.record",
    "accounting.report.read",
  ],
  "capability:customer_acquisition": [
    "marketing.ad.create",
    "marketing.ad.read",
    "campaign.create",
    "campaign.review",
    "budget.review",
  ],
  "capability:content_marketing": [
    "storage.file.upload",
    "storage.file.read",
    "content.plan",
    "content.calendar",
  ],
  "capability:analytics": [
    "marketing.ad.read",
    "accounting.report.read",
    "marketing.analyze",
  ],
  "capability:general_operations": ["schedule.list", "messaging.email.send"],
};

export function resolveExecutionCapabilitiesForRoutingTag(
  routingTag: string,
): string[] {
  return ROUTING_TAG_TO_EXECUTION_CAPABILITIES[routingTag] ?? [];
}
