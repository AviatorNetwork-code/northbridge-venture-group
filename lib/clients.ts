export type Client = {
  name: string;
  description: string;
  website?: string;
  location?: string;
  category?: string;
  caseStudyHref?: string;
};

export const clients: Client[] = [
  {
    name: "Royal International Flight School",
    description: "Flight training and aviation education.",
  },
  {
    name: "Florida Air & Mechanical Contractors LLC",
    website: "https://www.flairmec.com",
    location: "Orlando, Florida",
    category: "HVAC / Mechanical Contractor",
    description:
      "Digital infrastructure build for an HVAC and mechanical contractor, including branded web presence, segmented service architecture, lead capture systems, SEO landing pages, branded email routing, and payment-readiness infrastructure.",
    caseStudyHref: "/case-studies/florida-air-mechanical",
  },
];
