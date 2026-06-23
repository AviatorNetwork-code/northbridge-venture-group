export type Client = {
  name: string;
  description: string;
  website?: string;
  location?: string;
  category?: string;
  capabilities?: string[];
  caseStudyHref?: string;
};

export const clients: Client[] = [
  {
    name: "Royal International Flight School",
    website: "https://www.royalinternationalflightschool.com",
    description:
      "Professional aviation training website built for a Kissimmee-based flight school, focused on student pilot acquisition, orientation booking, program clarity, safety-first messaging, social media connection, and student portal access.",
    location: "Kissimmee, Florida",
    category: "Flight School / Aviation Training",
    capabilities: [
      "Student Pilot Acquisition",
      "Orientation Booking",
      "Aviation Website",
      "Training Program Structure",
      "Student Portal Access",
      "Social Media Integration",
    ],
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
