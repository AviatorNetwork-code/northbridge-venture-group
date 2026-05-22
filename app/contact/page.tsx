import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { CONTACT_CHANNELS, PRIMARY_CONTACT_EMAIL } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Contact | Northbridge Venture Group",
  description:
    "Start a project with Northbridge Venture Group. Submit a structured project inquiry—lead capture and customer acquisition infrastructure, not a generic contact form.",
};

const inquiryProcessPoints = [
  "Project qualification review",
  "Inquiry routing to the right system or service path",
  "Scope and fit assessment",
  "Response within one to two business days",
];

export default function Contact() {
  return (
    <div className="nb-page">
      <header className="max-w-3xl">
        <p className="nb-eyebrow">Contact · Lead capture</p>
        <h1 className="mt-3 nb-h1 text-balance">Start a Project With Northbridge</h1>
        <p className="mt-6 nb-lead">
          Tell us what you are building, where the business is now, and what kind of digital system you
          need next.
        </p>
        <p className="mt-4 nb-body max-w-2xl">
          Northbridge builds{" "}
          <span className="font-semibold text-white">customer acquisition infrastructure</span>
          —lead capture, qualification, and inquiry routing—not static websites with forms that go
          nowhere. This page is a working example of that approach.
        </p>
      </header>

      <div className="mt-12 lg:mt-16 grid gap-10 lg:grid-cols-[minmax(0,300px)_1fr] lg:gap-16 items-start">
        <aside className="space-y-6">
          <div className="nb-card">
            <h2 className="text-lg font-bold text-white">Inquiry Process</h2>
            <ul className="mt-4 space-y-3 text-sm text-white/70 leading-relaxed">
              {inquiryProcessPoints.map((point) => (
                <li key={point} className="flex gap-3">
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-northbridge-red"
                    aria-hidden
                  />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="nb-card">
            <h2 className="text-lg font-bold text-white">Direct contact</h2>
            <p className="mt-3 text-sm text-white/70 leading-relaxed">
              Prefer email? Reach us at the address below and we will respond as soon as we can.
            </p>
            <p className="mt-6 text-sm font-semibold text-white">Email</p>
            <p className="mt-1 text-sm text-white/80 break-all">
              <a
                href={`mailto:${PRIMARY_CONTACT_EMAIL}`}
                className="hover:text-northbridge-red transition-colors"
              >
                {PRIMARY_CONTACT_EMAIL}
              </a>
            </p>
          </div>

          <div className="nb-card">
            <h2 className="text-lg font-bold text-white">Contact channels</h2>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              {CONTACT_CHANNELS.map(({ label, email }) => (
                <li key={email} className="flex flex-col gap-0.5 sm:flex-row sm:gap-2 sm:items-baseline">
                  <span className="font-semibold text-white shrink-0">{label}:</span>
                  <a
                    href={`mailto:${email}`}
                    className="text-white/80 break-all hover:text-northbridge-red transition-colors"
                  >
                    {email}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="space-y-4">
          <div className="rounded-xl border border-northbridge-red/30 bg-northbridge-red/10 px-5 py-4 sm:px-6">
            <p className="text-sm text-white/70 leading-relaxed">
              <span className="font-semibold text-white">Live example.</span> This form is
              powered by the same lead capture architecture we build for client acquisition systems.
            </p>
          </div>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
