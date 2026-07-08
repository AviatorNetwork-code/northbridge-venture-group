import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact | Northbridge Digital",
  description:
    "Talk to Nordi or request a custom digital solution from the Northbridge Digital engineering team.",
};

export default function ContactPage() {
  return (
    <main className="pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-20 md:pb-24 px-4 sm:px-6 bg-black min-h-screen">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white mb-4">
          Contact
        </h1>
        <p className="text-base sm:text-lg text-silver mb-8 sm:mb-10 leading-relaxed">
          Choose the path that fits your needs. Most businesses start with
          Nordi. Organizations with unique operational requirements can request
          a custom digital solution.
        </p>

        <div className="mb-10 space-y-4">
          <div className="rounded-xl border border-white/10 bg-slate/40 p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-white mb-2">
              Talk to Nordi
            </h2>
            <p className="text-sm text-silver leading-relaxed mb-4">
              Recommended for most businesses. Describe your operation in your
              own words and let Nordi build an understanding of how you work.
            </p>
            <Link
              href="/"
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-red px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-red-hover"
            >
              Talk to Nordi
            </Link>
          </div>

          <div
            id="custom-project"
            className="rounded-xl border border-white/10 bg-slate/40 p-5 sm:p-6"
          >
            <h2 className="text-lg font-semibold text-white mb-2">
              Request a Custom Project
            </h2>
            <p className="text-sm text-silver leading-relaxed mb-4">
              For organizations seeking a tailored digital solution beyond the
              standard Nordi platform. Custom projects are reviewed by the
              Northbridge Digital engineering team.
            </p>
            <ContactForm defaultTopic="custom" />
          </div>
        </div>

        <div className="space-y-8 border-t border-white/10 pt-10">
          <div>
            <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-red mb-2">
              General Inquiries
            </h3>
            <p className="text-white">
              <a
                href="mailto:contact@northbridgeventuregroup.com"
                className="inline-flex min-h-11 items-center hover:text-red transition-colors text-sm sm:text-base"
              >
                contact@northbridgeventuregroup.com
              </a>
            </p>
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-red mb-2">
              Partnerships
            </h3>
            <p className="text-white">
              <a
                href="mailto:partnerships@northbridgeventuregroup.com"
                className="inline-flex min-h-11 items-center hover:text-red transition-colors text-sm sm:text-base"
              >
                partnerships@northbridgeventuregroup.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
