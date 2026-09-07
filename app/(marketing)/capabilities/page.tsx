import type { Metadata } from "next";
import Link from "next/link";
import MarketingPrimaryCta from "@/components/MarketingPrimaryCta";
import { SectionHeader } from "@/components/marketing/IntentCard";
import { capabilityRegistry } from "@/lib/nordy/capability-registry";
import { openNordyHref } from "@/lib/nordy/routes";

export const metadata: Metadata = {
  title: "Capabilities",
  description:
    "Northbridge capabilities across Engineering & AI and Digital — automation, AI integration, custom software, websites, portals, and mobile apps.",
};

export default function CapabilitiesPage() {
  const engineering = capabilityRegistry.filter((c) => c.division === "ENGINEERING_AI");
  const digital = capabilityRegistry.filter((c) => c.division === "DIGITAL");

  return (
    <main className="min-h-screen bg-black px-4 pb-16 pt-24 sm:px-6 sm:pb-24 sm:pt-28 md:pt-32">
      <div className="mx-auto max-w-5xl">
        <SectionHeader
          eyebrow="Capabilities"
          title="What Northbridge can deliver"
          description="Commercial themes include business automation, AI integration, custom software, workflow automation, custom SaaS, mobile app development, and custom web applications — nationally, discoverable in Orlando / Central Florida."
        />

        <div className="mt-8">
          <MarketingPrimaryCta
            href={openNordyHref("GENERAL")}
            primaryLabel="Talk to Nordi"
            secondaryHref="/contact"
            secondaryLabel="Contact"
          />
        </div>

        <section className="mb-12">
          <div className="mb-4 flex items-end justify-between gap-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-red sm:text-sm">
              Engineering & AI
            </h2>
            <Link href="/engineering-ai" className="text-sm text-silver hover:text-white">
              Details →
            </Link>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {engineering.map((item) => (
              <li
                key={item.id}
                className="rounded-xl border border-white/10 bg-[#0b1017] px-4 py-4 text-sm text-silver"
              >
                <span className="font-semibold text-white">{item.title}</span>
                <p className="mt-1">{item.summary}</p>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <div className="mb-4 flex items-end justify-between gap-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-red sm:text-sm">
              Digital
            </h2>
            <Link href="/digital" className="text-sm text-silver hover:text-white">
              Details →
            </Link>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {digital.map((item) => (
              <li
                key={item.id}
                className="rounded-xl border border-white/10 bg-[#0b1017] px-4 py-4 text-sm text-silver"
              >
                <span className="font-semibold text-white">{item.title}</span>
                <p className="mt-1">{item.summary}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
