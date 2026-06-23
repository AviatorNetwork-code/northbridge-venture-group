import Link from "next/link";
import type { Metadata } from "next";
import { VentureCard } from "@/components/VentureCard";
import { ventures } from "@/lib/ventures";

export const metadata: Metadata = {
  title: "Ventures | Northbridge Venture Group",
  description:
    "Northbridge-owned ventures include Aviator Network, Quadrix, AirTax Financial, and future platforms in development.",
};

export default function Ventures() {
  return (
    <div className="nb-page">
      <h1 className="nb-h1">Ventures</h1>
      <p className="mt-4 nb-lead max-w-2xl">
        Ventures are Northbridge-owned products and platforms we build and operate. Client services
        are delivered through{" "}
        <Link href="/services" className="text-northbridge-red font-semibold hover:underline">
          Northbridge Digital
        </Link>
        .
      </p>
      <div className="mt-12 space-y-6">
        {ventures.map((v) => (
          <VentureCard key={v.name} venture={v} />
        ))}
      </div>
    </div>
  );
}
