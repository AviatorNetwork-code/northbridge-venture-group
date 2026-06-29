import type { Venture } from "@/lib/ventures";

/** Northbridge-owned platforms — proof of capability, not the primary sales offer. */
export const platforms: Venture[] = [
  {
    name: "Aviator Network",
    href: "https://aviatornetwork.com",
    category: "Aviation platform",
    positioning: "The Operating System for Modern Aviation",
    description:
      "Aviator Network brings aviation tools, instructor connections, AI assistance, training management, and connected aviation services into one platform.",
    ctaLabel: "Explore Aviator Network",
    external: true,
  },
  {
    name: "Workforce Operations Platform",
    href: "",
    category: "In development",
    positioning: "Intelligent workforce coordination",
    description:
      "Intelligent scheduling, staffing, and operational support originally developed for aviation and adaptable to other workforce-driven industries.",
    comingSoon: true,
  },
  {
    name: "Trucker Network",
    href: "",
    category: "In development",
    positioning: "Connected logistics operations",
    description:
      "Connected tools for professional drivers and logistics operations—designed to support coordination, visibility, and workforce-driven workflows.",
    comingSoon: true,
  },
  {
    name: "Quadrix",
    href: "",
    category: "In development",
    positioning: "Real-time systems at scale",
    description:
      "Strategic gaming platform demonstrating real-time systems, multiplayer infrastructure, and product design—proof of Northbridge engineering capability.",
    comingSoon: true,
  },
];

/** Additional platform not featured on the home grid. */
export const additionalPlatforms: Venture[] = [
  {
    name: "AirTax Financial",
    href: "https://airtaxfinancial.com",
    category: "Financial services",
    description:
      "Tax and financial services for pilots and aviation professionals—filing support, notices, and guidance.",
    external: true,
  },
];
