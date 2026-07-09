import type { Metadata } from "next";
import MarketingPrimaryCta from "@/components/MarketingPrimaryCta";

export const metadata: Metadata = {
  title: "Ventures | Northbridge Digital",
  description:
    "Northbridge Digital builds and operates serious digital platforms. Nordi is the product that brings that experience to business owners.",
};

export default function PortfolioPage() {
  return (
    <main className="pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-20 md:pb-24 px-4 sm:px-6 bg-black min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white mb-4">
          Built on Real Experience
        </h1>
        <p className="text-base sm:text-lg text-silver mb-8 sm:mb-10 max-w-2xl leading-relaxed">
          Northbridge Digital did not start as a software company. It started by
          building and operating real businesses — and Nordi carries that
          operational DNA.
        </p>

        <MarketingPrimaryCta />

        <section className="mb-10 sm:mb-12">
          <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-red mb-4">
            Why This Matters
          </h2>
          <div className="space-y-4 text-silver text-sm sm:text-base leading-relaxed max-w-2xl">
            <p>
              Nordi is built by a team that runs platforms with real users,
              real transactions, and real operational workflows — not brochure
              websites or generic automation templates.
            </p>
            <p>
              That experience shapes how Nordi advises you. It understands
              operations, not just features. It recommends support based on how
              businesses actually run.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-red mb-4">
            Northbridge Ventures
          </h2>
          <p className="text-silver text-sm sm:text-base leading-relaxed max-w-2xl mb-6">
            Northbridge Venture Group continues to build and operate ventures in
            aviation and financial services. These are separate businesses — not
            products you browse or buy on this site.
          </p>
          <p className="text-silver text-sm sm:text-base leading-relaxed max-w-2xl">
            If you are here, you are here for Nordi. Start a conversation on the
            homepage and let Nordi understand your business first.
          </p>
        </section>
      </div>
    </main>
  );
}
