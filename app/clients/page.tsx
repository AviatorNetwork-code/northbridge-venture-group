import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clients | Northbridge Venture Group",
  description:
    "Organizations we have had the privilege to work with. Northbridge Venture Group clients include Royal International Flight School and Florida Air & Mechanical Contractors LLC.",
};

type Client = {
  name: string;
  description: string;
  location?: string;
  category?: string;
  caseStudyHref?: string;
};

const clients: Client[] = [
  {
    name: "Royal International Flight School",
    description: "Flight training and aviation education.",
  },
  {
    name: "Florida Air & Mechanical Contractors LLC",
    location: "Orlando, Florida",
    category: "HVAC / Mechanical Contractor",
    description:
      "Full digital infrastructure build for an HVAC and mechanical contractor, including branded web presence, segmented service architecture, lead capture systems, SEO landing pages, email routing, and payment-readiness infrastructure.",
    caseStudyHref: "/case-studies/florida-air-mechanical",
  },
];

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
        {clients.map((c) => (
          <div
            key={c.name}
            className="p-8 rounded-xl border border-black/10 bg-white"
          >
            <h2 className="text-2xl font-bold text-northbridge-black">{c.name}</h2>
            {c.location && (
              <p className="mt-2 text-sm font-medium text-black/70">{c.location}</p>
            )}
            {c.category && (
              <p className="mt-1 text-sm font-semibold text-northbridge-red">{c.category}</p>
            )}
            <p className="mt-3 text-black/80">{c.description}</p>
            {c.caseStudyHref && (
              <Link
                href={c.caseStudyHref}
                className="mt-5 inline-block text-sm font-semibold text-northbridge-red hover:underline"
              >
                View Case Study →
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
