export type ExpertiseContent = {
  slug: string;
  name: string;
  seoTitle: string;
  seoDescription: string;
  heroTitle: string;
  heroSubtitle: string;
  problemStatement: string[];
  whyStruggle: string[];
  approach: string[];
  successMetrics: string[];
  relatedIndustries: string[];
  relatedSolutions: { label: string; href: string }[];
};

export const expertiseAreas: ExpertiseContent[] = [
  {
    slug: "customer-acquisition",
    name: "Customer Acquisition",
    seoTitle: "Customer Acquisition Systems",
    seoDescription:
      "Why website visitors do not buy, how to improve lead follow-up, and how Northbridge helps businesses fix customer acquisition bottlenecks.",
    heroTitle: "Turn more interest into booked work",
    heroSubtitle:
      "Traffic alone does not grow a business. We help you understand where prospects drop off and design acquisition systems that match how your buyers actually decide.",
    problemStatement: [
      "Many businesses invest in a website or ads but cannot explain why inquiries do not convert.",
      "Leads sit in inboxes, forms go to the wrong person, and follow-up timing is inconsistent.",
      "Without a clear acquisition path, growth depends on luck and whoever answers the phone fastest.",
    ],
    whyStruggle: [
      "No single view of leads across web forms, phone, email, and referrals",
      "Marketing and sales use different definitions of a qualified lead",
      "Slow response times—especially after hours or on weekends",
      "Landing pages and offers disconnected from how the sales team actually closes",
    ],
    approach: [
      "Map how prospects discover you, inquire, and become customers",
      "Identify handoff points where leads stall or disappear",
      "Design capture, routing, and follow-up workflows your team will use",
      "Measure response time, conversion by source, and cost per booked opportunity",
    ],
    successMetrics: [
      "Time from inquiry to first meaningful response",
      "Conversion rate by lead source and service line",
      "Pipeline volume and stage progression",
      "Marketing spend tied to booked revenue—not just clicks",
    ],
    relatedIndustries: ["hvac", "aviation", "professional-services"],
    relatedSolutions: [
      { label: "Customer Acquisition System", href: "/digital/assessment?need=more-customers" },
      { label: "CRM & Customer Management", href: "/services/expertise/crm-customer-management" },
    ],
  },
  {
    slug: "business-operations",
    name: "Business Operations",
    seoTitle: "Business Operations Improvement",
    seoDescription:
      "How to improve business operations, reduce manual work, and design workflows that scale. Practical guidance from Northbridge Digital.",
    heroTitle: "Understand how your business works—and fix what slows it down",
    heroSubtitle:
      "Operational problems rarely show up as one broken tool. They show up as rework, delays, and teams working around the process instead of with it.",
    problemStatement: [
      "Owners know something is inefficient but struggle to name the root cause.",
      "Teams compensate with extra hours, spreadsheets, and side conversations.",
      "Growth adds complexity faster than processes are redesigned.",
    ],
    whyStruggle: [
      "Processes grew organically without documentation or ownership",
      "Each department optimizes locally while the handoffs suffer",
      "Software was added to solve symptoms, not workflow design",
      "No one measures cycle time, error rate, or rework",
    ],
    approach: [
      "Document how work actually flows today—not how it is supposed to on paper",
      "Prioritize bottlenecks by business impact and feasibility",
      "Redesign handoffs, approvals, and data entry with the people who do the work",
      "Introduce automation only where the process is already clear",
    ],
    successMetrics: [
      "Cycle time from request to completion",
      "Volume of manual re-entry or duplicate data",
      "Error or rework rate on critical workflows",
      "Team capacity freed for higher-value work",
    ],
    relatedIndustries: ["construction", "logistics", "hvac"],
    relatedSolutions: [
      { label: "Operations & Automation", href: "/digital/assessment?need=improve-operations" },
      { label: "Workflow Automation", href: "/services/expertise/workflow-automation" },
    ],
  },
  {
    slug: "business-intelligence",
    name: "Business Intelligence",
    seoTitle: "Business Intelligence for Growing Companies",
    seoDescription:
      "Business intelligence for small and mid-sized businesses—dashboards, KPIs, and reporting that help owners measure what changes.",
    heroTitle: "See what is happening in your business without waiting for month-end",
    heroSubtitle:
      "Leaders make better decisions when pipeline, workload, and performance are visible in one place—not buried in exports and email attachments.",
    problemStatement: [
      "Critical numbers live in separate systems with no shared definitions.",
      "Meetings start with debating the data instead of deciding what to do.",
      "Owners rely on gut feel because building reports takes too long.",
    ],
    whyStruggle: [
      "CRM, accounting, and operations tools do not share a common data model",
      "KPIs are undefined or change every quarter",
      "Reports are built manually for each leadership conversation",
      "Teams distrust numbers they cannot trace to source records",
    ],
    approach: [
      "Define a small set of metrics tied to real decisions",
      "Identify authoritative sources for each metric",
      "Build dashboards leaders will review on a regular cadence",
      "Iterate as the business learns which signals matter most",
    ],
    successMetrics: [
      "Time to produce leadership-ready reporting",
      "Adoption: are dashboards reviewed weekly?",
      "Decision speed on pipeline, capacity, and margin questions",
      "Alignment on metric definitions across teams",
    ],
    relatedIndustries: ["construction", "professional-services", "logistics"],
    relatedSolutions: [
      { label: "Business Intelligence", href: "/digital/assessment?need=better-visibility" },
      { label: "Analytics & Reporting", href: "/services/expertise/analytics-reporting" },
    ],
  },
  {
    slug: "analytics-reporting",
    name: "Analytics & Reporting",
    seoTitle: "Business Analytics and Reporting",
    seoDescription:
      "Business analytics for small business—track marketing, operations, and financial signals without drowning in spreadsheets.",
    heroTitle: "Reporting that answers real questions",
    heroSubtitle:
      "Analytics should help you act—not produce charts no one uses. We focus on the questions owners ask every week.",
    problemStatement: [
      "Businesses collect data in many tools but cannot answer simple questions quickly.",
      "Marketing reports show activity; operations reports show backlog—neither connects to revenue.",
      "Spreadsheet reporting breaks when volume grows.",
    ],
    whyStruggle: [
      "No standard report pack for leadership reviews",
      "Web analytics disconnected from CRM and sales outcomes",
      "Manual exports introduce errors and delays",
      "Teams report what is easy to pull, not what matters",
    ],
    approach: [
      "Start with the decisions you need to make—not every possible metric",
      "Connect marketing, sales, and delivery data where handoffs matter",
      "Automate recurring reports instead of rebuilding them monthly",
      "Train owners and managers to read signals, not just totals",
    ],
    successMetrics: [
      "Hours saved on manual report assembly",
      "Clarity on channel and service-line performance",
      "Faster identification of trends and anomalies",
      "Fewer surprises in monthly financial reviews",
    ],
    relatedIndustries: ["hvac", "professional-services", "aviation"],
    relatedSolutions: [
      { label: "Business Intelligence", href: "/digital/assessment?need=better-visibility" },
      { label: "Customer Acquisition", href: "/services/expertise/customer-acquisition" },
    ],
  },
  {
    slug: "crm-customer-management",
    name: "CRM & Customer Management",
    seoTitle: "CRM and Customer Management Systems",
    seoDescription:
      "CRM for service businesses—including HVAC and professional firms. Northbridge helps you choose, configure, or build customer management that fits.",
    heroTitle: "Customer records your team will actually use",
    heroSubtitle:
      "A CRM only works when it matches how you sell and deliver. We help you design customer management around real workflows—not software defaults.",
    problemStatement: [
      "Contacts and history are split across email, texts, spreadsheets, and sticky notes.",
      "Follow-up depends on individual memory instead of system reminders.",
      "Leadership cannot see pipeline health without asking each rep.",
    ],
    whyStruggle: [
      "CRM implemented as a data entry chore with no clear payoff",
      "Fields and stages do not match how the business sells",
      "Integrations missing between web forms, phone, and job systems",
      "No ownership for data quality and pipeline hygiene",
    ],
    approach: [
      "Define customer lifecycle stages your team recognizes",
      "Configure or build CRM views for daily work—not just management reports",
      "Connect lead sources and delivery tools to reduce duplicate entry",
      "Establish simple hygiene habits: ownership, follow-up rules, and reviews",
    ],
    successMetrics: [
      "Pipeline visibility by stage and owner",
      "Follow-up completion rate on open opportunities",
      "Reduction in lost leads due to poor handoffs",
      "CRM adoption measured by weekly active use",
    ],
    relatedIndustries: ["hvac", "professional-services", "aviation"],
    relatedSolutions: [
      { label: "Customer Acquisition System", href: "/digital/assessment?need=more-customers" },
      { label: "Workflow Automation", href: "/services/expertise/workflow-automation" },
    ],
  },
  {
    slug: "workflow-automation",
    name: "Workflow Automation",
    seoTitle: "Workflow Automation for Business",
    seoDescription:
      "How to automate your business workflows—notifications, handoffs, and repetitive tasks—without breaking how your team works.",
    heroTitle: "Automate repeat work—not judgment",
    heroSubtitle:
      "Automation works when the underlying process is clear. We help you remove manual steps that waste time without forcing rigid software on flexible teams.",
    problemStatement: [
      "Staff spend hours on reminders, copy-paste, and status updates.",
      "Handoffs fail silently when someone is out or overloaded.",
      "Owners want automation but fear breaking something that currently works.",
    ],
    whyStruggle: [
      "Processes undocumented—automation targets symptoms",
      "Too many one-off tools with no connections",
      "Exceptions handled outside the system, undermining trust",
      "No measurement of time saved or errors reduced",
    ],
    approach: [
      "Map high-volume, low-judgment tasks first",
      "Automate notifications, assignments, and data sync between tools",
      "Keep human approval points where quality or compliance matters",
      "Measure before and after on time, errors, and customer response",
    ],
    successMetrics: [
      "Hours removed from manual coordination per week",
      "Fewer missed handoffs or duplicate tasks",
      "Faster customer-facing status updates",
      "Stable exception handling when automation edge cases appear",
    ],
    relatedIndustries: ["logistics", "construction", "hvac"],
    relatedSolutions: [
      { label: "Operations & Automation", href: "/digital/assessment?need=improve-operations" },
      { label: "AI Integration", href: "/services/expertise/ai-integration" },
    ],
  },
  {
    slug: "ai-integration",
    name: "AI Integration",
    seoTitle: "Practical AI Integration for Business",
    seoDescription:
      "Practical AI integration for business operations—where automation and intelligence help without replacing your team's judgment.",
    heroTitle: "Use AI where it removes friction—not where it adds risk",
    heroSubtitle:
      "AI can speed up research, drafting, routing, and pattern detection. We help you integrate it into workflows you already trust.",
    problemStatement: [
      "Teams experiment with AI tools individually with no governance or shared benefit.",
      "Leaders hear hype but cannot point to a safe, measurable use case.",
      "Sensitive customer or operational data needs clear boundaries.",
    ],
    whyStruggle: [
      "No policy on what data can enter external AI tools",
      "Use cases chosen for novelty instead of operational impact",
      "Outputs not reviewed before reaching customers",
      "No baseline metrics to judge whether AI helped",
    ],
    approach: [
      "Identify repetitive cognitive work: summarization, classification, routing",
      "Define data boundaries and human review requirements",
      "Pilot one workflow with clear before/after measurement",
      "Scale only what proves reliable in real operations",
    ],
    successMetrics: [
      "Time saved on targeted tasks",
      "Quality of AI-assisted outputs after human review",
      "Reduction in routing or triage errors",
      "Team adoption without bypassing governance",
    ],
    relatedIndustries: ["professional-services", "aviation", "logistics"],
    relatedSolutions: [
      { label: "Operations & Automation", href: "/digital/assessment?need=improve-operations" },
      { label: "Custom Software", href: "/services/expertise/custom-software" },
    ],
  },
  {
    slug: "custom-software",
    name: "Custom Software",
    seoTitle: "Custom Business Software Development",
    seoDescription:
      "Custom software when off-the-shelf products do not fit your workflow. Northbridge designs systems around how your business operates.",
    heroTitle: "Software built around your process—not the other way around",
    heroSubtitle:
      "Sometimes spreadsheets and generic SaaS stop working. We help you decide when custom software is justified and how to build something maintainable.",
    problemStatement: [
      "Critical workflows are forced into tools that almost fit.",
      "Teams maintain shadow spreadsheets because the official system cannot adapt.",
      "Previous custom projects failed from unclear scope or no owner after launch.",
    ],
    whyStruggle: [
      "Requirements discovered during use, not before build",
      "No internal owner for product decisions after vendor handoff",
      "Integrations treated as afterthoughts",
      "Success defined as launch date instead of daily adoption",
    ],
    approach: [
      "Validate the workflow and metrics before writing code",
      "Scope an MVP that solves the highest-impact problem first",
      "Design for integration with accounting, CRM, and operations tools",
      "Plan ownership, support, and iteration after go-live",
    ],
    successMetrics: [
      "Daily active use by the intended team",
      "Reduction in spreadsheet or manual workaround volume",
      "Cycle time improvement on the target workflow",
      "Maintainability: can the business evolve the system over time?",
    ],
    relatedIndustries: ["construction", "logistics", "aviation"],
    relatedSolutions: [
      { label: "Custom Software", href: "/digital/assessment?need=custom-software" },
      { label: "Workflow Automation", href: "/services/expertise/workflow-automation" },
    ],
  },
];

export function getExpertiseBySlug(slug: string): ExpertiseContent | undefined {
  return expertiseAreas.find((area) => area.slug === slug);
}

export function getExpertiseSlugs(): string[] {
  return expertiseAreas.map((area) => area.slug);
}
