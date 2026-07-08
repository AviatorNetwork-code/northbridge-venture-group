import type { Metadata } from "next";
import LaunchExperience from "@/components/launch/LaunchExperience";

export const metadata: Metadata = {
  title: "Launch Readiness | AI Operations Center",
  robots: { index: false, follow: false },
};

export default function LaunchPage() {
  return <LaunchExperience />;
}
