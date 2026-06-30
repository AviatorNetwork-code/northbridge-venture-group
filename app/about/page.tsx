import type { Metadata } from "next";

import { PageHeader } from "@/components/ui/PageHeader";

import { Section } from "@/components/ui/Section";

import { SectionHeader } from "@/components/ui/SectionHeader";

import { CTABand } from "@/components/ui/CTABand";

import { VentureCard } from "@/components/VentureCard";

import { DIAGNOSTIC_CTA } from "@/lib/digital/metadata";

import { additionalPlatforms, platforms } from "@/lib/platforms";

import { siteMetadata } from "@/lib/site-metadata";



export const metadata: Metadata = siteMetadata({

  title: "About Us",

  description:

    "Northbridge Venture Group helps organizations understand operational challenges, design intelligent solutions, and build systems that improve how work gets done.",

  path: "/about",

});



const howWeHelp = [

  {

    title: "Business Solutions",

    description:

      "Adaptable solutions for workforce operations, customer acquisition, visibility, automation, and complex engagements—starting with your problem, not a product catalog.",

  },

  {

    title: "Northbridge Digital",

    description:

      "When the right answer requires systems built for how your organization actually operates, Northbridge Digital designs and implements tailored software and infrastructure.",

  },

  {

    title: "Our Platforms",

    description:

      "Northbridge builds and operates platforms that demonstrate engineering capability in aviation, workforce coordination, and adjacent markets—proof of what we can deliver, not a substitute for understanding your business.",

  },

];



const coreValues = [

  {

    title: "Clarity",

    description: "We name problems precisely before proposing solutions.",

  },

  {

    title: "Operational honesty",

    description: "We design for how work actually happens—not idealized process diagrams.",

  },

  {

    title: "Long-term value",

    description: "We favor durable systems over quick fixes that create new debt.",

  },

  {

    title: "Disciplined build",

    description: "Custom software is scoped deliberately through Northbridge Digital.",

  },

];



const howWeWork = [

  "Understand the business problem and who it affects.",

  "Evaluate operations, data, and constraints—not just software gaps.",

  "Recommend a business solution, platform context, or custom build path.",

  "Implement with Northbridge Digital when tailored systems are required.",

  "Measure whether the change improved how the business runs.",

];



export default function About() {

  return (

    <div className="nb-page">

      <Section variant="hero" narrow>

        <PageHeader

          eyebrow="About Us"

          title="Understanding operations. Building what works."

          description={

            <>

              <p>

                Modern organizations face increasingly complex operational challenges—scheduling,

                coordination, acquisition, visibility, and systems that no longer match how work

                actually happens.

              </p>

              <p className="mt-4">

                Northbridge exists to help businesses understand those challenges, design

                intelligent solutions, and build systems that improve the way they operate.

              </p>

            </>

          }

        />

      </Section>



      <Section>

        <SectionHeader

          eyebrow="How we help"

          title="From problem to solution to implementation"

          description="Northbridge works across three complementary areas. Each starts with your operational reality—not our organizational chart."

        />

        <div className="nb-section-body nb-card-grid-3">

          {howWeHelp.map((item) => (

            <article key={item.title} className="nb-card">

              <h3 className="nb-h3 text-base sm:text-lg">{item.title}</h3>

              <p className="mt-3 nb-body">{item.description}</p>

            </article>

          ))}

        </div>

      </Section>



      <Section variant="band">

        <div className="grid gap-12 lg:grid-cols-2">

          <div>

            <SectionHeader eyebrow="Mission" title="Make complex operations understandable" />

            <p className="mt-4 sm:mt-5 nb-body max-w-xl">

              Northbridge exists to help organizations see how their business works, fix what blocks

              progress, and apply technology where it earns its place.

            </p>

          </div>

          <div>

            <SectionHeader eyebrow="Vision" title="Connected systems for workforce-driven industries" />

            <p className="mt-4 sm:mt-5 nb-body max-w-xl">

              We are building toward an ecosystem where platforms, applied intelligence, and

              practical services support aviation and adjacent industries—without forcing businesses

              into one-size-fits-all software.

            </p>

          </div>

        </div>

      </Section>



      <Section>

        <SectionHeader eyebrow="Core Values" title="How we make decisions" />

        <div className="nb-section-body nb-card-grid-2">

          {coreValues.map((value) => (

            <article key={value.title} className="nb-card">

              <h3 className="nb-h3 text-base">{value.title}</h3>

              <p className="mt-2 nb-body">{value.description}</p>

            </article>

          ))}

        </div>

      </Section>



      <Section variant="band">

        <SectionHeader eyebrow="How We Work" title="Business first. Technology when it fits." />

        <ol className="nb-section-body max-w-2xl space-y-4 list-none">

          {howWeWork.map((step, index) => (

            <li key={step} className="flex gap-4 nb-body">

              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/15 text-xs font-semibold text-white/80">

                {index + 1}

              </span>

              <span className="pt-0.5">{step}</span>

            </li>

          ))}

        </ol>

      </Section>



      <Section id="platforms">

        <SectionHeader

          eyebrow="Our Platforms"

          title="Proof of capability"

          description="Platforms are products Northbridge builds and operates. They inform our solutions work—they are not a substitute for understanding your business."

        />

        <div className="nb-section-body space-y-5">

          {platforms.map((platform) => (

            <VentureCard key={platform.name} venture={platform} />

          ))}

        </div>

        {additionalPlatforms.length > 0 && (

          <div className="mt-8">

            <p className="nb-eyebrow text-[0.65rem]">Also in portfolio</p>

            <div className="mt-4 grid gap-5 sm:grid-cols-2">

              {additionalPlatforms.map((platform) => (

                <VentureCard key={platform.name} venture={platform} compact />

              ))}

            </div>

          </div>

        )}

      </Section>



      <Section variant="tight">

        <CTABand

          eyebrow="Next step"

          title="Not sure where your organization should start?"

          description="The Business Diagnostic maps how your business operates today and helps Northbridge recommend a practical path forward."

          primaryHref="/digital/assessment"

          primaryLabel={DIAGNOSTIC_CTA}

        />

      </Section>

    </div>

  );

}


