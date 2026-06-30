import type { Venture } from "@/lib/ventures";

/** Northbridge-owned platforms — proof of capability, not the primary sales offer. */
export const platforms: Venture[] = [
  {
    name: "Aviator Network",
    href: "https://aviatornetwork.com",
    category: "Aviation platform",
    positioning: "Complex aviation software at scale",
    description:
      "Proof of Northbridge's capability to design and operate a multi-sided aviation software ecosystem—training operations, instructor coordination, and connected services in a regulated domain.",
    ctaLabel: "View Aviator Network",
    external: true,
  },
  {
    name: "Workforce Operations Platform",
    href: "",
    category: "In development",
    positioning: "Workforce coordination systems",
    description:
      "Demonstrates Northbridge's ability to build scheduling, staffing, and operational coordination systems—originally scoped for aviation and adaptable to other workforce-driven industries.",
    comingSoon: true,
  },
  {
    name: "Trucker Network",
    href: "",
    category: "In development",
    positioning: "Operational platform engineering",
    description:
      "Demonstrates operational platform engineering for logistics—community systems, driver-facing tooling, and coordination infrastructure for workforce-driven transportation operations.",
    comingSoon: true,
  },
  {
    name: "Quadrix",
    href: "",
    category: "In development",
    positioning: "Real-time engineering at scale",
    description:
      "Demonstrates real-time engineering, multiplayer infrastructure, product design, and system architecture—proof that Northbridge can build responsive, high-concurrency platforms.",
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
      "Demonstrates Northbridge's ability to deliver specialized professional-services platforms—domain-specific workflows for aviation financial services.",
    external: true,
  },
];
