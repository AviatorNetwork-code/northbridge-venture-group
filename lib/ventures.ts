export type Venture = {
  name: string;
  href: string;
  description: string;
  category?: string;
  positioning?: string;
  /** Who the platform is designed for (shown on full venture cards). */
  audience?: string[];
  capabilities?: string[];
  ctaLabel?: string;
  /** Internal routes use Next.js Link; external opens in a new tab. */
  external?: boolean;
  /** Non-link card for ventures not yet launched. */
  comingSoon?: boolean;
};

export const ventures: Venture[] = [
  {
    name: "Aviator Network",
    href: "https://aviatornetwork.com",
    category: "Flagship platform · Aviation",
    positioning: "The Operating System for Modern Aviation",
    description:
      "Aviator Network brings aviation tools, instructor connections, AI assistance, training management, and future aviation services into one connected platform.",
    audience: [
      "Student pilots",
      "Instructors",
      "Flight schools",
      "Aviation professionals",
    ],
    capabilities: [
      "CAT AI Assistant",
      "Instructor Marketplace",
      "Training Progress",
      "Logbook Intelligence",
      "Flight School Tools",
      "Aviation Community",
      "Career Development",
    ],
    ctaLabel: "Explore the platform",
    external: true,
  },
  {
    name: "Quadrix",
    href: "",
    category: "Coming Soon",
    description:
      "A Northbridge-owned venture in development—built to extend the group’s platform footprint in aviation and adjacent markets.",
    comingSoon: true,
  },
  {
    name: "AirTax Financial",
    href: "https://airtaxfinancial.com",
    description:
      "Premium tax and financial services for pilots and aviation professionals—filing support, notices, and guidance.",
    external: true,
  },
  {
    name: "Future Ventures",
    href: "",
    category: "Coming Soon",
    description:
      "Additional Northbridge-owned platforms in development across aviation, financial services, and related industries.",
    comingSoon: true,
  },
];
