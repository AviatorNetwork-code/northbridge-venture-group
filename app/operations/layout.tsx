import type { Metadata } from "next";
import OpsShell from "@/components/operations/shell/OpsShell";

export const metadata: Metadata = {
  title: "AI Operations Center | Northbridge Digital",
  description:
    "Command center for managing your digital workforce, connectors, workflows, and customer operations.",
  robots: { index: false, follow: false },
};

export default function OperationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <OpsShell>{children}</OpsShell>;
}
