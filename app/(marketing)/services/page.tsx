import type { Metadata } from "next";
import Link from "next/link";
import MarketingPrimaryCta from "@/components/MarketingPrimaryCta";

export const metadata: Metadata = {
  title: "Digital Solutions | Northbridge Digital",
  description:
    "Nordi is our flagship platform for business operating intelligence. Northbridge Digital also builds custom digital solutions for organizations with unique operational needs.",
};

const nordiCapabilities = [
  "Business operating intelligence",
  "Business understanding",
  "Connected operations",
  "Digital workforce",
  "Operational visibility",
  "Evidence-based insights",
  "Continuous business memory",
];

const customSolutions = [
  "Custom websites",
  "Business portals",
  "Mobile applications",
  "Workflow automation",
  "System integrations",
  "Internal business platforms",
  "Enterprise software",
  "AI implementation",
];

export default function ServicesPage() {
  return (
    <main className="pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-24 px-4 sm:px-6 bg-black min-h-screen">
      <div className="max-w-5xl mx-auto">
        <section className="mb-12 sm:mb-14">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white mb-4">
            Digital Solutions
          </h1>
          <p className="text-silver text-sm sm:text-base leading-relaxed max-w-3xl">
            Northbridge Digital builds technology that helps businesses operate
            with greater clarity, confidence, and efficiency. Nordi is our
            flagship platform. For organizations with unique needs, our
            engineering team also delivers custom digital solutions.
          </p>
          <MarketingPrimaryCta />
        </section>

        <section id="products" className="mb-12 sm:mb-14 scroll-mt-28">
          <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-red mb-2">
            Flagship Platform
          </h2>
          <div className="border border-white/10 p-5 sm:p-6 bg-slate/60">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold text-white">
                  Nordi
                </h3>
                <p className="text-xs font-medium uppercase tracking-wider text-red mt-1">
                  Our flagship platform
                </p>
              </div>
            </div>
            <p className="text-sm text-silver leading-relaxed mb-5 max-w-3xl">
              Nordi is business operating intelligence — software that learns how
              your business runs, connects your existing systems, and helps you
              understand what is happening across your organization.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {nordiCapabilities.map((capability) => (
                <li
                  key={capability}
                  className="flex gap-2 text-sm text-silver"
                >
                  <span className="text-red shrink-0">—</span>
                  <span>{capability}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <Link
                href="/"
                className="inline-flex min-h-11 items-center text-sm font-semibold text-red hover:text-red-hover transition-colors"
              >
                Talk to Nordi →
              </Link>
            </div>
          </div>
        </section>

        <section className="mb-12 sm:mb-14">
          <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-red mb-4">
            Custom Digital Solutions
          </h2>
          <p className="text-silver text-sm sm:text-base leading-relaxed max-w-3xl mb-5">
            For organizations that require capabilities beyond the standard Nordi
            platform, Northbridge Digital also designs and builds custom digital
            solutions. These are delivered by our engineering team when a
            tailored approach is genuinely needed — not as standalone products
            or off-the-shelf services.
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
            {customSolutions.map((solution) => (
              <li key={solution} className="flex gap-2 text-sm text-silver">
                <span className="text-red shrink-0">—</span>
                <span>{solution}</span>
              </li>
            ))}
          </ul>
          <p className="text-silver text-sm sm:text-base leading-relaxed max-w-3xl">
            Custom projects are reviewed by the Northbridge Digital engineering
            team. If your organization has unique operational requirements,
            reach out through our contact page.
          </p>
          <div className="mt-6">
            <Link
              href="/contact#custom-project"
              className="inline-flex min-h-11 items-center text-sm font-semibold text-red hover:text-red-hover transition-colors"
            >
              Request a Custom Project →
            </Link>
          </div>
        </section>

        <section className="border-t border-white/10 pt-8 sm:pt-10">
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-2">
            Start with Nordi
          </h2>
          <p className="text-silver text-sm sm:text-base leading-relaxed mb-4 max-w-3xl">
            Most businesses begin by talking to Nordi on the homepage. No forms,
            no browsing — just describe your business and go from there.
          </p>
          <MarketingPrimaryCta />
        </section>
      </div>
    </main>
  );
}
