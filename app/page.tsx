import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home | Northbridge Venture Group",
  description:
    "Northbridge Venture Group builds and operates ventures in aviation and financial services, including Aviator Network and AirTax Financial.",
};

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24">
      <section className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold text-northbridge-black tracking-tight">
          Northbridge Venture Group
        </h1>
        <p className="mt-6 text-lg text-black/80">
          We build and operate ventures in aviation and financial services—focused on clarity,
          compliance, and long-term value.
        </p>
        <div className="mt-10 flex flex-wrap gap-4 justify-center">
          <Link
            href="/ventures"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-white bg-northbridge-red hover:opacity-90 transition-opacity"
          >
            Our Ventures
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold border-2 border-northbridge-black text-northbridge-black hover:bg-northbridge-black hover:text-white transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </section>

      <section className="mt-24 grid sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Link
          href="https://aviatornetwork.com"
          target="_blank"
          rel="noopener noreferrer"
          className="block p-6 rounded-xl border border-black/10 hover:border-northbridge-red/40 hover:shadow-lg transition-all"
        >
          <h2 className="text-xl font-bold text-northbridge-black">Aviator Network</h2>
          <p className="mt-2 text-sm text-black/70">
            Connecting student pilots with flight instructors and aviation training.
          </p>
          <span className="mt-3 inline-block text-sm font-medium text-northbridge-red">
            aviatornetwork.com →
          </span>
        </Link>
        <Link
          href="https://airtaxfinancial.com"
          target="_blank"
          rel="noopener noreferrer"
          className="block p-6 rounded-xl border border-black/10 hover:border-northbridge-red/40 hover:shadow-lg transition-all"
        >
          <h2 className="text-xl font-bold text-northbridge-black">AirTax Financial</h2>
          <p className="mt-2 text-sm text-black/70">
            Premium tax and financial services for aviation professionals.
          </p>
          <span className="mt-3 inline-block text-sm font-medium text-northbridge-red">
            airtaxfinancial.com →
          </span>
        </Link>
      </section>
    </div>
  );
}
