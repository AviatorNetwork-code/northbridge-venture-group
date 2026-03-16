import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Northbridge Venture Group",
  description:
    "Learn about Northbridge Venture Group, our story, philosophy, and focus on building ventures and digital infrastructure systems.",
};

export default function AboutPage() {
  return (
    <main className="pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-20 md:pb-24 px-4 sm:px-6 bg-black min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white mb-6 sm:mb-8">
          About Northbridge
        </h1>

        {/* Our Story */}
        <section className="mb-10 sm:mb-12">
          <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-red mb-4">
            Our Story
          </h2>
          <div className="space-y-4 text-silver text-sm sm:text-base leading-relaxed">
            <p>
              Throughout my life, I have seen business opportunities and ideas
              that could become real companies. Like many aspiring
              entrepreneurs, I often lacked the technical resources or capital
              required to execute them.
            </p>
            <p>
              More than once, I later saw similar ideas appear in the market
              through someone else’s hands.
            </p>
            <p>
              That experience made something clear: many strong ideas never
              become reality simply because the person behind them lacks the
              tools to build them.
            </p>
            <p>Northbridge Venture Group was founded to change that.</p>
            <p>
              The company began as a way to finally execute my own major
              platform idea — Aviator Network.
            </p>
            <p>
              While building it, I realized that many professionals and
              entrepreneurs face the same challenge.
            </p>
            <p>That realization became the foundation of Northbridge.</p>
          </div>
        </section>

        {/* Our Philosophy */}
        <section className="mb-10 sm:mb-12">
          <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-red mb-4">
            Our Philosophy
          </h2>
          <p className="text-sm sm:text-base text-silver leading-relaxed mb-4">
            Northbridge operates with a simple principle:
          </p>
          <p className="text-base sm:text-lg text-white font-medium mb-4">
            “A great idea should never die on paper.”
          </p>
          <p className="text-sm sm:text-base text-silver leading-relaxed mb-4">
            Through digital infrastructure, platform development, and strategic
            collaboration, Northbridge works to transform strong concepts into
            real systems and ventures.
          </p>
          <p className="text-sm sm:text-base text-silver leading-relaxed">
            Some projects become internal ventures. Others are developed for
            organizations that need digital infrastructure. In select cases,
            Northbridge partners with founders whose ideas have the potential to
            reshape an industry.
          </p>
        </section>

        {/* Founder */}
        <section>
          <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-red mb-4">
            Founder
          </h2>
          <h3 className="text-lg sm:text-xl font-semibold text-white">
            Andres Suarez
          </h3>
          <p className="text-silver text-sm sm:text-base mt-1 mb-3">
            Founder, Northbridge Venture Group
          </p>
          <p className="text-silver text-sm sm:text-base leading-relaxed">
            Entrepreneur and aviation professional focused on building platforms
            and systems that connect professionals and unlock opportunities
            within specialized industries.
          </p>
        </section>
      </div>
    </main>
  );
}
