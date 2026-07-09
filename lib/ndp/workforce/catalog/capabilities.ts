/**
 * Canonical capability tags for Northbridge Digital routing.
 * Aligns with @northbridge/workforce-router capability-based resolution.
 */
export interface CapabilityDefinition {
  id: string;
  label: string;
  description: string;
  inventorySection?: string;
}

export const NDP_CAPABILITY_DEFINITIONS: CapabilityDefinition[] = [
  {
    id: "capability:customer_acquisition",
    label: "Customer acquisition",
    description: "Lead generation, campaigns, and growth activities",
    inventorySection: "marketing",
  },
  {
    id: "capability:content_marketing",
    label: "Content marketing",
    description: "Content creation, brand, and social presence",
    inventorySection: "marketing",
  },
  {
    id: "capability:sales_pipeline",
    label: "Sales pipeline",
    description: "Lead qualification, proposals, and CRM",
    inventorySection: "sales",
  },
  {
    id: "capability:customer_service",
    label: "Customer service",
    description: "Inbound support, reception, and customer success",
    inventorySection: "customer-experience",
  },
  {
    id: "capability:scheduling",
    label: "Scheduling",
    description: "Appointments, calendars, reminders, and dispatch",
    inventorySection: "customer-experience",
  },
  {
    id: "capability:finance",
    label: "Finance",
    description: "Billing, receivables, and financial reporting",
    inventorySection: "financial",
  },
  {
    id: "capability:aviation_operations",
    label: "Aviation operations",
    description: "Flight training, aviation scheduling, and student progress",
    inventorySection: "aviation",
  },
  {
    id: "capability:dental_operations",
    label: "Dental operations",
    description: "Patient scheduling, recall, and treatment coordination",
    inventorySection: "dental",
  },
  {
    id: "capability:legal_operations",
    label: "Legal operations",
    description: "Client intake, case scheduling, and legal documentation",
    inventorySection: "legal",
  },
  {
    id: "capability:hvac_operations",
    label: "HVAC operations",
    description: "Dispatch, technician scheduling, and maintenance agreements",
    inventorySection: "hvac",
  },
  {
    id: "capability:general_operations",
    label: "General operations",
    description: "Cross-functional service business workflows",
    inventorySection: "general",
  },
  {
    id: "capability:analytics",
    label: "Analytics",
    description: "Performance monitoring and business intelligence",
    inventorySection: "operations",
  },
];

export const NDP_CAPABILITY_TAG_SET = new Set(
  NDP_CAPABILITY_DEFINITIONS.map((entry) => entry.id),
);

export function isKnownCapabilityTag(tag: string): boolean {
  return NDP_CAPABILITY_TAG_SET.has(tag);
}

export function getCapabilityDefinition(id: string): CapabilityDefinition | undefined {
  return NDP_CAPABILITY_DEFINITIONS.find((entry) => entry.id === id);
}
