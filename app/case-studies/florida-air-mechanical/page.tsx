import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Florida Air & Mechanical Contractors LLC — Digital Infrastructure Build | Northbridge Venture Group",
  description:
    "Northbridge client case study: full digital infrastructure for Florida Air & Mechanical Contractors LLC—HVAC contractor brand, web architecture, SEO, lead systems, and conversion-focused UX.",
};

type StudySection = {
  title: string;
  lead: string;
  points: string[];
};

const sections: StudySection[] = [
  {
    title: "1. Project Objective",
    lead: "Stand up a complete, contractor-grade digital operating layer for a full-service HVAC business in a competitive Orlando market.",
    points: [
      "Clarify how Florida Air & Mechanical wins work across residential, commercial, and planned maintenance—then make that story obvious online.",
      "Replace fragmented touchpoints with one coherent funnel: discovery → trust → inquiry → dispatch-ready handoff.",
      "Build for scale: add services, crews, and service areas without rebuilding the core site each time.",
    ],
  },
  {
    title: "2. Brand & Business Foundation",
    lead: "Anchor the digital experience in a credible, professional brand system that reads as established—not generic trades stock.",
    points: [
      "Defined primary positioning around licensed mechanical contracting, workmanship standards, and response reliability.",
      "Structured proof hierarchy: credentials, service scope, geography, and customer outcomes surfaced consistently—not buried.",
      "Established voice and tone for B2B and homeowner segments: direct, safety-conscious, and operationally precise.",
    ],
  },
  {
    title: "3. Website Architecture",
    lead: "Designed an information architecture that mirrors how buyers actually choose an HVAC partner.",
    points: [
      "Service-first navigation with clear separation between install, replacement, repair, and maintenance paths.",
      "Dedicated conversion routes for urgent repair vs. planned projects—different intent, different CTAs.",
      "Performance-minded page model: lean critical paths on mobile, fast first paint, and predictable layout stability.",
    ],
  },
  {
    title: "4. Service Architecture",
    lead: "Modeled the full HVAC service catalog for both humans and search engines—so every offer has a home and a purpose.",
    points: [
      "Commercial vs. residential narratives with appropriate risk, compliance, and uptime language for each buyer.",
      "Equipment and outcome language aligned to how prospects search (comfort, efficiency, indoor air quality, downtime).",
      "Cross-links between complementary services to increase relevance and reduce dead-end pages.",
    ],
  },
  {
    title: "5. Customer Segment Strategy",
    lead: "Aligned pages, proof, and CTAs to the segments that actually drive revenue for a mechanical contractor.",
    points: [
      "Homeowners: emergency clarity, financing and replacement framing, and trust signals close to the inquiry action.",
      "Property and facility stakeholders: response expectations, documentation posture, and commercial references.",
      "Builders and project partners: capability statements, scheduling discipline, and scope control language.",
    ],
  },
  {
    title: "6. Lead Capture Systems",
    lead: "Built inquiry mechanics that respect field operations—quality over volume, with clean routing.",
    points: [
      "Structured forms that qualify intent (service type, timeline, property context) without creating friction fatigue.",
      "Click-to-call prominence on mobile for emergency workflows; form-first paths for planned work.",
      "Clear next-step messaging after submit so prospects know what happens next—and when.",
    ],
  },
  {
    title: "7. Email Infrastructure",
    lead: "Established a professional email layer that supports trust, deliverability, and operational follow-through.",
    points: [
      "Branded domain identity for customer-facing communication—consistent with the public site experience.",
      "Inquiry notifications and acknowledgements designed to reduce no-shows and duplicate triage.",
      "Foundation for lifecycle messaging (seasonal maintenance, reminders) without compromising compliance posture.",
    ],
  },
  {
    title: "8. SEO Infrastructure",
    lead: "Implemented technical SEO foundations appropriate for local mechanical services—stable, crawlable, and measurable.",
    points: [
      "Metadata discipline, canonical strategy, and indexation controls aligned to a multi-page service footprint.",
      "Structured data patterns where they materially help relevance (organization, services, local context).",
      "Sitemap and internal discovery paths that reflect business priority—not accidental URL sprawl.",
    ],
  },
  {
    title: "9. SEO Landing Pages",
    lead: "Deployed intent-led landing pages that map to how Orlando-area customers search and compare providers.",
    points: [
      "Service + geography combinations built as durable assets—not thin doorway pages.",
      "Differentiated copy per offer cluster to avoid duplicate-value signals across similar URLs.",
      "On-page modules that reinforce expertise: scope, process, warranties, and what “done right” means for that service.",
    ],
  },
  {
    title: "10. Internal SEO Linking",
    lead: "Strengthened topical authority with deliberate internal linking—pillars, clusters, and contextual bridges.",
    points: [
      "Hub-and-spoke relationships between core commercial/residential pillars and supporting service detail pages.",
      "Contextual in-content links that guide users naturally while distributing PageRank to high-value URLs.",
      "Breadcrumb and navigation patterns that reinforce entity relationships for users and crawlers alike.",
    ],
  },
  {
    title: "11. UX / Conversion Optimization",
    lead: "Tuned layout, hierarchy, and interaction design for conversion—especially on mobile under stress (heat, downtime).",
    points: [
      "Above-the-fold clarity: who you help, where you operate, what to do next—without noisy distractions.",
      "Repeated, consistent CTAs placed at decision points—not random button sprawl.",
      "Readability, spacing, and component consistency to reduce cognitive load during high-intent sessions.",
    ],
  },
  {
    title: "12. Trust & Credibility Systems",
    lead: "Made trust operational: visible, verifiable, and adjacent to the actions that drive revenue.",
    points: [
      "Licensing, insurance, and mechanical contracting credibility surfaced in high-trust zones of the journey.",
      "Review and reputation modules framed as risk reduction—not decoration.",
      "Project storytelling patterns that demonstrate scope discipline and workmanship—without overclaiming.",
    ],
  },
  {
    title: "13. Hosting / Infrastructure",
    lead: "Production-grade hosting posture suitable for a business where downtime equals lost revenue and reputation risk.",
    points: [
      "Secure transport, modern TLS posture, and hardened defaults aligned to contemporary baseline expectations.",
      "Operational resilience: backups, update discipline, and a release model that supports iterative improvement.",
      "Monitoring-friendly structure so performance regressions are visible—not guessed.",
    ],
  },
  {
    title: "14. Payment Readiness",
    lead: "Prepared the digital experience for how customers expect to pay in the field and online.",
    points: [
      "Clear pathways for estimates, deposits, and invoice expectations—reducing admin drag on crews.",
      "Positioning for card and digital payment acceptance where appropriate, with transparent customer communication.",
      "Commercial account behaviors acknowledged: PO workflows, billing contacts, and net terms where relevant.",
    ],
  },
  {
    title: "15. Delivered Result",
    lead: "A sales-ready digital system: not a brochure, but an asset that supports capture, qualification, and closure.",
    points: [
      "A coherent brand and web footprint that matches the quality of work delivered on-site.",
      "Search-led discovery coverage across priority services and segments—built to compound over time.",
      "Lead capture and trust systems aligned to real operations: fewer junk touches, cleaner dispatch conversations.",
    ],
  },
  {
    title: "16. Northbridge Scope",
    lead: "Northbridge Venture Group served as the execution partner for strategy through launch—treating digital as infrastructure, not collateral.",
    points: [
      "Business and offer architecture, UX and conversion design, technical implementation, and SEO launch sequencing.",
      "Collaboration with ownership to align messaging with how the company actually wins and delivers work.",
      "Optional ongoing iteration: landing page expansion, CRO experiments, and content cadence as the business grows.",
    ],
  },
];

export default function FloridaAirMechanicalCaseStudy() {
  return (
    <article className="nb-page">
        <header className="max-w-3xl">
          <p className="nb-eyebrow">Northbridge client case study</p>
          <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-white text-balance tracking-tight">
            Florida Air & Mechanical Contractors LLC — Digital Infrastructure Build
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-white/70 leading-relaxed">
            Full HVAC contractor digital infrastructure: brand foundation, web and service architecture, SEO
            systems, lead capture, and conversion-focused UX—built for Orlando, Florida and built to scale with the
            business.
          </p>
          <dl className="mt-8 grid gap-4 sm:grid-cols-2 text-sm sm:text-base">
            <div className="nb-card p-5">
              <dt className="font-semibold text-white">Client</dt>
              <dd className="mt-1 text-white/70">Florida Air & Mechanical Contractors LLC</dd>
            </div>
            <div className="nb-card p-5">
              <dt className="font-semibold text-white">Location</dt>
              <dd className="mt-1 text-white/70">Orlando, Florida</dd>
            </div>
          </dl>
        </header>

        <div className="mt-16 sm:mt-20 space-y-6 sm:space-y-8">
          {sections.map((section) => (
            <section
              key={section.title}
              className="nb-card-interactive"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-white">{section.title}</h2>
              <p className="mt-4 text-white/70 leading-relaxed">{section.lead}</p>
              <ul className="mt-5 space-y-3 text-white/70 leading-relaxed list-none">
                {section.points.map((point) => (
                  <li key={point} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-northbridge-red" aria-hidden />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <aside className="mt-16 sm:mt-20 rounded-2xl border border-northbridge-red/40 bg-northbridge-charcoal p-8 sm:p-10 lg:p-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-balance">
            Build the same caliber of digital infrastructure for your operation.
          </h2>
          <p className="mt-4 text-white/85 max-w-2xl leading-relaxed">
            If you are scaling a services business and need a web system that supports SEO, lead quality, and
            trust—not just a template—Northbridge can partner from strategy through launch.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row flex-wrap gap-4">
            <Link
              href="/contact"
              className="btn-primary"
            >
              Contact Northbridge
            </Link>
            <Link
              href="/partner-with-us"
              className="btn-secondary"
            >
              Partner With Us
            </Link>
          </div>
        </aside>
    </article>
  );
}
