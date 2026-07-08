import Link from "next/link";

export const operationsNav = [
  {
    href: "/operations",
    label: "Executive Dashboard",
    shortLabel: "Dashboard",
  },
  {
    href: "/operations/workforce",
    label: "Digital Workforce",
    shortLabel: "Workforce",
  },
  {
    href: "/operations/connectors",
    label: "Connector Center",
    shortLabel: "Connectors",
  },
  {
    href: "/operations/onboarding",
    label: "Customer Onboarding",
    shortLabel: "Onboarding",
  },
  {
    href: "/operations/workflows",
    label: "Workflow Center",
    shortLabel: "Workflows",
  },
  {
    href: "/operations/communications",
    label: "Communications",
    shortLabel: "Comms",
  },
  {
    href: "/operations/command",
    label: "AI Command Center",
    shortLabel: "Command",
  },
  {
    href: "/operations/analytics",
    label: "Analytics",
    shortLabel: "Analytics",
  },
] as const;

export function OpsNavLink({
  href,
  label,
  active,
  compact,
}: {
  href: string;
  label: string;
  active: boolean;
  compact?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`block px-3 py-2.5 text-sm transition-colors border-l-2 ${
        active
          ? "border-red bg-white/5 text-white font-medium"
          : "border-transparent text-silver hover:text-white hover:bg-white/5"
      } ${compact ? "text-xs py-2" : ""}`}
    >
      {label}
    </Link>
  );
}
