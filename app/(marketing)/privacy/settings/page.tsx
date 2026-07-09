import type { Metadata } from "next";
import PrivacySettingsPanel from "@/components/home/PrivacySettingsPanel";

export const metadata: Metadata = {
  title: "Privacy Settings | Northbridge Digital",
  description: "Manage how Nordi uses your conversations for product learning.",
};

export default function PrivacySettingsPage() {
  return (
    <main className="min-h-screen bg-black px-4 pb-16 pt-24 sm:px-6 sm:pt-28 md:pt-32 md:pb-24">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Privacy Settings
        </h1>
        <p className="mb-10 max-w-2xl text-sm leading-relaxed text-silver sm:text-base">
          You stay in control of how Nordi uses your conversations. These settings apply to future
          learning eligibility only.
        </p>

        <PrivacySettingsPanel />
      </div>
    </main>
  );
}
