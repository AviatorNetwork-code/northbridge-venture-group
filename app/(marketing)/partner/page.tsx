import type { Metadata } from "next";
import MarketingPrimaryCta from "@/components/MarketingPrimaryCta";

export const metadata: Metadata = {
  title: "Partner With Us | Northbridge Venture Group",
  description:
    "Northbridge Venture Group partners with selected founders on platform ventures. For business operations support, start with Nordi.",
};

export default function PartnerPage() {
  return (
    <main className="pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-24 px-4 sm:px-6 bg-black min-h-screen">
      <div className="max-w-4xl mx-auto">
        <section className="mb-10 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white mb-4">
            Partner With Us
          </h1>
          <p className="text-silver text-sm sm:text-base leading-relaxed max-w-2xl">
            Northbridge Venture Group occasionally partners with founders to
            build platform ventures. This is separate from Nordi — our primary
            product for business owners.
          </p>
          <MarketingPrimaryCta
            secondaryHref="/contact"
            secondaryLabel="Contact the Team"
          />
        </section>

        <section className="mb-10 sm:mb-12">
          <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-red mb-4">
            Looking for Business Support?
          </h2>
          <p className="text-silver text-sm sm:text-base leading-relaxed max-w-2xl">
            If you need help understanding and operating your business — customer
            service, appointments, communications, or a digital workforce — start
            by talking to Nordi on the homepage. That is what Nordi is built for.
          </p>
        </section>

        <section className="mb-10 sm:mb-12">
          <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-red mb-4">
            Venture Partnerships
          </h2>
          <div className="space-y-4 text-silver text-sm sm:text-base leading-relaxed max-w-2xl">
            <p>
              For selected platform opportunities, Northbridge may structure
              venture collaborations — contributing development and
              infrastructure in exchange for equity or revenue participation.
            </p>
            <p>
              Partnerships are evaluated individually. If you have a platform
              idea with clear industry knowledge and long-term potential, reach
              out through our contact page.
            </p>
          </div>
        </section>

        <section className="border-t border-white/10 pt-8 sm:pt-10">
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-2">
            Get in Touch
          </h2>
          <p className="text-silver text-sm sm:text-base leading-relaxed mb-4 max-w-2xl">
            For venture partnership inquiries, contact our partnerships team.
            For everything else, talk to Nordi first.
          </p>
          <MarketingPrimaryCta
            href="/contact"
            primaryLabel="Contact Partnerships"
          />
        </section>
      </div>
    </main>
  );
}
