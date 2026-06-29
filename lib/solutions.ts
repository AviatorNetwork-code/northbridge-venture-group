export type BusinessSolution = {
  slug: string;
  name: string;
  seoTitle: string;
  seoDescription: string;
  summary: string;
  problem: string[];
  whoItHelps: string[];
  whatWeEvaluate: string[];
  exampleIndustries: string[];
};

export const businessSolutions: BusinessSolution[] = [
  {
    slug: "workforce-operations",
    name: "Workforce Operations",
    seoTitle: "Workforce Operations Solutions",
    seoDescription:
      "Northbridge helps businesses improve scheduling, staffing coordination, and day-to-day workforce operations—starting with how work actually gets done.",
    summary:
      "Scheduling, staffing, handoffs, and operational visibility for teams that run on people—not just software.",
    problem: [
      "Schedules live in spreadsheets, group texts, and memory—changes do not reach everyone who needs them.",
      "Managers spend hours reconciling availability, assignments, and last-minute coverage gaps.",
      "Operational data is scattered, so leadership cannot see bottlenecks until customers feel them.",
    ],
    whoItHelps: [
      "Owners and operations leaders at workforce-driven businesses",
      "Dispatchers, schedulers, and front-line managers",
      "Organizations scaling headcount without scaling chaos",
    ],
    whatWeEvaluate: [
      "How schedules are built, changed, and communicated today",
      "Handoffs between roles, shifts, and locations",
      "Where manual coordination creates delays or errors",
      "What data exists—and what decisions it could support",
    ],
    exampleIndustries: [
      "Aviation training and flight operations",
      "HVAC and field service",
      "Logistics and trucking",
      "Healthcare and professional services with shift-based teams",
    ],
  },
  {
    slug: "customer-acquisition",
    name: "Customer Acquisition",
    seoTitle: "Customer Acquisition Solutions",
    seoDescription:
      "Northbridge helps businesses fix lead follow-up, inquiry routing, and the path from interest to booked work.",
    summary:
      "Turn more interest into booked work—with clearer capture, routing, and follow-up across your sales path.",
    problem: [
      "Inquiries arrive through multiple channels but no single system tracks them to outcome.",
      "Response time is inconsistent—especially after hours—and leads go cold.",
      "Marketing and sales describe success differently, so improvement is hard to measure.",
    ],
    whoItHelps: [
      "Owners who invest in visibility but struggle to convert interest",
      "Sales and office teams responsible for follow-up",
      "Businesses where speed-to-response directly affects revenue",
    ],
    whatWeEvaluate: [
      "How prospects discover you, inquire, and become customers",
      "Lead capture points, routing rules, and ownership",
      "Response time, drop-off stages, and handoff quality",
      "What your team needs to prioritize the right opportunities",
    ],
    exampleIndustries: [
      "HVAC and home services",
      "Construction and trades",
      "Aviation training providers",
      "Professional services firms",
    ],
  },
  {
    slug: "business-intelligence",
    name: "Business Intelligence",
    seoTitle: "Business Intelligence Solutions",
    seoDescription:
      "Northbridge helps leadership teams see performance clearly—with practical reporting, dashboards, and metrics tied to decisions.",
    summary:
      "Reporting and visibility that leadership can act on—not dashboards nobody opens.",
    problem: [
      "Data exists in multiple systems but no one view answers basic business questions.",
      "Reports are built manually each month and are outdated by the time they are shared.",
      "Teams debate numbers because definitions and sources are inconsistent.",
    ],
    whoItHelps: [
      "Owners and executives who need clarity without a data science team",
      "Operations leaders tracking throughput, margin, and utilization",
      "Growing businesses outgrowing spreadsheet-based reporting",
    ],
    whatWeEvaluate: [
      "What decisions you need data to support—and how often",
      "Where data lives today and how reliable it is",
      "Gaps between operational reality and what leadership sees",
      "The minimum viable reporting layer your team will actually use",
    ],
    exampleIndustries: [
      "Multi-location service businesses",
      "Logistics and transportation",
      "Aviation operations",
      "Construction and project-based firms",
    ],
  },
  {
    slug: "automation",
    name: "Automation",
    seoTitle: "Business Automation Solutions",
    seoDescription:
      "Northbridge designs automation where processes are clear—reducing repetitive work without adding fragile complexity.",
    summary:
      "Reduce repetitive manual work by automating steps that are well-defined and repeatable.",
    problem: [
      "Teams repeat the same data entry, notifications, and approvals across tools.",
      "Automation was attempted before but broke when the process changed.",
      "Nobody owns which tasks should be automated versus redesigned.",
    ],
    whoItHelps: [
      "Operations teams buried in administrative repetition",
      "Owners who want leverage without hiring for every manual task",
      "Businesses ready to document process before adding tools",
    ],
    whatWeEvaluate: [
      "Which tasks are high-volume, repeatable, and rule-based",
      "Where automation would remove friction versus hide a broken process",
      "Integration points between your existing systems",
      "How changes would be monitored and maintained over time",
    ],
    exampleIndustries: [
      "Field service and dispatch operations",
      "Professional services with intake workflows",
      "Training providers with enrollment and scheduling steps",
      "Logistics with status updates and customer communication",
    ],
  },
  {
    slug: "mobile-web-applications",
    name: "Mobile & Web Applications",
    seoTitle: "Mobile and Web Application Solutions",
    seoDescription:
      "Northbridge delivers practical web and mobile applications when off-the-shelf software does not fit how your business operates.",
    summary:
      "Customer-facing and internal applications designed around your workflow—not generic templates.",
    problem: [
      "Off-the-shelf software forces awkward workarounds for how your team actually operates.",
      "Customer experience suffers when portals, forms, and apps do not match your process.",
      "Internal tools are fragmented across spreadsheets and legacy systems.",
    ],
    whoItHelps: [
      "Businesses with a defined workflow that standard software cannot support",
      "Teams needing customer portals, internal tools, or field-ready mobile access",
      "Leaders who want software that matches operations—not the other way around",
    ],
    whatWeEvaluate: [
      "Who uses the application, when, and on what devices",
      "Core workflows the application must support end-to-end",
      "Integration requirements with existing systems",
      "What success looks like for users and for the business",
    ],
    exampleIndustries: [
      "Aviation training and operations",
      "HVAC and field service",
      "Logistics and driver-facing tools",
      "Construction and project coordination",
    ],
  },
  {
    slug: "custom-business-solutions",
    name: "Custom Business Solutions",
    seoTitle: "Custom Business Solutions",
    seoDescription:
      "When your situation does not fit a standard category, Northbridge designs a tailored combination of process, technology, and software.",
    summary:
      "A tailored path when your business needs a specific combination of process design, systems, and build work.",
    problem: [
      "Your challenge spans multiple areas—operations, acquisition, and systems—and no single product addresses it.",
      "Previous vendors delivered pieces without connecting them to how the business runs.",
      "You need a partner who starts with the business problem, not a technology preset.",
    ],
    whoItHelps: [
      "Owners with a complex operational challenge and no off-the-shelf answer",
      "Businesses combining advisory work with custom build when needed",
      "Teams ready to collaborate on scope before committing to build",
    ],
    whatWeEvaluate: [
      "The business outcome you need—not just the feature list",
      "Constraints: timeline, team capacity, compliance, and budget range",
      "What can be improved with process versus what requires custom software",
      "How Northbridge Digital fits if a build phase is required",
    ],
    exampleIndustries: [
      "Aviation and training ecosystems",
      "Multi-location service businesses",
      "Logistics and workforce-driven operations",
      "Professional services scaling delivery",
    ],
  },
];

export function getSolutionBySlug(slug: string): BusinessSolution | undefined {
  return businessSolutions.find((s) => s.slug === slug);
}

export function getSolutionSlugs(): string[] {
  return businessSolutions.map((s) => s.slug);
}
