import type { Metadata } from "next";
import Link from "next/link";
import MarketingPrimaryCta from "@/components/MarketingPrimaryCta";
import { northbridgeVentures } from "@/lib/nordi/ventures";

export const metadata: Metadata = {
  title: "Ventures | Northbridge Venture Group",
  description:
    "Northbridge Venture Group builds and operates platform ventures including Northbridge Digital, Aviator Network, and AirTax Financial.",
};

export default function PortfolioPage() {
  return (
    <main className="min-h-screen bg-black px-4 pb-16 pt-24 sm:px-6 sm:pt-28 md:pt-32 md:pb-24">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
          Northbridge Ventures
        </h1>
        <p className="mb-8 max-w-2xl text-sm leading-relaxed text-silver sm:mb-10 sm:text-base">
          Northbridge Venture Group builds and operates platform businesses — not generic
          website products. Nordi on this site is the public entry point for Northbridge Digital.
          The ventures below are separate operating companies within the group.
        </p>

        <MarketingPrimaryCta />

        <section className="mb-10 sm:mb-12">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-red sm:text-sm">
            Active Ventures
          </h2>
          <div className="space-y-4">
            {northbridgeVentures
              .filter((venture) => venture.status === "active")
              .map((venture) => (
                <article
                  key={venture.id}
                  className="rounded-xl border border-white/10 bg-slate/50 p-5 sm:p-6"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <h3 className="text-xl font-semibold text-white">{venture.name}</h3>
                    <span className="text-xs font-semibold uppercase tracking-wider text-red">
                      Active venture
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-silver">{venture.description}</p>
                  <p className="mt-3 text-xs uppercase tracking-wide text-stone">{venture.focus}</p>
                  {venture.id === "northbridge-digital" ? (
                    <div className="mt-4">
                      <Link
                        href="/services#products"
                        className="text-sm font-semibold text-red transition-colors hover:text-red-hover"
                      >
                        Learn about Nordi →
                      </Link>
                    </div>
                  ) : null}
                </article>
              ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-red sm:text-sm">
            Incubation
          </h2>
          {northbridgeVentures
            .filter((venture) => venture.status === "incubation")
            .map((venture) => (
              <article
                key={venture.id}
                className="rounded-xl border border-white/10 bg-black/30 p-5 sm:p-6"
              >
                <h3 className="text-lg font-semibold text-white">{venture.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-silver">{venture.description}</p>
              </article>
            ))}
        </section>
      </div>
    </main>
  );
}
