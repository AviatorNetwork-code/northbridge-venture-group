import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { CONTACT_CHANNELS, PRIMARY_CONTACT_EMAIL } from "@/lib/contact";
import { siteMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = siteMetadata({
  title: "Contact",
  description:
    "Contact Northbridge Venture Group about ventures, advisory work, or operational improvement through Northbridge Digital.",
  path: "/contact",
});

const inquiryProcessPoints = [
  "Project qualification review",
  "Inquiry routing to the right team",
  "Scope and fit assessment",
  "Response within one to two business days",
];

export default function Contact() {
  return (
    <div className="nb-page">
      <Section variant="hero" containerClassName="max-w-3xl">
        <PageHeader
          eyebrow="Contact"
          title="Speak with Northbridge"
          description="Tell us what you are building, where the business is today, and what you need next. We review every inquiry and respond with a clear next step—not an automated sales sequence."
        />
      </Section>

      <Section variant="tight">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,280px)_1fr] lg:gap-12 xl:gap-16 items-start">
          <aside className="space-y-5 min-w-0">
            <div className="nb-card">
              <h2 className="nb-h3">What happens next</h2>
              <ul className="mt-4 space-y-3 text-sm text-white/70 leading-relaxed">
                {inquiryProcessPoints.map((point) => (
                  <li key={point} className="nb-list-bullet">
                    <span className="nb-list-bullet-dot" aria-hidden="true" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="nb-card">
              <h2 className="nb-h3">Direct email</h2>
              <p className="mt-3 text-sm text-white/70 leading-relaxed">
                Prefer email? Reach us at the address below.
              </p>
              <a
                href={`mailto:${PRIMARY_CONTACT_EMAIL}`}
                className="mt-4 inline-block text-sm font-medium text-white/80 break-all hover:text-northbridge-red transition-colors"
              >
                {PRIMARY_CONTACT_EMAIL}
              </a>
            </div>

            <div className="nb-card">
              <h2 className="nb-h3">Contact channels</h2>
              <ul className="mt-4 space-y-3 text-sm text-white/70">
                {CONTACT_CHANNELS.map(({ label, email }) => (
                  <li key={email} className="min-w-0">
                    <span className="font-semibold text-white">{label}</span>
                    <a
                      href={`mailto:${email}`}
                      className="mt-1 block break-all text-white/80 hover:text-northbridge-red transition-colors"
                    >
                      {email}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <div className="min-w-0 space-y-4">
            <div className="nb-callout">
              <p className="nb-body">
                <span className="font-semibold text-white">Structured inquiry.</span> This form
                routes your message to the right Northbridge team—ventures, advisory, or general
                questions.
              </p>
            </div>
            <ContactForm />
          </div>
        </div>
      </Section>
    </div>
  );
}
