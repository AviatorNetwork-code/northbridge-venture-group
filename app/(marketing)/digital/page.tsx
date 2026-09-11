import Link from "next/link";
import MarketingPrimaryCta from "@/components/MarketingPrimaryCta";
import { SectionHeader } from "@/components/marketing/IntentCard";
import { capabilityRegistry } from "@/lib/nordy/capability-registry";
import { openNordyHref } from "@/lib/nordy/routes";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Northbridge Digital",
  description:
    "Northbridge Digital builds websites, ecommerce, client portals, booking systems, lightweight SaaS, and mobile apps with speed, quality, and predictable scope.",
  path: "/digital",
  openGraphTitle: "Northbridge Digital | Northbridge Venture Group",
  openGraphDescription:
    "Websites, ecommerce, portals, booking systems, lightweight SaaS, and mobile apps.",
});

export default function DigitalPage() {
  const offerings = capabilityRegistry.filter((item) => item.division === "DIGITAL");

  return (
    <main className="min-h-screen bg-black px-4 pb-16 pt-24 sm:px-6 sm:pb-24 sm:pt-28 md:pt-32">
      <div className="mx-auto max-w-5xl">
        <SectionHeader
          eyebrow="Northbridge Digital"
          title="Speed, quality, predictable scope"
          description="Clearly defined digital products for growing businesses — not $300 body-shop engineering, and not enterprise ambiguity."
        />

        <div className="mt-8">
          <MarketingPrimaryCta
            href={openNordyHref("DIGITAL")}
            primaryLabel="Tell Nordi what you need"
            secondaryHref="/mobile-apps"
            secondaryLabel="Mobile App Launch"
          />
        </div>

        <section className="mb-12 grid gap-4 sm:grid-cols-2">
          {offerings.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-white/10 bg-[#0b1017] p-5 illum-l1"
            >
              <h2 className="text-lg font-semibold text-white">{item.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-silver">{item.summary}</p>
            </article>
          ))}
        </section>

        <section className="rounded-2xl border border-white/10 bg-[#0b1017] p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-white">Fast path vs Engineering & AI</h2>
          <p className="mt-3 text-sm leading-relaxed text-silver">
            Nordi classifies projects as Digital fast-path, Digital custom, or escalate to
            Engineering & AI. Not every app belongs on the fast path — complexity and integrations
            decide.
          </p>
          <div className="mt-6">
            <Link
              href="/engineering-ai"
              className="inline-flex min-h-11 items-center text-sm font-semibold text-red hover:text-red-hover"
            >
              See Engineering & AI →
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
