import MarketingPrimaryCta from "@/components/MarketingPrimaryCta";
import { SectionHeader } from "@/components/marketing/IntentCard";
import { northbridgeVentures } from "@/lib/nordi/ventures";
import { openNordyHref } from "@/lib/nordy/routes";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Ventures",
  description:
    "Northbridge Ventures — Aviator Network, AirTax Financial, and other verified portfolio companies from Northbridge Venture Group.",
  path: "/ventures",
  openGraphTitle: "Ventures | Northbridge Venture Group",
  openGraphDescription:
    "Aviator Network, AirTax Financial, and verified Northbridge portfolio companies.",
});

const sectors = [
  {
    id: "aviation",
    title: "Aviation",
    ventures: ["aviator-network", "airtax-financial"],
  },
] as const;

export default function VenturesPage() {
  const active = northbridgeVentures.filter((v) => v.status === "active");

  return (
    <main className="min-h-screen bg-black px-4 pb-16 pt-24 sm:px-6 sm:pb-24 sm:pt-28 md:pt-32">
      <div className="mx-auto max-w-4xl">
        <SectionHeader
          eyebrow="Northbridge Ventures"
          title="Portfolio with public evidence"
          description="Only sectors and products with credible portfolio evidence are listed. Empty planned categories stay private."
        />

        <div className="mt-8">
          <MarketingPrimaryCta
            href={openNordyHref("VENTURES")}
            primaryLabel="Ask Nordi about ventures"
            secondaryHref="/engineering-ai"
            secondaryLabel="Engineering & AI"
          />
        </div>

        {sectors.map((sector) => (
          <section key={sector.id} className="mb-10 sm:mb-12">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-red sm:text-sm">
              {sector.title}
            </h2>
            <div className="space-y-4">
              {active
                .filter((venture) =>
                  (sector.ventures as readonly string[]).includes(venture.id),
                )
                .map((venture) => (
                  <article
                    key={venture.id}
                    className="rounded-2xl border border-white/10 bg-[#0b1017] p-5 sm:p-6"
                  >
                    <h3 className="text-xl font-semibold text-white">{venture.name}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-silver">
                      {venture.description}
                    </p>
                    <p className="mt-3 text-xs uppercase tracking-wide text-stone">
                      {venture.focus}
                    </p>
                  </article>
                ))}
            </div>
          </section>
        ))}

        <section>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-red sm:text-sm">
            Technology & Digital
          </h2>
          {active
            .filter((venture) => venture.id === "northbridge-digital")
            .map((venture) => (
              <article
                key={venture.id}
                className="rounded-2xl border border-white/10 bg-[#0b1017] p-5 sm:p-6"
              >
                <h3 className="text-xl font-semibold text-white">{venture.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-silver">{venture.description}</p>
              </article>
            ))}
        </section>
      </div>
    </main>
  );
}
