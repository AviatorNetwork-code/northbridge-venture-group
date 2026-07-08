import type { Metadata } from "next";
import OperationsShell from "@/components/operations/OperationsShell";

export const metadata: Metadata = {
  title: "AI Operations Center | Northbridge Venture Group",
  description: "Customer application shell for the Northbridge AI Operations Center.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function OperationsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <OperationsShell>{children}</OperationsShell>;
}
