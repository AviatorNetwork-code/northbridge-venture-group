import type { Metadata } from "next";
import OpsLayoutClient from "@/components/ops/OpsLayoutClient";

export const metadata: Metadata = {
  title: "AI Operations Center | Northbridge",
  description: "Real-time AI operations control center for Northbridge Venture Group.",
};

export default function OpsLayout({ children }: { children: React.ReactNode }) {
  return <OpsLayoutClient>{children}</OpsLayoutClient>;
}
