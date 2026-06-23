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
    <div className="nb-page">
      <p className="nb-eyebrow">Case studies</p>
      <h1 className="mt-3 nb-h1">Client work</h1>
      <p className="mt-4 nb-lead max-w-2xl">
        A selection of Northbridge engagements focused on digital infrastructure, conversion, and durable growth
        systems—not one-off brochure sites.
      </p>
      <ul className="mt-12 space-y-6">
        {studies.map((s) => (
          <li key={s.href}>
            <Link href={s.href} className="group block nb-card-interactive">
              <h2 className="nb-h3 group-hover:text-northbridge-red transition-colors">
                {s.title}
              </h2>
              <p className="mt-1 text-sm font-semibold text-northbridge-red">{s.subtitle}</p>
              <p className="mt-3 text-white/70 leading-relaxed">{s.description}</p>
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
