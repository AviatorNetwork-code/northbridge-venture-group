import Link from "next/link";
import type { Metadata } from "next";
import { ClientCard } from "@/components/ClientCard";
import { VentureCard } from "@/components/VentureCard";
import { clients } from "@/lib/clients";
import { ventures } from "@/lib/ventures";

export const metadata: Metadata = {
  title: "Home | Northbridge Venture Group",
  description:
    "Northbridge Venture Group builds and operates ventures in aviation and financial services—including Aviator Network and AirTax Financial—with client services through Northbridge Digital.",
};

export default function Home() {
  return (
    <div className="nb-page">
      <section className="text-center max-w-3xl mx-auto">
        <h1 className="nb-h1">Northbridge Venture Group</h1>
        <p className="mt-6 nb-lead">
          We build and operate ventures in aviation and financial services—focused on clarity,
          compliance, and long-term value.
        </p>
        <div className="mt-10 flex flex-wrap gap-4 justify-center">
          <Link href="/ventures" className="btn-primary">
            Our Ventures
          </Link>
          <Link href="/contact" className="btn-secondary">
            Contact Us
          </Link>
        </div>
      </section>

      <section className="mt-24 max-w-5xl mx-auto">
        <p className="nb-eyebrow">Ventures</p>
        <h2 className="mt-3 nb-h2">Northbridge-Owned Platforms</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ventures.map((venture) => (
            <VentureCard key={venture.name} venture={venture} compact />
          ))}
        </div>
        <div className="mt-8">
          <Link
            href="/ventures"
            className="text-sm font-semibold text-northbridge-red hover:underline"
          >
            View all ventures →
          </Link>
        </div>
      </section>

      <section className="mt-24 max-w-3xl mx-auto">
        <p className="nb-eyebrow">Services</p>
        <h2 className="mt-3 nb-h2">Northbridge Digital</h2>
        <p className="mt-4 nb-lead">
          Northbridge Digital helps businesses replace operational complexity with intelligent
          systems—customer acquisition, operations, visibility, and custom software.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link href="/digital/assessment" className="btn-primary">
            Start Business Assessment
          </Link>
          <Link href="/services" className="btn-secondary">
            View Services
          </Link>
        </div>
      </section>

      <section className="mt-24 max-w-4xl mx-auto">
        <p className="nb-eyebrow">Clients</p>
        <h2 className="mt-3 nb-h2">Organizations We Support</h2>
        <p className="mt-4 nb-lead">
          Organizations that have worked with Northbridge on digital infrastructure, online presence,
          and operational systems.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {clients.map((client) => (
            <ClientCard key={client.name} client={client} />
          ))}
        </div>
        <div className="mt-8">
          <Link
            href="/clients"
            className="text-sm font-semibold text-northbridge-red hover:underline"
          >
            View all clients →
          </Link>
        </div>
      </section>
    </div>
  );
}
