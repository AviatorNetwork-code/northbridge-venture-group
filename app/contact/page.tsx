import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact | Northbridge Venture Group",
  description:
    "Start a project with Northbridge Venture Group. Submit a structured project inquiry—lead capture and customer acquisition infrastructure, not a generic contact form.",
};

const acquisitionPoints = [
  "Structured qualification fields (project type, budget, scope)",
  "Server-side submission and inquiry routing",
  "Designed for conversion—not brochure-site dead ends",
];

export default function Contact() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24">
      <header className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-northbridge-red">
          Contact · Lead capture
        </p>
        <h1 className="mt-3 text-4xl sm:text-5xl font-bold text-northbridge-black tracking-tight text-balance">
          Start a Project With Northbridge
        </h1>
        <p className="mt-6 text-lg text-black/80 leading-relaxed">
          Tell us what you are building, where the business is now, and what kind of digital system you
          need next.
        </p>
        <p className="mt-4 text-black/80 leading-relaxed max-w-2xl">
          Northbridge builds <span className="font-semibold text-northbridge-black">customer acquisition infrastructure</span>
          —lead capture, qualification, and inquiry routing—not static websites with forms that go
          nowhere. This page is a working example of that approach.
        </p>
      </header>

      <div className="mt-12 lg:mt-16 grid gap-10 lg:grid-cols-[minmax(0,300px)_1fr] lg:gap-16 items-start">
        <aside className="space-y-6">
          <div className="rounded-xl border border-black/10 bg-white p-6 sm:p-8">
            <h2 className="text-lg font-bold text-northbridge-black">What this form demonstrates</h2>
            <ul className="mt-4 space-y-3 text-sm text-black/80 leading-relaxed">
              {acquisitionPoints.map((point) => (
                <li key={point} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-northbridge-red" aria-hidden />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-black/10 bg-white p-6 sm:p-8">
            <h2 className="text-lg font-bold text-northbridge-black">Direct contact</h2>
            <p className="mt-3 text-sm text-black/80 leading-relaxed">
              Prefer email? Reach us at the address below and we will respond as soon as we can.
            </p>
            <p className="mt-6 text-sm font-semibold text-northbridge-black">Email</p>
            <p className="mt-1 text-northbridge-red font-medium break-all">
              contact@northbridgeventuregroup.com
            </p>
          </div>
        </aside>

        <div className="space-y-4">
          <div className="rounded-xl border border-northbridge-red/20 bg-northbridge-red/[0.04] px-5 py-4 sm:px-6">
            <p className="text-sm text-black/80 leading-relaxed">
              <span className="font-semibold text-northbridge-black">Live example.</span> This form is
              powered by the same lead capture architecture we build for client acquisition systems.
            </p>
          </div>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
