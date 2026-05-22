export const PRIMARY_CONTACT_EMAIL = "hello@northbridgeventuregroup.com";

export const CONTACT_CHANNELS = [
  { label: "General", email: PRIMARY_CONTACT_EMAIL },
  { label: "Sales", email: "sales@northbridgeventuregroup.com" },
  { label: "Support", email: "support@northbridgeventuregroup.com" },
  { label: "Partnerships", email: "partners@northbridgeventuregroup.com" },
  { label: "Billing", email: "billing@northbridgeventuregroup.com" },
] as const;

export const PROJECT_TYPES = [
  "Website / Digital Infrastructure",
  "SEO / Local Growth",
  "Automation Systems",
  "Client Portal / Web App",
  "Business Consulting",
  "Other",
] as const;

export const FIELD_LIMITS = {
  name: 200,
  company: 200,
  email: 254,
  phone: 50,
  projectType: 100,
  budgetRange: 50,
  message: 5000,
} as const;
