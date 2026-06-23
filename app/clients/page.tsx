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
    <div className="nb-page">
      <h1 className="nb-h1">Clients</h1>
      <p className="mt-4 nb-lead max-w-2xl">
        We are proud to work with organizations that share our commitment to quality and
        compliance. Our clients are listed below. This section is distinct from our
        ventures—ventures are brands we operate; clients are organizations we serve.
      </p>
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {clients.map((client) => (
          <ClientCard key={client.name} client={client} />
        ))}
      </div>
    </div>
  );
}
