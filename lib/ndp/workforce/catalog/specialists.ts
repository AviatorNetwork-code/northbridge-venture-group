/**
 * Workforce Inventory v1.0 specialist metadata for Northbridge Digital.
 * @see docs/northbridge-digital-workforce-inventory-v1.md
 *
 * Metadata only — no prompts, tools, or domain execution behavior.
 */
export type SpecialistInventorySection =
  | "marketing"
  | "sales"
  | "customer-experience"
  | "administrative"
  | "financial"
  | "operations"
  | "aviation"
  | "dental"
  | "legal"
  | "hvac";

export interface InventorySpecialistDefinition {
  id: string;
  name: string;
  section: SpecialistInventorySection;
  mission: string;
  capabilityTags: string[];
}

export const NDP_INVENTORY_SPECIALISTS: InventorySpecialistDefinition[] = [
  // I. Marketing
  {
    id: "marketing-campaign-specialist",
    name: "Marketing Campaign Specialist",
    section: "marketing",
    mission: "Plans and manages marketing campaigns",
    capabilityTags: ["capability:customer_acquisition", "capability:analytics"],
  },
  {
    id: "content-posts-specialist",
    name: "Content & Posts Specialist",
    section: "marketing",
    mission: "Creates social media and marketing content",
    capabilityTags: ["capability:content_marketing"],
  },
  {
    id: "brand-specialist",
    name: "Brand Specialist",
    section: "marketing",
    mission: "Ensures consistent branding and messaging",
    capabilityTags: ["capability:content_marketing"],
  },
  {
    id: "marketing-analytics-specialist",
    name: "Marketing Analytics Specialist",
    section: "marketing",
    mission: "Tracks campaign performance and KPIs",
    capabilityTags: ["capability:analytics", "capability:customer_acquisition"],
  },
  {
    id: "advertising-budget-specialist",
    name: "Advertising Budget Specialist",
    section: "marketing",
    mission: "Optimizes advertising spend and ROI",
    capabilityTags: ["capability:customer_acquisition", "capability:finance"],
  },
  {
    id: "seo-specialist",
    name: "SEO Specialist",
    section: "marketing",
    mission: "Improves organic search visibility",
    capabilityTags: ["capability:customer_acquisition", "capability:content_marketing"],
  },
  {
    id: "email-marketing-specialist",
    name: "Email Marketing Specialist",
    section: "marketing",
    mission: "Creates and manages email campaigns",
    capabilityTags: ["capability:customer_acquisition", "capability:content_marketing"],
  },
  {
    id: "reputation-management-specialist",
    name: "Reputation Management Specialist",
    section: "marketing",
    mission: "Reviews, ratings, and online reputation",
    capabilityTags: ["capability:customer_service", "capability:content_marketing"],
  },
  // II. Sales
  {
    id: "sales-specialist",
    name: "Sales Specialist",
    section: "sales",
    mission: "Handles sales conversations",
    capabilityTags: ["capability:sales_pipeline"],
  },
  {
    id: "lead-qualification-specialist",
    name: "Lead Qualification Specialist",
    section: "sales",
    mission: "Evaluates incoming leads",
    capabilityTags: ["capability:sales_pipeline"],
  },
  {
    id: "proposal-quote-specialist",
    name: "Proposal & Quote Specialist",
    section: "sales",
    mission: "Creates proposals and estimates",
    capabilityTags: ["capability:sales_pipeline"],
  },
  {
    id: "follow-up-specialist",
    name: "Follow-up Specialist",
    section: "sales",
    mission: "Maintains communication with prospects",
    capabilityTags: ["capability:sales_pipeline", "capability:customer_service"],
  },
  {
    id: "crm-specialist",
    name: "CRM Specialist",
    section: "sales",
    mission: "Keeps customer pipeline organized",
    capabilityTags: ["capability:sales_pipeline", "capability:analytics"],
  },
  {
    id: "sales-analytics-specialist",
    name: "Sales Analytics Specialist",
    section: "sales",
    mission: "Tracks sales performance",
    capabilityTags: ["capability:sales_pipeline", "capability:analytics"],
  },
  // III. Customer Experience
  {
    id: "customer-service-specialist",
    name: "Customer Service Specialist",
    section: "customer-experience",
    mission: "Answers customer questions",
    capabilityTags: ["capability:customer_service"],
  },
  {
    id: "reception-specialist",
    name: "Reception Specialist",
    section: "customer-experience",
    mission: "First point of contact",
    capabilityTags: ["capability:customer_service"],
  },
  {
    id: "appointment-specialist",
    name: "Appointment Specialist",
    section: "customer-experience",
    mission: "Scheduling and calendar management",
    capabilityTags: ["capability:scheduling"],
  },
  {
    id: "reminder-specialist",
    name: "Reminder Specialist",
    section: "customer-experience",
    mission: "Appointment reminders",
    capabilityTags: ["capability:scheduling", "capability:customer_service"],
  },
  {
    id: "customer-follow-up-specialist",
    name: "Customer Follow-up Specialist",
    section: "customer-experience",
    mission: "Post-service communication",
    capabilityTags: ["capability:customer_service"],
  },
  {
    id: "customer-success-specialist",
    name: "Customer Success Specialist",
    section: "customer-experience",
    mission: "Customer retention and satisfaction",
    capabilityTags: ["capability:customer_service"],
  },
  // IV. Administrative
  {
    id: "executive-secretary",
    name: "Executive Secretary",
    section: "administrative",
    mission: "Administrative coordination",
    capabilityTags: ["capability:general_operations"],
  },
  {
    id: "documentation-specialist",
    name: "Documentation Specialist",
    section: "administrative",
    mission: "Documents and records",
    capabilityTags: ["capability:general_operations"],
  },
  {
    id: "workflow-specialist",
    name: "Workflow Specialist",
    section: "administrative",
    mission: "Organizes business processes",
    capabilityTags: ["capability:general_operations", "capability:analytics"],
  },
  {
    id: "operations-coordinator",
    name: "Operations Coordinator",
    section: "administrative",
    mission: "Coordinates daily operations",
    capabilityTags: ["capability:general_operations"],
  },
  // V. Financial
  {
    id: "financial-specialist",
    name: "Financial Specialist",
    section: "financial",
    mission: "Financial analysis",
    capabilityTags: ["capability:finance"],
  },
  {
    id: "billing-specialist",
    name: "Billing Specialist",
    section: "financial",
    mission: "Invoices and billing",
    capabilityTags: ["capability:finance"],
  },
  {
    id: "accounts-receivable-specialist",
    name: "Accounts Receivable Specialist",
    section: "financial",
    mission: "Payment tracking",
    capabilityTags: ["capability:finance"],
  },
  {
    id: "expense-specialist",
    name: "Expense Specialist",
    section: "financial",
    mission: "Expense monitoring",
    capabilityTags: ["capability:finance"],
  },
  {
    id: "financial-reporting-specialist",
    name: "Financial Reporting Specialist",
    section: "financial",
    mission: "Financial reports and KPIs",
    capabilityTags: ["capability:finance", "capability:analytics"],
  },
  // VI. Operations
  {
    id: "process-improvement-specialist",
    name: "Process Improvement Specialist",
    section: "operations",
    mission: "Workflow optimization",
    capabilityTags: ["capability:analytics", "capability:general_operations"],
  },
  {
    id: "automation-specialist",
    name: "Automation Specialist",
    section: "operations",
    mission: "Automation opportunities",
    capabilityTags: ["capability:analytics", "capability:general_operations"],
  },
  {
    id: "business-intelligence-specialist",
    name: "Business Intelligence Specialist",
    section: "operations",
    mission: "Operational insights",
    capabilityTags: ["capability:analytics"],
  },
  {
    id: "kpi-specialist",
    name: "KPI Specialist",
    section: "operations",
    mission: "Business performance monitoring",
    capabilityTags: ["capability:analytics"],
  },
  // VII. Aviation
  {
    id: "flight-training-specialist",
    name: "Flight Training Specialist",
    section: "aviation",
    mission: "Flight training programs",
    capabilityTags: ["capability:aviation_operations"],
  },
  {
    id: "aviation-scheduling-specialist",
    name: "Aviation Scheduling Specialist",
    section: "aviation",
    mission: "Aviation scheduling workflows",
    capabilityTags: ["capability:aviation_operations", "capability:scheduling"],
  },
  {
    id: "faa-documentation-specialist",
    name: "FAA Documentation Specialist",
    section: "aviation",
    mission: "Regulatory documentation",
    capabilityTags: ["capability:aviation_operations"],
  },
  {
    id: "student-progress-specialist",
    name: "Student Progress Specialist",
    section: "aviation",
    mission: "Student progress tracking",
    capabilityTags: ["capability:aviation_operations"],
  },
  // VII. Dental
  {
    id: "patient-scheduling-specialist",
    name: "Patient Scheduling Specialist",
    section: "dental",
    mission: "Patient appointment scheduling",
    capabilityTags: ["capability:dental_operations", "capability:scheduling"],
  },
  {
    id: "recall-specialist",
    name: "Recall Specialist",
    section: "dental",
    mission: "Patient recall outreach",
    capabilityTags: ["capability:dental_operations", "capability:customer_service"],
  },
  {
    id: "insurance-verification-specialist",
    name: "Insurance Verification Specialist",
    section: "dental",
    mission: "Insurance verification workflows",
    capabilityTags: ["capability:dental_operations", "capability:finance"],
  },
  {
    id: "treatment-coordinator-specialist",
    name: "Treatment Coordinator Specialist",
    section: "dental",
    mission: "Treatment plan coordination",
    capabilityTags: ["capability:dental_operations"],
  },
  // VII. Law
  {
    id: "client-intake-specialist",
    name: "Client Intake Specialist",
    section: "legal",
    mission: "New client intake",
    capabilityTags: ["capability:legal_operations"],
  },
  {
    id: "case-scheduling-specialist",
    name: "Case Scheduling Specialist",
    section: "legal",
    mission: "Case and hearing scheduling",
    capabilityTags: ["capability:legal_operations", "capability:scheduling"],
  },
  {
    id: "legal-documentation-specialist",
    name: "Legal Documentation Specialist",
    section: "legal",
    mission: "Legal document preparation",
    capabilityTags: ["capability:legal_operations"],
  },
  {
    id: "client-communication-specialist",
    name: "Client Communication Specialist",
    section: "legal",
    mission: "Client communication workflows",
    capabilityTags: ["capability:legal_operations", "capability:customer_service"],
  },
  // VII. HVAC
  {
    id: "dispatch-specialist",
    name: "Dispatch Specialist",
    section: "hvac",
    mission: "Field dispatch coordination",
    capabilityTags: ["capability:hvac_operations", "capability:scheduling"],
  },
  {
    id: "technician-scheduling-specialist",
    name: "Technician Scheduling Specialist",
    section: "hvac",
    mission: "Technician schedule management",
    capabilityTags: ["capability:hvac_operations", "capability:scheduling"],
  },
  {
    id: "maintenance-agreement-specialist",
    name: "Maintenance Agreement Specialist",
    section: "hvac",
    mission: "Maintenance agreement management",
    capabilityTags: ["capability:hvac_operations", "capability:sales_pipeline"],
  },
  {
    id: "estimate-specialist",
    name: "Estimate Specialist",
    section: "hvac",
    mission: "Service estimates and quotes",
    capabilityTags: ["capability:hvac_operations", "capability:sales_pipeline"],
  },
];

export const NDP_SPECIALIST_ID_SET = new Set(
  NDP_INVENTORY_SPECIALISTS.map((entry) => entry.id),
);

export function getInventorySpecialist(
  id: string,
): InventorySpecialistDefinition | undefined {
  return NDP_INVENTORY_SPECIALISTS.find((entry) => entry.id === id);
}

export function listInventorySpecialistsBySection(
  section: SpecialistInventorySection,
): InventorySpecialistDefinition[] {
  return NDP_INVENTORY_SPECIALISTS.filter((entry) => entry.section === section);
}
