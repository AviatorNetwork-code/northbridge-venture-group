import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PRIMARY_CONTACT_EMAIL } from "@/lib/contact";
import { siteMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = siteMetadata({
  title: "Research",
  description:
    "Northbridge Research leads applied intelligence systems, adaptive AI infrastructure, and data-informed platform development—with aviation as the first research initiative through Aviator Network.",
  path: "/research",
  openGraphTitle: "Northbridge Research",
});

const researchPillars = [
  {
    title: "Applied intelligence systems",
    description:
      "Research into practical AI and decision-support systems designed for regulated, safety-sensitive environments—not generic chat interfaces.",
  },
  {
    title: "Adaptive research infrastructure",
    description:
      "CAT (Context-Adaptive Technology) serves as Northbridge’s adaptive research infrastructure—structured to learn from operational context while maintaining human oversight and auditability.",
  },
  {
    title: "Data-informed product improvement",
    description:
      "Platform telemetry, structured feedback loops, and research instrumentation designed to improve products based on evidence—not assumptions.",
  },
  {
    title: "SBIR/STTR readiness",
    description:
      "Northbridge maintains research documentation, technical narratives, and platform architecture suitable for small-business innovation research proposals. We do not represent active awards unless publicly disclosed.",
  },
];

const aviationInitiative = [
  "Aviation is Northbridge’s first applied research initiative—where platform technology meets real training operations.",
  "Aviator Network provides deployment context with student pilots, certificated instructors, and flight schools.",
  "Research areas include training workflow efficiency, instructor-student coordination, logbook intelligence, and safety-adjacent operational patterns.",
  "Findings inform both platform development and broader workforce development research questions.",
];

const agencyRelevance = [
  {
    agency: "FAA",
    focus: "Training standards, instructor coordination, and safety-adjacent operational research aligned with practical aviation education.",
  },
  {
    agency: "DOT",
    focus: "Transportation workforce pipelines and technology adoption in aviation training ecosystems.",
  },
  {
    agency: "NSF",
    focus: "Applied AI, human-computer interaction in safety-critical domains, and university-industry research collaboration models.",
  },
  {
    agency: "NASA",
    focus: "Adaptive systems, operational decision support, and technology transfer patterns relevant to complex training environments.",
  },
];

const collaborationAreas = [
  {
    title: "University collaboration",
    description:
      "Structured partnerships with academic institutions for joint research, student involvement, and validated study design—particularly in aviation education and applied AI.",
  },
  {
    title: "Workforce development",
    description:
      "Research into how technology supports pilot and instructor pipelines, training completion, and career progression in aviation.",
  },
  {
    title: "Safety research",
    description:
      "Investigation of operational patterns, training friction, and system design factors that affect safety culture—without substituting for regulatory authority or certified safety programs.",
  },
];

const RESEARCH_PARTNERSHIP_EMAIL = "partners@northbridgeventuregroup.com";

export default function ResearchPage() {
  return (
    <div className="nb-page">
      <Section variant="hero">
        <PageHeader
          eyebrow="Northbridge Research"
          title="Research and technology infrastructure for applied intelligence"
          description={
            <>
              <p>
                Northbridge Venture Group leads the research and technology infrastructure. Aviator
                Network operates the aviation platform and supports real-world deployment with
                pilots, instructors, and flight schools.
              </p>
              <p className="mt-4">
                Northbridge Research is the group’s applied R&amp;D function—covering AI systems,
                platform architecture, data infrastructure, and adaptive intelligence designed for
                real operational environments.
              </p>
            </>
          }
        >
          <div className="nb-cta-group">
            <ButtonLink href={`mailto:${RESEARCH_PARTNERSHIP_EMAIL}?subject=Northbridge%20Research%20partnership%20inquiry`}>
              Research partnership inquiry
            </ButtonLink>
            <ButtonLink
              href={`mailto:${PRIMARY_CONTACT_EMAIL}?subject=Northbridge%20Research%20-%20government%20or%20university%20collaboration`}
              variant="secondary"
            >
              Government / university collaboration
            </ButtonLink>
          </div>
        </PageHeader>
      </Section>

      <Section variant="band">
        <SectionHeader
          eyebrow="Research focus"
          title="What Northbridge Research develops"
          description="Applied systems research with a path to deployment—not speculative technology without operational grounding."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {researchPillars.map((pillar) => (
            <article key={pillar.title} className="nb-card p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-white">{pillar.title}</h3>
              <p className="mt-3 text-sm text-white/65 leading-relaxed">{pillar.description}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16 items-start">
          <SectionHeader
            eyebrow="First initiative"
            title="Aviation as the applied research domain"
            description="Northbridge’s research program prioritizes aviation because the domain demands rigor, traceability, and human-in-the-loop design."
          />
          <ul className="space-y-4 text-sm text-white/70 leading-relaxed list-none">
            {aviationInitiative.map((item) => (
              <li key={item} className="flex gap-3">
                <span
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-northbridge-red"
                  aria-hidden="true"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-10 text-sm text-white/50 max-w-3xl leading-relaxed">
          Aviator Network is a Northbridge-owned platform. Research conducted through Northbridge
          Research may inform Aviator Network product development; platform operations remain
          distinct from grant or academic study protocols when formally engaged.
        </p>
      </Section>

      <Section variant="tight">
        <SectionHeader
          eyebrow="Agency alignment"
          title="Relevance to federal research priorities"
          description="Northbridge Research topics align with areas commonly supported by U.S. federal agencies. Listing an agency indicates thematic relevance—not endorsement, partnership, or funding relationship."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {agencyRelevance.map((item) => (
            <article key={item.agency} className="nb-card p-6">
              <p className="nb-eyebrow text-[0.65rem]">{item.agency}</p>
              <p className="mt-3 text-sm text-white/65 leading-relaxed">{item.focus}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section variant="band">
        <SectionHeader
          eyebrow="Collaboration"
          title="University, workforce, and safety research"
          description="Northbridge Research is structured for credible collaboration with academic and public-sector partners."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {collaborationAreas.map((area) => (
            <article key={area.title} className="nb-card p-6">
              <h3 className="font-semibold text-white">{area.title}</h3>
              <p className="mt-3 text-sm text-white/65 leading-relaxed">{area.description}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section variant="tight">
        <div className="nb-cta-band">
          <p className="nb-eyebrow">Engage Northbridge Research</p>
          <h2 className="mt-4 nb-h3 max-w-xl">Discuss research partnership or collaboration</h2>
          <p className="mt-4 nb-body max-w-2xl">
            We welcome inquiries from research partners, university labs, and public-sector programs
            exploring applied intelligence in aviation and adjacent domains. Share your organization,
            research interest, and proposed collaboration model—we respond with a direct next step.
          </p>
          <div className="mt-8 nb-cta-group">
            <ButtonLink href={`mailto:${RESEARCH_PARTNERSHIP_EMAIL}?subject=Northbridge%20Research%20partnership%20inquiry`}>
              Research partnership inquiry
            </ButtonLink>
            <ButtonLink
              href={`mailto:${PRIMARY_CONTACT_EMAIL}?subject=Northbridge%20Research%20-%20government%20or%20university%20collaboration`}
              variant="secondary"
            >
              Government / university collaboration
            </ButtonLink>
            <ButtonLink href="/contact" variant="secondary">
              Contact Northbridge Research
            </ButtonLink>
          </div>
          <p className="mt-6 text-xs text-white/40 max-w-2xl leading-relaxed">
            Northbridge Venture Group is a private company. References to federal agencies describe
            research alignment only and do not imply government endorsement, certification, or
            contract status.
          </p>
        </div>
      </Section>
    </div>
  );
}
