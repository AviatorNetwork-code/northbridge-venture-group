import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Northbridge Venture Group",
  description:
    "Northbridge builds and supports businesses that create practical value across modern industries through venture development, analytics, and strategic advisory.",
};

const pillars = [
  {
    title: "Customer Acquisition Systems",
    description:
      "Systems that help businesses generate leads, capture demand, and connect with the right customers.",
  },
  {
    title: "Market Intelligence & Analytics",
    description:
      "Data-driven insight for better decisions, market visibility, and strategic growth.",
  },
  {
    title: "Digital Infrastructure",
    description:
      "Digital platforms and operational systems that modernize industries and scale.",
  },
  {
    title: "Financial Strategy & Advisory",
    description:
      "Financial planning, tax strategy, structuring, and operational clarity.",
  },
  {
    title: "Venture Development & Investments",
    description:
      "Launch, support, and grow ventures with strong positioning and long-term upside.",
  },
];

export default function AboutPage() {
  return (
    <main className="pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-20 md:pb-24 px-4 sm:px-6 bg-black min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white mb-6 sm:mb-8">
          About Northbridge
        </h1>
        <div className="space-y-5 sm:space-y-6 text-silver leading-relaxed mb-12 sm:mb-16 text-sm sm:text-base">
          <p>
            Northbridge Venture Group builds and supports businesses that create
            practical value across modern industries. We focus on intelligent
            systems that improve how organizations generate leads, understand
            markets, operate financially, and scale through digital
            infrastructure.
          </p>
          <p>
            Our model combines venture development, analytics, customer
            acquisition systems, and strategic advisory to build companies
            positioned for long-term growth.
          </p>
        </div>

        <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-red mb-6">
          What We Build
        </h2>
        <div className="space-y-6 sm:space-y-8">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="pb-6 sm:pb-8 border-b border-white/10 last:border-0 last:pb-0"
            >
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
                {pillar.title}
              </h3>
              <p className="text-silver text-sm sm:text-base leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
