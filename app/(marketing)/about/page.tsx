import type { Metadata } from "next";
import MarketingPrimaryCta from "@/components/MarketingPrimaryCta";

export const metadata: Metadata = {
  title: "About | Northbridge Digital",
  description:
    "Northbridge Digital is a software company. Nordi is our flagship platform. We also build custom digital solutions for organizations with unique operational needs.",
};

export default function AboutPage() {
  return (
    <main className="pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-20 md:pb-24 px-4 sm:px-6 bg-black min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white mb-6 sm:mb-8">
          About Northbridge Digital
        </h1>

        <MarketingPrimaryCta
          secondaryHref="/services"
          secondaryLabel="Digital Solutions"
        />

        <section className="mb-10 sm:mb-12">
          <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-red mb-4">
            Who We Are
          </h2>
          <div className="space-y-4 text-silver text-sm sm:text-base leading-relaxed">
            <p>
              Northbridge Digital is a software company focused on helping
              businesses operate more intelligently.
            </p>
            <p>
              Our flagship platform, Nordi, learns how a business operates,
              connects existing systems, and helps owners understand what is
              happening across their organization.
            </p>
            <p>
              For businesses with unique operational requirements, our
              engineering team also develops custom digital solutions.
            </p>
          </div>
        </section>

        <section className="mb-10 sm:mb-12">
          <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-red mb-4">
            Our Approach
          </h2>
          <div className="space-y-4 text-silver text-sm sm:text-base leading-relaxed">
            <p>
              We build technology that helps businesses operate with greater
              clarity, confidence, and efficiency — not generic automation, and
              not a consulting engagement.
            </p>
            <p>
              Nordi starts with conversation. You describe your business, Nordi
              builds an evidence-based understanding, and recommends operational
              support that fits how you actually work.
            </p>
            <p>
              Human leadership stays in control. Software learns your business;
              you make the decisions that matter.
            </p>
          </div>
        </section>

        <section className="mb-10 sm:mb-12">
          <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-red mb-4">
            Our Story
          </h2>
          <div className="space-y-4 text-silver text-sm sm:text-base leading-relaxed">
            <p>
              Northbridge Venture Group was founded to build and operate serious
              digital platforms — starting with Aviator Network, a marketplace
              connecting pilots and flight instructors.
            </p>
            <p>
              While building real businesses, we saw the same pattern everywhere:
              owners understand their operation deeply, but lack software that
              reflects that understanding.
            </p>
            <p>
              Nordi was built to close that gap — software that learns your
              business, not a catalog you browse before anyone understands your
              needs.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-red mb-4">
            Founder
          </h2>
          <h3 className="text-lg sm:text-xl font-semibold text-white">
            Andres Suarez
          </h3>
          <p className="text-silver text-sm sm:text-base mt-1 mb-3">
            Founder, Northbridge Venture Group
          </p>
          <p className="text-silver text-sm sm:text-base leading-relaxed">
            Entrepreneur and aviation professional focused on building software
            that helps operators run better businesses — with human judgment
            always in the lead.
          </p>
        </section>
      </div>
    </main>
  );
}
