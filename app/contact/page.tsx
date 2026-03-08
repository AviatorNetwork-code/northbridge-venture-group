import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Northbridge Venture Group",
  description:
    "Contact Northbridge Venture Group for partnerships, strategic conversations, and website and digital infrastructure projects.",
};

export default function ContactPage() {
  return (
    <main className="pt-32 pb-24 px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-charcoal mb-4">
          Contact
        </h1>
        <p className="text-xl text-stone mb-16">
          We welcome inquiries regarding partnerships, strategic business
          conversations, and website and digital infrastructure projects.
          Please reach out to the appropriate address below.
        </p>
        <div className="space-y-8">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-silver mb-2">
              Partnerships
            </h3>
            <p className="text-charcoal">
              <a
                href="mailto:partnerships@northbridgeventuregroup.com"
                className="hover:text-stone transition-colors"
              >
                partnerships@northbridgeventuregroup.com
              </a>
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-silver mb-2">
              General Inquiries
            </h3>
            <p className="text-charcoal">
              <a
                href="mailto:info@northbridgeventuregroup.com"
                className="hover:text-stone transition-colors"
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
