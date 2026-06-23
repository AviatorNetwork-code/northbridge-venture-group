import Link from "next/link";
import type { Metadata } from "next";
import { digitalSolutions } from "@/lib/digital-solutions";

export const metadata: Metadata = {
  title: "Northbridge Digital | Intelligent Business Systems",
  description:
    "Northbridge Digital helps businesses replace operational complexity with intelligent systems—customer acquisition, automation, visibility, and custom software.",
};

export default function DigitalPage() {
  return (
    <div className="nb-page">
      <section className="max-w-3xl">
        <p className="nb-eyebrow">Northbridge Digital</p>
        <h1 className="mt-3 nb-h1 text-balance">
          Helping businesses replace operational complexity with intelligent systems.
        </h1>
        <p className="mt-6 nb-lead">
          Northbridge Digital is the client services and digital infrastructure division of Northbridge
          Venture Group. We design customer acquisition systems, operational automation, business
          intelligence, and custom platforms for organizations ready to modernize how they grow and
          operate.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link href="/digital/assessment" className="btn-primary">
            Start Business Assessment
          </Link>
          <Link href="/contact" className="btn-secondary">
            Book Strategy Call
          </Link>
        </div>
      </section>

      <section className="mt-24">
        <p className="nb-eyebrow">Where to start</p>
        <h2 className="mt-3 nb-h2">What does your business need most?</h2>
        <p className="mt-4 nb-lead max-w-2xl">
          Select the area closest to your situation. Our assessment maps your context to the right
          system—not a generic proposal.
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {digitalSolutions.map((solution) => (
            <Link
              key={solution.need}
              href={`/digital/assessment?need=${solution.need}`}
              className="nb-card-interactive group flex flex-col"
            >
              <h3 className="text-lg font-bold text-white group-hover:text-northbridge-red transition-colors">
                {solution.title}
              </h3>
              <p className="mt-3 text-sm text-white/65 leading-relaxed flex-1">
                {solution.description}
              </p>
              <span className="mt-5 text-sm font-semibold text-northbridge-red">
                Start assessment →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-24 max-w-3xl">
        <div className="nb-card border-northbridge-red/25">
          <p className="nb-eyebrow">Next step</p>
          <h2 className="mt-3 nb-h3">Understand your fit in minutes</h2>
          <p className="mt-4 nb-body">
            The Business Assessment captures your profile, priorities, and constraints. Northbridge
            reviews your responses and recommends the best path forward—without pricing quotes or
            generic proposals on the page.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/digital/assessment" className="btn-primary">
              Start Business Assessment
            </Link>
            <Link href="/contact" className="btn-secondary">
              Book Strategy Call
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
