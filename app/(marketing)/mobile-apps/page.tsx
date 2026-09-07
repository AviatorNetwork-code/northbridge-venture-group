import type { Metadata } from "next";
import MarketingPrimaryCta from "@/components/MarketingPrimaryCta";
import { SectionHeader } from "@/components/marketing/IntentCard";
import { openNordyHref } from "@/lib/nordy/routes";

export const metadata: Metadata = {
  title: "Mobile App Launch",
  description:
    "Production-ready mobile apps built in days, not months. iOS and Android with branding, auth, core screens, backend, analytics, and store submission preparation.",
};

const scope = [
  "iOS + Android",
  "Branding",
  "Auth & account/profile",
  "5–8 primary screens",
  "Backend / API",
  "Analytics",
  "Payments where applicable",
  "Push notifications where applicable",
  "Store build & submission preparation",
];

export default function MobileAppsPage() {
  return (
    <main className="min-h-screen bg-black px-4 pb-16 pt-24 sm:px-6 sm:pb-24 sm:pt-28 md:pt-32">
      <div className="mx-auto max-w-4xl">
        <SectionHeader
          eyebrow="Mobile App Launch"
          title="Production-ready mobile apps built in days, not months"
          description="Northbridge controls engineering, build, packaging, and submission preparation. Apple and Google review timing is external — we do not guarantee App Store approval timing."
        />

        <div className="mt-8">
          <MarketingPrimaryCta
            href={openNordyHref("DIGITAL")}
            primaryLabel="Tell Nordi about your app"
            secondaryHref="/digital"
            secondaryLabel="All Digital offerings"
          />
        </div>

        <section className="mb-10 rounded-2xl border border-white/10 bg-[#0b1017] p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-white">Fast-path scope</h2>
          <ul className="mt-5 grid gap-2 sm:grid-cols-2">
            {scope.map((item) => (
              <li key={item} className="text-sm text-silver">
                — {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/40 p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-white">Complexity classifier</h2>
          <p className="mt-3 text-sm leading-relaxed text-silver">
            Nordi evaluates whether a request is <strong className="text-white">FAST_PATH_DIGITAL</strong>{" "}
            or should <strong className="text-white">ESCALATE_ENGINEERING_AI</strong>. Not every app can
            use the fast path — integrations, regulatory constraints, and workflow complexity matter.
          </p>
        </section>
      </div>
    </main>
  );
}
