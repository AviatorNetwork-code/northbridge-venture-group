import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Case Studies | Northbridge Venture Group",
  description:
    "Selected Northbridge Venture Group client engagements—digital infrastructure, web architecture, SEO, and conversion systems.",
};

const studies = [
  {
    href: "/case-studies/florida-air-mechanical",
    title: "Florida Air & Mechanical Contractors LLC",
    subtitle: "Digital Infrastructure Build",
    description:
      "Full HVAC contractor digital stack: brand foundation, website and service architecture, SEO, lead capture, and trust systems—Orlando, Florida.",
  },
];

export default function CaseStudiesIndex() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24">
      <p className="text-sm font-semibold uppercase tracking-wider text-northbridge-red">Case studies</p>
      <h1 className="mt-3 text-4xl font-bold text-northbridge-black">Client work</h1>
      <p className="mt-4 text-lg text-black/80 max-w-2xl">
        A selection of Northbridge engagements focused on digital infrastructure, conversion, and durable growth
        systems—not one-off brochure sites.
      </p>
      <ul className="mt-12 space-y-6">
        {studies.map((s) => (
          <li key={s.href}>
            <Link
              href={s.href}
              className="group block rounded-xl border border-black/10 bg-white p-6 sm:p-8 hover:border-northbridge-red/40 hover:shadow-lg transition-all"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-northbridge-black group-hover:text-northbridge-red transition-colors">
                {s.title}
              </h2>
              <p className="mt-1 text-sm font-semibold text-northbridge-red">{s.subtitle}</p>
              <p className="mt-3 text-black/80 leading-relaxed">{s.description}</p>
              <span className="mt-4 inline-block text-sm font-semibold text-northbridge-red">
                Read case study →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
