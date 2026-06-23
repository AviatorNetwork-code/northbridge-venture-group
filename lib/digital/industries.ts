export type IndustryContent = {
  slug: string;
  name: string;
  seoTitle: string;
  seoDescription: string;
  heroTitle: string;
  heroSubtitle: string;
  overview: string[];
  challenges: string[];
  bottlenecks: string[];
  evaluations: string[];
  improvements: string[];
  solutions: { label: string; href: string }[];
  relatedExpertise: string[];
};

export const industries: IndustryContent[] = [
  {
    slug: "aviation",
    name: "Aviation",
    seoTitle: "Operational Systems for Aviation Businesses",
    seoDescription:
      "Northbridge Digital helps aviation businesses find what is blocking growth—from scheduling and training operations to lead flow and reporting.",
    heroTitle: "Systems for aviation businesses that need clearer operations",
    heroSubtitle:
      "Flight schools, training providers, and aviation service organizations often outgrow spreadsheets and disconnected tools. We help you understand how the business works today and design a better way to operate.",
    overview: [
      "Aviation businesses combine regulated operations, scheduling complexity, and customer communication across long sales and training cycles.",
      "Many operators know their service quality is strong but struggle to see workload, pipeline, and performance in one place.",
      "Northbridge Digital focuses on practical systems—how leads enter, how work is scheduled, and how leaders measure progress.",
    ],
    challenges: [
      "Inquiries arrive through multiple channels with no consistent follow-up process",
      "Scheduling changes create rework for staff, instructors, or dispatch",
      "Training or service history lives in separate tools or inboxes",
      "Leadership lacks a simple view of capacity, pipeline, and outcomes",
    ],
    bottlenecks: [
      "Manual coordination between sales, scheduling, and delivery teams",
      "Duplicate data entry across forms, email, and spreadsheets",
      "Slow response to new student or customer inquiries",
      "Reporting assembled by hand at month-end",
    ],
    evaluations: [
      "How inquiries are captured, assigned, and followed up",
      "How scheduling and customer communication connect",
      "Which tools hold customer, job, and financial data",
      "What leaders review weekly to make decisions",
    ],
    improvements: [
      "Clearer lead intake and follow-up so fewer opportunities are missed",
      "Scheduling and communication workflows that reduce manual coordination",
      "Reporting that shows pipeline, utilization, and operational load",
      "Integrated tools or custom workflows where off-the-shelf products do not fit",
    ],
    solutions: [
      { label: "Customer Acquisition System", href: "/digital/assessment?need=more-customers" },
      { label: "Operations & Automation", href: "/digital/assessment?need=improve-operations" },
      { label: "Business Intelligence", href: "/digital/assessment?need=better-visibility" },
    ],
    relatedExpertise: [
      "customer-acquisition",
      "business-operations",
      "workflow-automation",
      "crm-customer-management",
    ],
  },
  {
    slug: "hvac",
    name: "HVAC",
    seoTitle: "Growth and Operations Systems for HVAC Companies",
    seoDescription:
      "Improve HVAC lead follow-up, dispatch coordination, and business visibility. Northbridge Digital helps service businesses find what is blocking growth.",
    heroTitle: "Help your HVAC business run with less friction",
    heroSubtitle:
      "Home services companies often lose revenue in the gap between marketing, dispatch, and the field. We help you understand that gap and design systems that support growth.",
    overview: [
      "HVAC and mechanical service businesses depend on fast lead response, reliable scheduling, and clear communication with customers and crews.",
      "As call volume and job complexity increase, informal processes stop working.",
      "Northbridge evaluates how work flows from first contact through completion and billing.",
    ],
    challenges: [
      "Leads from web, phone, and referrals are not tracked in one place",
      "Dispatch and office staff rely on texts and spreadsheets",
      "Seasonal demand makes capacity planning difficult",
      "Owners cannot easily see which channels or services drive margin",
    ],
    bottlenecks: [
      "Missed or slow callbacks on inbound leads",
      "Job details re-entered across estimate, schedule, and invoice tools",
      "Technician schedules changed without a single source of truth",
      "Marketing spend without clear attribution to booked jobs",
    ],
    evaluations: [
      "Lead capture paths from website, ads, and phone",
      "CRM or job management tools in use today",
      "Handoffs between office, dispatch, and field teams",
      "Reporting on leads, jobs, and revenue by source or service type",
    ],
    improvements: [
      "Lead capture and follow-up that matches how homeowners actually buy",
      "Operational workflows that reduce duplicate entry and missed updates",
      "Dashboards for pipeline, job load, and marketing performance",
      "Automation for reminders, status updates, and internal handoffs",
    ],
    solutions: [
      { label: "Customer Acquisition System", href: "/digital/assessment?need=more-customers" },
      { label: "Operations & Automation", href: "/digital/assessment?need=improve-operations" },
      { label: "Business Intelligence", href: "/digital/assessment?need=better-visibility" },
    ],
    relatedExpertise: [
      "customer-acquisition",
      "crm-customer-management",
      "workflow-automation",
      "analytics-reporting",
    ],
  },
  {
    slug: "construction",
    name: "Construction",
    seoTitle: "Systems for Contractors and Construction Firms",
    seoDescription:
      "Northbridge Digital helps construction businesses improve estimates, project coordination, and visibility—without generic software pitches.",
    heroTitle: "Clearer operations for construction and contracting businesses",
    heroSubtitle:
      "Contractors juggle estimates, subcontractors, change orders, and client communication. We help you see where time and margin leak out of the process.",
    overview: [
      "Construction businesses coordinate people, materials, timelines, and client expectations across every project.",
      "When information lives in email threads and shared drives, small errors become expensive delays.",
      "Northbridge focuses on how information moves from bid to closeout—not on selling a single software brand.",
    ],
    challenges: [
      "Estimates and proposals take too long to produce and track",
      "Project updates are scattered across email, texts, and spreadsheets",
      "Field and office teams work from different versions of the truth",
      "Leadership reviews financial performance too late to adjust",
    ],
    bottlenecks: [
      "Manual estimate follow-up and proposal versioning",
      "Scheduling subs and crews without integrated calendars",
      "Change orders documented informally",
      "Job costing assembled manually at project end",
    ],
    evaluations: [
      "How new opportunities are qualified and estimated",
      "Tools used for project communication and documentation",
      "Data shared between field, office, and accounting",
      "Metrics reviewed to judge project and business health",
    ],
    improvements: [
      "Faster, trackable estimate and proposal workflows",
      "Shared project visibility for office and field leadership",
      "Reporting on job pipeline, workload, and profitability signals",
      "Custom tools when standard construction software does not fit your process",
    ],
    solutions: [
      { label: "Operations & Automation", href: "/digital/assessment?need=improve-operations" },
      { label: "Business Intelligence", href: "/digital/assessment?need=better-visibility" },
      { label: "Custom Software", href: "/digital/assessment?need=custom-software" },
    ],
    relatedExpertise: [
      "business-operations",
      "business-intelligence",
      "workflow-automation",
      "custom-software",
    ],
  },
  {
    slug: "professional-services",
    name: "Professional Services",
    seoTitle: "Systems for Professional Service Firms",
    seoDescription:
      "Help your firm improve client acquisition, delivery workflows, and reporting. Northbridge Digital maps how your business actually operates.",
    heroTitle: "Better systems for firms that sell expertise",
    heroSubtitle:
      "Consulting, agency, and professional service businesses need pipeline clarity and delivery consistency. We help you measure what changes when you improve how work flows.",
    overview: [
      "Professional service firms sell trust and outcomes. That makes follow-up, scoping, and delivery coordination critical.",
      "Many firms grow through referrals but lack systems when demand increases.",
      "Northbridge evaluates the full client lifecycle—from first touch to delivery and renewal.",
    ],
    challenges: [
      "Inconsistent follow-up on inbound inquiries",
      "Proposals and SOWs created manually from old templates",
      "Project status hidden in individual inboxes",
      "No clear view of utilization, pipeline, or client profitability",
    ],
    bottlenecks: [
      "Partners or principals become the bottleneck for every decision",
      "CRM adopted partially or abandoned by the team",
      "Time tracking disconnected from project planning",
      "Reporting built in spreadsheets before leadership meetings",
    ],
    evaluations: [
      "How leads are qualified and handed to delivery",
      "CRM, project, and billing tool usage",
      "Client communication and handoff standards",
      "Metrics partners review for growth and capacity",
    ],
    improvements: [
      "Pipeline and follow-up systems aligned to how buyers choose firms",
      "Delivery workflows that reduce partner bottlenecks",
      "Dashboards for utilization, pipeline, and client health",
      "Automation for onboarding, status updates, and internal requests",
    ],
    solutions: [
      { label: "Customer Acquisition System", href: "/digital/assessment?need=more-customers" },
      { label: "Operations & Automation", href: "/digital/assessment?need=improve-operations" },
      { label: "Business Intelligence", href: "/digital/assessment?need=better-visibility" },
    ],
    relatedExpertise: [
      "customer-acquisition",
      "crm-customer-management",
      "business-intelligence",
      "analytics-reporting",
    ],
  },
  {
    slug: "logistics",
    name: "Logistics & Trucking",
    seoTitle: "Operational Systems for Logistics and Trucking",
    seoDescription:
      "Improve dispatch coordination, customer communication, and business visibility for logistics and trucking operators.",
    heroTitle: "Systems for logistics and trucking operators",
    heroSubtitle:
      "Moving freight depends on timing, communication, and accurate information. We help operators find what slows growth and design a better way to run the business.",
    overview: [
      "Logistics and trucking businesses coordinate drivers, dispatch, customers, and compliance-related documentation.",
      "Operational complexity increases quickly when loads are tracked informally.",
      "Northbridge maps how orders flow from booking through delivery and billing.",
    ],
    challenges: [
      "Dispatch relies on phone calls and informal updates",
      "Customers lack self-service visibility into load status",
      "Driver and asset utilization is hard to see in real time",
      "Back-office work duplicates data across TMS, accounting, and email",
    ],
    bottlenecks: [
      "Manual load assignment and status updates",
      "Proof of delivery and billing documents handled separately",
      "Customer quotes tracked outside a central system",
      "Leadership reporting delayed until accounts are reconciled",
    ],
    evaluations: [
      "How loads are booked, assigned, and updated",
      "Customer communication during transit and exceptions",
      "Tools connecting dispatch, fleet, and accounting",
      "KPIs used to judge lane, customer, and fleet performance",
    ],
    improvements: [
      "Dispatch workflows with fewer manual touchpoints",
      "Customer-facing status and inquiry paths that reduce call volume",
      "Operational dashboards for utilization and on-time performance",
      "Integrations or custom tools where existing TMS gaps persist",
    ],
    solutions: [
      { label: "Operations & Automation", href: "/digital/assessment?need=improve-operations" },
      { label: "Business Intelligence", href: "/digital/assessment?need=better-visibility" },
      { label: "Custom Software", href: "/digital/assessment?need=custom-software" },
    ],
    relatedExpertise: [
      "business-operations",
      "workflow-automation",
      "analytics-reporting",
      "custom-software",
    ],
  },
];

export function getIndustryBySlug(slug: string): IndustryContent | undefined {
  return industries.find((industry) => industry.slug === slug);
}

export function getIndustrySlugs(): string[] {
  return industries.map((industry) => industry.slug);
}
