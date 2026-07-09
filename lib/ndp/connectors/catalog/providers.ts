import type { ConnectorProvider } from "../types/provider.js";

/**
 * Provider metadata catalog — no SDK integrations.
 * Organizations bind providers to capabilities via ConnectorDescriptor.
 */
export const NDP_CONNECTOR_PROVIDER_CATALOG: ConnectorProvider[] = [
  // Scheduling
  {
    id: "provider:google-calendar",
    name: "Google Calendar",
    vendor: "Google",
    category: "scheduling",
    supportedCapabilityIds: [
      "schedule.create",
      "schedule.update",
      "schedule.cancel",
      "schedule.list",
    ],
    regions: ["global"],
    status: "available",
  },
  {
    id: "provider:microsoft-outlook",
    name: "Microsoft Outlook",
    vendor: "Microsoft",
    category: "scheduling",
    supportedCapabilityIds: [
      "schedule.create",
      "schedule.update",
      "schedule.cancel",
      "schedule.list",
    ],
    regions: ["global", "us", "eu"],
    status: "available",
  },
  {
    id: "provider:calendly",
    name: "Calendly",
    vendor: "Calendly",
    category: "scheduling",
    supportedCapabilityIds: ["schedule.create", "schedule.update", "schedule.cancel"],
    regions: ["global"],
    status: "available",
  },
  // CRM
  {
    id: "provider:hubspot",
    name: "HubSpot",
    vendor: "HubSpot",
    category: "crm",
    supportedCapabilityIds: [
      "crm.contact.create",
      "crm.contact.update",
      "crm.deal.create",
    ],
    regions: ["global"],
    status: "available",
  },
  {
    id: "provider:salesforce",
    name: "Salesforce",
    vendor: "Salesforce",
    category: "crm",
    supportedCapabilityIds: [
      "crm.contact.create",
      "crm.contact.update",
      "crm.deal.create",
    ],
    regions: ["global", "us", "eu"],
    status: "available",
  },
  {
    id: "provider:zoho-crm",
    name: "Zoho CRM",
    vendor: "Zoho",
    category: "crm",
    supportedCapabilityIds: [
      "crm.contact.create",
      "crm.contact.update",
      "crm.deal.create",
    ],
    regions: ["global"],
    status: "available",
  },
  // Accounting
  {
    id: "provider:quickbooks",
    name: "QuickBooks",
    vendor: "Intuit",
    category: "accounting",
    supportedCapabilityIds: [
      "accounting.invoice.create",
      "accounting.payment.record",
      "accounting.report.read",
    ],
    regions: ["us"],
    status: "available",
  },
  {
    id: "provider:xero",
    name: "Xero",
    vendor: "Xero",
    category: "accounting",
    supportedCapabilityIds: [
      "accounting.invoice.create",
      "accounting.payment.record",
      "accounting.report.read",
    ],
    regions: ["global", "au", "uk", "eu"],
    status: "available",
  },
  {
    id: "provider:stripe-billing",
    name: "Stripe Billing",
    vendor: "Stripe",
    category: "accounting",
    supportedCapabilityIds: [
      "accounting.invoice.create",
      "accounting.payment.record",
    ],
    regions: ["global"],
    status: "available",
  },
  // Messaging
  {
    id: "provider:gmail",
    name: "Gmail",
    vendor: "Google",
    category: "messaging",
    supportedCapabilityIds: ["messaging.email.send"],
    regions: ["global"],
    status: "available",
  },
  {
    id: "provider:outlook-mail",
    name: "Outlook Mail",
    vendor: "Microsoft",
    category: "messaging",
    supportedCapabilityIds: ["messaging.email.send"],
    regions: ["global", "us", "eu"],
    status: "available",
  },
  {
    id: "provider:twilio",
    name: "Twilio",
    vendor: "Twilio",
    category: "messaging",
    supportedCapabilityIds: ["messaging.sms.send"],
    regions: ["global"],
    status: "available",
  },
  {
    id: "provider:whatsapp-business",
    name: "WhatsApp Business",
    vendor: "Meta",
    category: "messaging",
    supportedCapabilityIds: ["messaging.whatsapp.send"],
    regions: ["global"],
    status: "available",
  },
  // Marketing
  {
    id: "provider:meta-ads",
    name: "Meta Ads",
    vendor: "Meta",
    category: "marketing",
    supportedCapabilityIds: ["marketing.ad.create", "marketing.ad.read"],
    regions: ["global"],
    status: "available",
  },
  {
    id: "provider:google-ads",
    name: "Google Ads",
    vendor: "Google",
    category: "marketing",
    supportedCapabilityIds: ["marketing.ad.create", "marketing.ad.read"],
    regions: ["global"],
    status: "available",
  },
  {
    id: "provider:linkedin-ads",
    name: "LinkedIn Ads",
    vendor: "LinkedIn",
    category: "marketing",
    supportedCapabilityIds: ["marketing.ad.create", "marketing.ad.read"],
    regions: ["global"],
    status: "available",
  },
  // Storage
  {
    id: "provider:google-drive",
    name: "Google Drive",
    vendor: "Google",
    category: "storage",
    supportedCapabilityIds: ["storage.file.upload", "storage.file.read"],
    regions: ["global"],
    status: "available",
  },
  {
    id: "provider:onedrive",
    name: "OneDrive",
    vendor: "Microsoft",
    category: "storage",
    supportedCapabilityIds: ["storage.file.upload", "storage.file.read"],
    regions: ["global", "us", "eu"],
    status: "available",
  },
  {
    id: "provider:dropbox",
    name: "Dropbox",
    vendor: "Dropbox",
    category: "storage",
    supportedCapabilityIds: ["storage.file.upload", "storage.file.read"],
    regions: ["global"],
    status: "available",
  },
];

export const NDP_CONNECTOR_PROVIDER_ID_SET = new Set(
  NDP_CONNECTOR_PROVIDER_CATALOG.map((entry) => entry.id),
);

export function getConnectorProvider(id: string): ConnectorProvider | undefined {
  return NDP_CONNECTOR_PROVIDER_CATALOG.find((entry) => entry.id === id);
}

export function listProvidersByCategory(
  category: ConnectorProvider["category"],
): ConnectorProvider[] {
  return NDP_CONNECTOR_PROVIDER_CATALOG.filter((entry) => entry.category === category);
}
