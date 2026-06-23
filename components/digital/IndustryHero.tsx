import type { IndustryContent } from "@/lib/digital/industries";

type IndustryHeroProps = {
  industry: IndustryContent;
};

export function IndustryHero({ industry }: IndustryHeroProps) {
  return (
    <section className="max-w-3xl">
      <p className="nb-eyebrow">Industries · {industry.name}</p>
      <h1 className="mt-3 nb-h1 text-balance">{industry.heroTitle}</h1>
      <p className="mt-6 nb-lead">{industry.heroSubtitle}</p>
    </section>
  );
}
