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
  ],
  "capability:content_marketing": ["storage.file.upload", "storage.file.read"],
  "capability:analytics": ["marketing.ad.read", "accounting.report.read"],
  "capability:general_operations": ["schedule.list", "messaging.email.send"],
};

export function resolveExecutionCapabilitiesForRoutingTag(
  routingTag: string,
): string[] {
  return ROUTING_TAG_TO_EXECUTION_CAPABILITIES[routingTag] ?? [];
}
