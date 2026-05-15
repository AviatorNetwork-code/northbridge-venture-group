import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact | Northbridge Venture Group",
  description:
    "Start a project with Northbridge Venture Group. Submit a project inquiry for digital infrastructure, SEO, automation, and consulting.",
};

export default function Contact() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24">
      <header className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-northbridge-red">Contact</p>
        <h1 className="mt-3 text-4xl sm:text-5xl font-bold text-northbridge-black tracking-tight">
          Start a Project With Northbridge
        </h1>
        <p className="mt-6 text-lg text-black/80 leading-relaxed">
          Tell us what you are building, where the business is now, and what kind of digital system you
          need next.
        </p>
      </header>

      <div className="mt-12 lg:mt-16 grid gap-10 lg:grid-cols-[minmax(0,280px)_1fr] lg:gap-16 items-start">
        <aside className="rounded-xl border border-black/10 bg-white p-6 sm:p-8">
          <h2 className="text-lg font-bold text-northbridge-black">Direct contact</h2>
          <p className="mt-3 text-sm text-black/80 leading-relaxed">
            Prefer email? Reach us at the address below and we will respond as soon as we can.
          </p>
          <p className="mt-6 text-sm font-semibold text-northbridge-black">Email</p>
          <p className="mt-1 text-northbridge-red font-medium break-all">
            contact@northbridgeventuregroup.com
          </p>
        </aside>

        <ContactForm />
      </div>
    </div>
  );
}
