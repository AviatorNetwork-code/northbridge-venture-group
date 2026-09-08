import type { Metadata } from "next";
import MarketingPrimaryCta from "@/components/MarketingPrimaryCta";
import { SectionHeader } from "@/components/marketing/IntentCard";
import { capabilityRegistry } from "@/lib/nordy/capability-registry";
import { openNordyHref } from "@/lib/nordy/routes";

export const metadata: Metadata = {
  title: "Engineering & AI",
  description:
    "Northbridge Engineering & AI — business systems audits, automation, custom software, AI copilots, integrations, and modernization for operators.",
  openGraph: {
    title: "Engineering & AI | Northbridge Venture Group",
    description:
      "Systems audits, automation, custom software, AI copilots, and integrations for operators.",
  },
};

const offers = [
  "Systems Audit",
  "Automation / AI Audit",
  "Custom System Implementation",
  "Operational Platform",
  "AI Copilot",
  "Managed Engineering",
];

export default function EngineeringAiPage() {
  const services = capabilityRegistry.filter((item) => item.division === "ENGINEERING_AI");

  return (
    <main className="min-h-screen bg-black px-4 pb-16 pt-24 sm:px-6 sm:pb-24 sm:pt-28 md:pt-32">
      <div className="mx-auto max-w-5xl">
        <SectionHeader
          eyebrow="Northbridge Engineering & AI"
          title="Premium systems work for real operational problems"
          description="Business automation, AI integration, custom internal systems, SaaS, copilots, architecture, and modernization — outcomes first, not body-shop programming."
        />

        <div className="mt-8">
          <MarketingPrimaryCta
            href={openNordyHref("ENGINEERING_AI")}
            primaryLabel="Start with Nordi"
            secondaryHref="/contact"
            secondaryLabel="Request contact"
          />
        </div>

        <section className="mb-12 grid gap-4 sm:grid-cols-2">
          {services.map((service) => (
            <article
              key={service.id}
              className="rounded-2xl border border-white/10 bg-[#0b1017] p-5 illum-l1"
            >
              <h2 className="text-lg font-semibold text-white">{service.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-silver">{service.summary}</p>
              <ul className="mt-4 space-y-1 text-sm text-mist/90">
                {service.outcomes.map((outcome) => (
                  <li key={outcome}>— {outcome}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/40 p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-white">Offer model</h2>
          <p className="mt-3 text-sm leading-relaxed text-silver">
            Engagements are structured around audits, implementation, platforms, copilots, and
            managed engineering. Public pricing is shown only when approved — Nordi will not invent
            numbers.
          </p>
          <ul className="mt-5 grid gap-2 sm:grid-cols-2">
            {offers.map((offer) => (
              <li key={offer} className="text-sm text-silver">
                — {offer}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
