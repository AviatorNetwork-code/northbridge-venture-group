"use client";

import IntentCard, { SectionHeader } from "@/components/marketing/IntentCard";
import IlluminatedButton from "@/components/marketing/IlluminatedButton";
import { openNordyHref } from "@/lib/nordy/routes";
import { trackAnalytics } from "@/lib/nordy";
import { northbridgeVentures } from "@/lib/nordi/ventures";

const processSteps = [
  "Understand the problem",
  "Design the system",
  "Reuse what already works",
  "Build",
  "Test",
  "Deliver / operate",
];

const capabilityProof = [
  "Web applications",
  "iOS & Android",
  "Payments & authentication",
  "AI assistants & copilots",
  "Operational dashboards",
  "Marketplaces",
];

export default function HomeMarketingPage() {
  const activeVentures = northbridgeVentures.filter(
    (venture) => venture.status === "active" && venture.id !== "future-ventures",
  );

  return (
    <main className="relative overflow-x-hidden bg-[var(--nb-charcoal)] text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[70vh] hero-atmosphere" aria-hidden />

      {/* 1. HERO */}
      <section className="relative mx-auto flex min-h-[78vh] max-w-6xl flex-col justify-center px-4 pb-16 pt-28 sm:px-6 sm:pt-32 md:min-h-[84vh] md:pb-20">
        <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-red sm:text-xs">
          Northbridge Venture Group
        </p>
        <h1 className="max-w-4xl text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[4rem]">
          Northbridge builds companies, software, and intelligent systems.
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-silver sm:text-lg">
          We operate ventures, engineer complex operational platforms, and deliver Digital products
          with clear scope — nationally, with deep roots in Central Florida.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <IlluminatedButton
            href={openNordyHref("HOME")}
            illumination={3}
            onClick={() => trackAnalytics("project_cta_clicked", { location: "hero" })}
          >
            Talk to Nordi
          </IlluminatedButton>
          <IlluminatedButton href="/ventures" variant="secondary" illumination={1}>
            View ventures
          </IlluminatedButton>
        </div>
        <div className="hero-tech-plane mt-12 hidden h-28 w-full max-w-3xl md:block" aria-hidden>
          <span className="absolute bottom-3 left-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">
            Systems · Software · Ventures
          </span>
        </div>
      </section>

      {/* 2. THREE INTENT CARDS */}
      <section className="relative mx-auto max-w-6xl px-4 pb-20 sm:px-6 md:pb-28">
        <SectionHeader
          eyebrow="Start here"
          title="Choose your path"
          description="Classify your intent in seconds. Nordi already knows which door you used."
        />
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
          <IntentCard
            tone="explore"
            title="Explore Northbridge"
            description="Who we are, what we build, ventures, capabilities, and selected work."
            points={["Company & ventures", "Capabilities", "Selected products", "Why Northbridge"]}
            ctaLabel="Explore Northbridge"
            href="/about"
            onSelect={() => {
              trackAnalytics("intent_card_selected", { card: "explore" });
              trackAnalytics("explore_northbridge_selected");
            }}
          />
          <IntentCard
            tone="engineering"
            title="Engineering & AI"
            description="Operational problems, automation, custom systems, AI copilots, and modernization."
            points={[
              "Business automation",
              "Custom SaaS & systems",
              "AI assistants",
              "Integrations",
            ]}
            ctaLabel="Start with Nordi"
            href={openNordyHref("ENGINEERING_AI")}
            illumination={3}
            onSelect={() => {
              trackAnalytics("intent_card_selected", { card: "engineering_ai" });
              trackAnalytics("engineering_ai_selected");
            }}
          />
          <IntentCard
            tone="digital"
            title="Northbridge Digital"
            description="Websites, ecommerce, portals, booking, payments, and mobile apps with predictable scope."
            points={["Web & ecommerce", "Client portals", "Booking & payments", "Mobile app launch"]}
            ctaLabel="Tell Nordi what you need"
            href={openNordyHref("DIGITAL")}
            onSelect={() => {
              trackAnalytics("intent_card_selected", { card: "digital" });
              trackAnalytics("digital_selected");
            }}
          />
        </div>
      </section>

      {/* 3. CAPABILITY PROOF */}
      <section className="border-y border-white/5 bg-black/40 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeader
            eyebrow="Capability proof"
            title="Built on real product systems"
            description="Evidence from products we build and operate — not invented client logos."
          />
          <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {capabilityProof.map((item) => (
              <li
                key={item}
                className="rounded-xl border border-white/10 bg-white/[0.02] px-3 py-4 text-center text-sm text-silver"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 4. WHAT NORTHBRIDGE BUILDS */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <SectionHeader
          eyebrow="What we build"
          title="Ventures, engineering systems, and Digital products"
          description="One group. Clear divisions. Shared engineering depth underneath."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Northbridge Ventures",
              body: "Platform businesses we build and operate, including aviation products.",
              href: "/ventures",
            },
            {
              title: "Engineering & AI",
              body: "Outcome-led systems work: audits, automation, custom software, AI copilots.",
              href: "/engineering-ai",
            },
            {
              title: "Northbridge Digital",
              body: "Speed, quality, and predictable scope for websites, portals, and mobile apps.",
              href: "/digital",
            },
          ].map((item) => (
            <a
              key={item.title}
              href={item.href}
              className="rounded-2xl border border-white/10 bg-[#0b1017] p-6 transition hover:border-white/20 illum-l1"
            >
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-silver">{item.body}</p>
            </a>
          ))}
        </div>
      </section>

      {/* 5. SELECTED VENTURES */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-20">
        <SectionHeader eyebrow="Ventures" title="Selected ventures" />
        <div className="mt-8 space-y-4">
          {activeVentures.map((venture) => (
            <article
              key={venture.id}
              className="rounded-2xl border border-white/10 bg-black/30 p-5 sm:p-6"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <h3 className="text-xl font-semibold text-white">{venture.name}</h3>
                <span className="text-xs font-semibold uppercase tracking-wider text-red">
                  Active
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-silver">{venture.description}</p>
            </article>
          ))}
        </div>
        <div className="mt-6">
          <IlluminatedButton href="/ventures" variant="secondary">
            All ventures
          </IlluminatedButton>
        </div>
      </section>

      {/* 6–7 ENGINEERING + DIGITAL */}
      <section className="grid gap-4 border-y border-white/5 bg-black/30 px-4 py-16 sm:px-6 md:grid-cols-2 md:gap-5 md:py-20">
        <div className="mx-auto w-full max-w-xl rounded-2xl border border-white/10 bg-[#0b1017] p-6 sm:p-8 illum-l2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-red">
            Engineering & AI
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-white">Premium systems work</h2>
          <p className="mt-3 text-sm leading-relaxed text-silver">
            For operators with real workflow, integration, and AI problems — not body-shop coding.
          </p>
          <div className="mt-6">
            <IlluminatedButton href={openNordyHref("ENGINEERING_AI")}>
              Start with Nordi
            </IlluminatedButton>
          </div>
        </div>
        <div className="mx-auto w-full max-w-xl rounded-2xl border border-white/10 bg-[#0b1017] p-6 sm:p-8 illum-l2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-300/80">
            Northbridge Digital
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-white">Fast, not cheap</h2>
          <p className="mt-3 text-sm leading-relaxed text-silver">
            Predictable scope for websites, ecommerce, portals, and mobile app launch.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <IlluminatedButton href={openNordyHref("DIGITAL")}>
              Tell Nordi what you need
            </IlluminatedButton>
            <IlluminatedButton
              href="/mobile-apps"
              variant="secondary"
              onClick={() => trackAnalytics("mobile_app_offer_viewed")}
            >
              Mobile App Launch
            </IlluminatedButton>
          </div>
        </div>
      </section>

      {/* 8. HOW NORTHBRIDGE WORKS */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <SectionHeader
          eyebrow="How we work"
          title="A clear public delivery path"
          description="A simplified public version of our project approach — outcomes first, reuse when it creates leverage."
        />
        <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {processSteps.map((step, index) => (
            <li
              key={step}
              className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-4 text-sm text-silver"
            >
              <span className="mr-2 font-semibold text-red">{index + 1}.</span>
              {step}
            </li>
          ))}
        </ol>
      </section>

      {/* 9–10 PRODUCT PROOF + WHY */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-20">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <SectionHeader
              eyebrow="Product proof"
              title="We build and operate our own products"
              description="Reusable engineering capability across web, mobile, AI, and infrastructure — with governance through NEO."
            />
          </div>
          <div>
            <SectionHeader
              eyebrow="Why Northbridge"
              title="Product experience, not pure consulting"
              description="Because we operate ventures and ship Digital products, Engineering & AI work starts from proven patterns — not blank-page consulting theater."
            />
          </div>
        </div>
      </section>

      {/* 11. FINAL CTA */}
      <section className="border-t border-white/10 bg-gradient-to-b from-[#0b1017] to-black px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Start a useful conversation in one click
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-silver sm:text-base">
            Nordi classifies intent, answers verified company questions, and routes Digital or
            Engineering & AI work without forcing a long form.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <IlluminatedButton href={openNordyHref("HOME")} illumination={3}>
              Talk to Nordi
            </IlluminatedButton>
            <IlluminatedButton href="/contact" variant="secondary">
              Contact
            </IlluminatedButton>
          </div>
        </div>
      </section>
    </main>
  );
}
