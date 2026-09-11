import Link from "next/link";
import MarketingPrimaryCta from "@/components/MarketingPrimaryCta";
import { SectionHeader } from "@/components/marketing/IntentCard";
import { openNordyHref } from "@/lib/nordy/routes";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About",
  description:
    "Northbridge Venture Group operates ventures, builds technology, provides Engineering & AI services, and delivers Digital products nationally from Central Florida.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black px-4 pb-16 pt-24 sm:px-6 sm:pb-24 sm:pt-28 md:pt-32">
      <div className="mx-auto max-w-4xl">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-red">
          Who we are
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
          Northbridge Venture Group
        </h1>
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-silver sm:text-base">
          We build companies, software, and intelligent systems. Northbridge operates ventures,
          delivers Engineering & AI for complex operational problems, and ships Digital products
          with predictable scope.
        </p>

        <div className="mt-8">
          <MarketingPrimaryCta
            href={openNordyHref("EXPLORE")}
            primaryLabel="Explore with Nordi"
            secondaryHref="/ventures"
            secondaryLabel="View ventures"
          />
        </div>

        <section className="mb-10 sm:mb-12">
          <SectionHeader title="What Northbridge is" />
          <div className="mt-5 space-y-4 text-sm leading-relaxed text-silver sm:text-base">
            <p>
              Northbridge Venture Group is the parent organization behind our ventures and service
              divisions. We are not a generic consulting brochure — we build and operate real
              products while offering Engineering & AI and Digital delivery to outside teams.
            </p>
            <p>
              NEO is the shared engineering, intelligence, learning, and capability layer underneath
              Northbridge. It is not a commercial division customers buy as a product name.
            </p>
          </div>
        </section>

        <section className="mb-10 grid gap-4 sm:mb-12 md:grid-cols-2">
          {[
            {
              title: "Northbridge Ventures",
              body: "Platform businesses we build and operate, including aviation products with public evidence.",
              href: "/ventures",
            },
            {
              title: "Engineering & AI",
              body: "Outcome-led systems work: automation, custom software, AI copilots, integrations, modernization.",
              href: "/engineering-ai",
            },
            {
              title: "Northbridge Digital",
              body: "Websites, ecommerce, portals, booking, payments, and mobile apps with clear scope.",
              href: "/digital",
            },
            {
              title: "Operating Ventures",
              body: "Understated until ready for public presentation. We do not publish empty portfolio sections.",
              href: "/ventures",
            },
          ].map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="rounded-2xl border border-white/10 bg-[#0b1017] p-5 transition hover:border-white/20"
            >
              <h2 className="text-lg font-semibold text-white">{item.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-silver">{item.body}</p>
            </Link>
          ))}
        </section>

        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-red sm:text-sm">
            Founder
          </h2>
          <h3 className="mt-3 text-lg font-semibold text-white sm:text-xl">Andres Suarez</h3>
          <p className="mt-1 text-sm text-silver sm:text-base">
            Founder, Northbridge Venture Group
          </p>
          <p className="mt-3 text-sm leading-relaxed text-silver sm:text-base">
            Entrepreneur and aviation professional focused on building software that helps
            operators run better businesses — with human judgment always in the lead.
          </p>
        </section>
      </div>
    </main>
  );
}
