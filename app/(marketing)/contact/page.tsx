import type { Metadata } from "next";
import ContactForm from "@/components/contact/ContactForm";
import MarketingPrimaryCta from "@/components/MarketingPrimaryCta";

export const metadata: Metadata = {
  title: "Contact | Northbridge Venture Group",
  description:
    "Contact Northbridge Venture Group for partnerships, strategic conversations, and website and digital infrastructure projects.",
};

export default function ContactPage() {
  return (
    <main className="pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-20 md:pb-24 px-4 sm:px-6 bg-black min-h-screen">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white mb-4">
          Contact
        </h1>
        <p className="text-base sm:text-lg text-silver mb-8 sm:mb-10 leading-relaxed">
          We welcome inquiries regarding partnerships, strategic business
          conversations, and website and digital infrastructure projects.
        </p>

        <MarketingPrimaryCta
          href="/partner"
          label="Explore Partnerships"
          secondaryHref="/services"
          secondaryLabel="View Services"
        />

        <ContactForm />

        <div className="mt-10 space-y-8 border-t border-white/10 pt-10">
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
          <div>
            <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-red mb-2">
              General Inquiries
            </h3>
            <p className="text-white">
              <a
                href="mailto:info@northbridgeventuregroup.com"
                className="inline-flex min-h-11 items-center hover:text-red transition-colors text-sm sm:text-base"
              >
                info@northbridgeventuregroup.com
              </a>
            </p>
            <p className="text-silver text-sm mt-2">
              Strategic conversations, website and digital projects, media.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
