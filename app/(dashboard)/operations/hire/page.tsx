import type { Metadata } from "next";
import HireExperience from "@/components/hire/HireExperience";

export const metadata: Metadata = {
  title: "Hire Workforce | AI Operations Center",
  robots: { index: false, follow: false },
};

export default function HirePage() {
  return <HireExperience />;
}
