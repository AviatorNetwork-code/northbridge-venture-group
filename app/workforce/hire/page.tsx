import type { Metadata } from "next";
import HireFlow from "@/components/HireFlow";
import CatAdvisor from "@/components/CatAdvisor";

export const metadata: Metadata = {
  title: "Hire a Digital Workforce | Northbridge Digital",
  description:
    "Discover, choose, and start onboarding your Northbridge digital workforce. CAT recommends the smallest useful solution — Specialist, Team, or Manager — with Colombia and U.S. pricing.",
};

export default function HireWorkforcePage() {
  return (
    <main className="bg-black min-h-screen pt-24 sm:pt-28 md:pt-32 pb-24 sm:pb-28 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto mb-8 sm:mb-10">
        <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-red mb-2">
          Hire your workforce
        </p>
        <p className="text-silver text-sm sm:text-base max-w-2xl leading-relaxed">
          A guided, four-step setup — discovery, recommendation, onboarding, and
          hire. No payment is taken and nothing is provisioned yet.
        </p>
      </div>

      <HireFlow />

      {/* CAT top-center advisor entry + mock consultation panel */}
      <CatAdvisor />
    </main>
  );
}
