import type { Metadata } from "next";
import { ClientCard } from "@/components/ClientCard";
import { clients } from "@/lib/clients";

export const metadata: Metadata = {
  title: "Clients | Northbridge Venture Group",
  description:
    "Organizations we have had the privilege to work with. Northbridge Venture Group clients include Royal International Flight School and Florida Air & Mechanical Contractors LLC.",
};

export default function Clients() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24">
      <h1 className="text-4xl font-bold text-northbridge-black">Clients</h1>
      <p className="mt-4 text-lg text-black/80 max-w-2xl">
        We are proud to work with organizations that share our commitment to quality and
        compliance. Our clients are listed below. This section is distinct from our
        ventures—ventures are brands we operate; clients are organizations we serve.
      </p>
      <div className="mt-12 space-y-8">
        {clients.map((client) => (
          <ClientCard key={client.name} client={client} />
        ))}
      </div>
    </div>
  );
}
