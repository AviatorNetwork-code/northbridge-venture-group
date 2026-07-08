import type { Metadata } from "next";
import Link from "next/link";
import CatButton from "@/components/CatButton";
import CatAdvisor from "@/components/CatAdvisor";
import {
  industries,
  pricingRegions,
  teamTasks,
  workforceTiers,
} from "@/lib/workforce";

export const metadata: Metadata = {
  title: "Hire Your Digital Workforce | Northbridge Digital",
  description:
    "Northbridge Digital lets businesses hire a digital workforce — Specialists, Teams, and Managers. Talk to CAT, your Workforce Advisor, and start with one Specialist.",
};

export default function WorkforcePage() {
  return (
    <main className="bg-black">
      {/* 1. Hero */}
      <section className="relative min-h-[86vh] flex flex-col justify-center items-center text-center px-4 sm:px-6 pt-28 sm:pt-32 md:pt-36 pb-16 sm:pb-20 overflow-hidden">
        <div
          className="absolute inset-0 bg-grid-pattern bg-grid opacity-[0.6]"
          aria-hidden
        />
        <div className="relative max-w-3xl mx-auto w-full flex flex-col items-center">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-red mb-4">
            Northbridge Digital
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-white leading-[1.1]">
            Hire your digital workforce.
          </h1>
          <p className="mt-5 text-base sm:text-lg md:text-xl text-silver max-w-2xl leading-relaxed">
            Start with one Specialist. Grow into a Team. Add Managers when your
            business is ready.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-center">
            <CatButton className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-medium bg-red text-white hover:bg-red-hover transition-colors">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-black/25 text-[10px] font-semibold">
                CAT
              </span>
              Talk to CAT
            </CatButton>
            <a
              href="#workforce-model"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-sm font-medium border border-white/25 text-white hover:border-white/50 hover:bg-white/5 transition-colors"
            >
              Explore Workforce
            </a>
          </div>
          <div className="mt-3">
            <Link
              href="/workforce/hire"
              className="text-sm font-medium text-white underline underline-offset-4 decoration-red hover:text-red transition-colors"
            >
              Or start setup now →
            </Link>
          </div>
          <p className="mt-5 text-xs text-silver/70">
            CAT is your Workforce Advisor — it recommends the smallest useful
            solution and never oversells.
          </p>
        </div>
      </section>

      {/* 2. Workforce Model */}
      <section
        id="workforce-model"
        className="scroll-mt-20 px-4 sm:px-6 py-14 sm:py-20 md:py-24 bg-slate border-t border-white/5"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-red mb-2">
            The Workforce Model
          </h2>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white mb-8 sm:mb-12 max-w-3xl">
            Specialists become Teams. Teams get Managers. Managers scale into
            regions.
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {workforceTiers.map((tier) => (
              <div
                key={tier.name}
                className="flex flex-col p-5 sm:p-6 border border-white/10 bg-black hover:border-white/20 transition-colors min-h-[220px]"
              >
                <span className="text-2xl font-semibold text-red/80 tabular-nums">
                  {tier.level}
                </span>
                <h4 className="mt-3 text-lg sm:text-xl font-semibold text-white">
                  {tier.name}
                </h4>
                <p className="mt-1 text-sm font-medium text-white/90">
                  {tier.tagline}
                </p>
                <p className="mt-3 text-sm text-silver leading-relaxed flex-grow">
                  {tier.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CAT Workforce Advisor */}
      <section className="px-4 sm:px-6 py-14 sm:py-20 md:py-24 bg-black border-t border-white/5">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-start">
          <div>
            <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-red mb-2">
              Meet CAT
            </h2>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white mb-4">
              Your Workforce Advisor — not a salesperson.
            </h3>
            <p className="text-silver text-sm sm:text-base leading-relaxed mb-5">
              CAT is your Northbridge Workforce Advisor. CAT helps you choose the
              right Specialist, avoid hiring more than you need, and upgrade only
              when your workload justifies it.
            </p>
            <ul className="space-y-2.5 mb-7">
              {[
                "Choose the right Specialist",
                "Avoid hiring more than you need",
                "Upgrade only when your workload justifies it",
                "Understand when to add a Team or Manager",
              ].map((item) => (
                <li key={item} className="flex gap-3 text-silver text-sm sm:text-base">
                  <span className="text-red shrink-0">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <CatButton className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-medium bg-red text-white hover:bg-red-hover transition-colors">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-black/25 text-[10px] font-semibold">
                CAT
              </span>
              Talk to CAT
            </CatButton>
          </div>
          <div className="border border-white/10 bg-slate p-5 sm:p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-red text-white text-xs font-semibold">
                CAT
              </span>
              <div>
                <p className="text-sm font-semibold text-white leading-tight">CAT</p>
                <p className="text-xs text-silver leading-tight">
                  Your Workforce Advisor
                </p>
              </div>
            </div>
            <div className="rounded-2xl rounded-bl-sm bg-black/50 border border-white/10 px-4 py-3 text-sm text-silver leading-relaxed">
              &ldquo;You selected a full Dental Clinic Team, but based on what you
              told me, I recommend starting with the Appointment Specialist and
              Billing Specialist first.&rdquo;
            </div>
            <p className="mt-4 text-xs text-silver/70">
              CAT recommends the smallest useful solution — and tells you when a
              request belongs to a different Specialist.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Industry Examples */}
      <section className="px-4 sm:px-6 py-14 sm:py-20 md:py-24 bg-slate border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-red mb-2">
            Industry Examples
          </h2>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white mb-8 sm:mb-12 max-w-3xl">
            Where to start in your industry.
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {industries.map((industry) => (
              <div
                key={industry.name}
                className="flex flex-col p-5 sm:p-6 border border-white/10 bg-black hover:border-white/20 transition-colors"
              >
                <h4 className="text-lg font-semibold text-white mb-4">
                  {industry.name}
                </h4>
                <dl className="space-y-3 text-sm flex-grow">
                  <div>
                    <dt className="text-[11px] uppercase tracking-wider text-red/90 mb-0.5">
                      Start with
                    </dt>
                    <dd className="text-white/90">{industry.starter}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] uppercase tracking-wider text-silver/70 mb-0.5">
                      Grow into
                    </dt>
                    <dd className="text-silver">{industry.team}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] uppercase tracking-wider text-silver/70 mb-0.5">
                      Add a Manager
                    </dt>
                    <dd className="text-silver">{industry.addManager}</dd>
                  </div>
                </dl>
                <CatButton
                  topic={industry.name}
                  className="mt-5 inline-flex w-fit items-center gap-1.5 text-xs font-medium text-red hover:text-red-hover transition-colors"
                  aria-label={`Ask CAT about ${industry.name}`}
                >
                  Ask CAT about this →
                </CatButton>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Pricing Preview */}
      <section className="px-4 sm:px-6 py-14 sm:py-20 md:py-24 bg-black border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-red mb-2">
            Pricing Preview
          </h2>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white mb-3 max-w-3xl">
            Simple, starting-at pricing.
          </h3>
          <p className="text-silver text-sm sm:text-base mb-8 sm:mb-12 max-w-2xl leading-relaxed">
            Early access pricing. Start with one Specialist and add layers only
            as your workload grows.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {pricingRegions.map((region) => (
              <div
                key={region.region}
                className="p-5 sm:p-7 border border-white/10 bg-slate"
              >
                <div className="flex items-baseline justify-between mb-5">
                  <h4 className="text-xl font-semibold text-white">
                    {region.region}
                  </h4>
                  <span className="text-[11px] uppercase tracking-wider text-red font-semibold">
                    {region.note}
                  </span>
                </div>
                <ul className="divide-y divide-white/10">
                  {region.rows.map((row) => (
                    <li
                      key={row.tier}
                      className="flex items-center justify-between py-3"
                    >
                      <span className="text-sm text-silver">{row.tier}</span>
                      <span className="text-sm font-semibold text-white tabular-nums">
                        {row.price}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              href="/workforce/hire"
              className="inline-flex items-center justify-center px-8 py-3.5 text-sm font-medium bg-red text-white hover:bg-red-hover transition-colors"
            >
              Start setup
            </Link>
            <CatButton className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-medium border border-white/25 text-white hover:border-white/50 transition-colors">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-red text-[10px] font-semibold">
                CAT
              </span>
              Ask CAT what fits my budget
            </CatButton>
          </div>
        </div>
      </section>

      {/* 6. Team Tasks */}
      <section className="px-4 sm:px-6 py-14 sm:py-20 md:py-24 bg-slate border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-red mb-2">
            Team Tasks
          </h2>
          <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-white mb-6 sm:mb-8 max-w-3xl leading-snug">
            Your workforce does Team Tasks — real work completed by your
            Specialists, Teams, and Managers.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {teamTasks.map((task) => (
              <div
                key={task}
                className="flex items-center gap-3 px-4 py-3.5 border border-white/10 bg-black/40 text-sm text-silver"
              >
                <span className="text-red shrink-0">—</span>
                {task}
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-silver/70 max-w-2xl leading-relaxed">
            No tokens, no credits to track. You hire a workforce; it gets work
            done.
          </p>
        </div>
      </section>

      {/* 7. Trust-First Expansion */}
      <section className="px-4 sm:px-6 py-14 sm:py-20 md:py-24 bg-black border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-red mb-2">
            Trust-First Expansion
          </h2>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white mb-4">
            CAT may recommend not hiring more yet.
          </h3>
          <p className="text-silver text-sm sm:text-base leading-relaxed mb-8">
            Northbridge recommends expansion only when your workload justifies
            it. Growing your workforce should follow real demand — not pressure.
          </p>
          <div className="border-l-2 border-red pl-5 sm:pl-6 py-1">
            <p className="text-white text-base sm:text-lg leading-relaxed">
              &ldquo;Your current Appointment Specialist is handling your workload
              well. I don&apos;t recommend adding a Manager yet.&rdquo;
            </p>
            <p className="mt-2 text-xs text-silver/70">— CAT, Workforce Advisor</p>
          </div>
        </div>
      </section>

      {/* 8. Mobile App Vision Teaser */}
      <section className="px-4 sm:px-6 py-14 sm:py-20 md:py-24 pb-28 sm:pb-20 bg-slate border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-red mb-3">
            Coming Soon
          </h2>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white mb-4">
            Your business workforce, in your pocket.
          </h3>
          <p className="text-silver text-sm sm:text-base leading-relaxed max-w-2xl mx-auto mb-8">
            Soon you&apos;ll talk directly to your Specialists, Team Leaders,
            Managers, and CAT from a mobile-first experience — your whole
            workforce, wherever you are.
          </p>
          <Link
            href="/contact"
            className="inline-flex w-full sm:w-auto items-center justify-center px-8 py-3.5 text-sm font-medium border border-white/25 text-white hover:border-white/50 hover:bg-white/5 transition-colors"
          >
            Get early access
          </Link>
        </div>
      </section>

      {/* CAT advisor: persistent launcher + mock consultation panel */}
      <CatAdvisor />
    </main>
  );
}
