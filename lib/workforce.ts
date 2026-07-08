// Shared content for the Northbridge Digital Workforce experience.
// No backend — this is static product data consumed by the /workforce page
// and the mock CAT advisor panel.

export type WorkforceTier = {
  level: string;
  name: string;
  tagline: string;
  description: string;
};

export const workforceTiers: WorkforceTier[] = [
  {
    level: "01",
    name: "Specialist",
    tagline: "Does one specific job.",
    description:
      "A single specialist focused on one clearly defined role — like answering customer questions or reviewing invoices — done reliably, every day.",
  },
  {
    level: "02",
    name: "Team",
    tagline: "A Team Leader coordinates multiple Specialists.",
    description:
      "When one role isn't enough, a Team Leader coordinates several Specialists so related work moves together without dropping details.",
  },
  {
    level: "03",
    name: "Manager",
    tagline: "Supervises one location or department.",
    description:
      "A Manager oversees the Teams and Specialists for a single business location or department, keeping the work aligned to your goals.",
  },
  {
    level: "04",
    name: "Regional Manager",
    tagline: "Supervises multiple locations or managers.",
    description:
      "A Regional Manager coordinates several Managers across multiple locations — the layer you add only once you're operating at scale.",
  },
];

// Workforce catalog — concrete Specialists, Teams, and Managers a customer can
// hire. These are examples within the single workforce model above (tiers);
// this is NOT a separate model. In NEO this maps to the Workforce Specialists
// package catalog (see docs/DIGITAL-WORKFORCE-HIRING-MVP.md).
export type WorkforceLevel = "Specialist" | "Team" | "Manager" | "Regional Manager";

export type CatalogItem = {
  name: string;
  tier: WorkforceLevel;
  role: string;
};

export const workforceCatalog: CatalogItem[] = [
  // Specialists
  { name: "Appointment Specialist", tier: "Specialist", role: "Books, confirms, and reschedules appointments." },
  { name: "Reservations & Orders Specialist", tier: "Specialist", role: "Takes reservations and orders, handles changes." },
  { name: "Billing Specialist", tier: "Specialist", role: "Prepares and reviews invoices and payments." },
  { name: "Support Specialist", tier: "Specialist", role: "Answers customer questions across channels." },
  { name: "Lead Response Specialist", tier: "Specialist", role: "Responds to new leads fast and qualifies them." },
  { name: "Dispatch Specialist", tier: "Specialist", role: "Coordinates jobs, routes, and schedules." },
  // Teams
  { name: "Front-of-House Team", tier: "Team", role: "Team Leader + reservations, orders, and reviews Specialists." },
  { name: "Patient Team", tier: "Team", role: "Team Leader + appointments, billing, and recalls Specialists." },
  { name: "Client Team", tier: "Team", role: "Team Leader + intake, scheduling, and follow-up Specialists." },
  // Managers
  { name: "Location Manager", tier: "Manager", role: "Supervises the Teams for one location or department." },
  { name: "Regional Manager", tier: "Regional Manager", role: "Coordinates Managers across multiple locations." },
];

export type Industry = {
  name: string;
  starter: string;
  team: string;
  addManager: string;
};

export const industries: Industry[] = [
  {
    name: "Restaurant",
    starter: "Reservations & Orders Specialist",
    team: "Front-of-House Team (reservations, orders, reviews)",
    addManager: "Add a Manager when you run multiple shifts or locations.",
  },
  {
    name: "Dental Clinic",
    starter: "Appointment Specialist",
    team: "Patient Team (appointments, billing, recalls)",
    addManager: "Add a Manager when you add a second operatory or location.",
  },
  {
    name: "Drug Testing Facility",
    starter: "Scheduling Specialist",
    team: "Compliance Team (scheduling, results, records)",
    addManager: "Add a Manager when collection sites multiply.",
  },
  {
    name: "Flight School",
    starter: "Enrollment Specialist",
    team: "Student Team (enrollment, scheduling, logbooks)",
    addManager: "Add a Manager when you scale instructors and aircraft.",
  },
  {
    name: "Trucking Company",
    starter: "Dispatch Specialist",
    team: "Operations Team (dispatch, compliance, billing)",
    addManager: "Add a Manager when fleets span multiple regions.",
  },
  {
    name: "Law Firm",
    starter: "Intake Specialist",
    team: "Client Team (intake, scheduling, document prep)",
    addManager: "Add a Manager when practice areas or offices grow.",
  },
  {
    name: "HVAC Company",
    starter: "Booking Specialist",
    team: "Service Team (booking, dispatch, follow-up)",
    addManager: "Add a Manager when crews cover multiple territories.",
  },
  {
    name: "Real Estate Office",
    starter: "Lead Response Specialist",
    team: "Client Team (lead response, scheduling, listings)",
    addManager: "Add a Manager when agent headcount grows.",
  },
];

export type PricingRegion = {
  region: string;
  note: string;
  rows: { tier: string; price: string }[];
};

export const pricingRegions: PricingRegion[] = [
  {
    region: "Colombia",
    note: "Early access pricing",
    rows: [
      { tier: "Specialist", price: "from $12/mo" },
      { tier: "Team", price: "from $50/mo" },
      { tier: "Manager", price: "+$25/mo" },
      { tier: "Regional Manager", price: "+$65/mo" },
    ],
  },
  {
    region: "United States",
    note: "Early access pricing",
    rows: [
      { tier: "Specialist", price: "from $35/mo" },
      { tier: "Team", price: "from $125/mo" },
      { tier: "Manager", price: "+$65/mo" },
      { tier: "Regional Manager", price: "+$150/mo" },
    ],
  },
];

export const teamTasks: string[] = [
  "Answer a customer question",
  "Draft a promotion",
  "Review an invoice",
  "Prepare a daily summary",
  "Escalate a decision",
];

// CAT advisor greeting. Structured recommendations are produced by the NEO
// light bridge in lib/workforceAdvisor.ts (served via /api/cat/workforce-advisor),
// not by static marketing copy.
export type CatMessage = { from: "cat" | "you"; text: string };

export const catIntro: CatMessage[] = [
  {
    from: "cat",
    text: "Hi, I'm CAT — your Northbridge Workforce Advisor. I'm not a salesperson. My job is to help you hire the smallest workforce that actually solves your problem, and to grow it only when your workload justifies it.",
  },
  {
    from: "cat",
    text: "Tell me about your business — your industry and the task that eats the most time — and I'll recommend where to start. Most owners start with a single Specialist.",
  },
];
