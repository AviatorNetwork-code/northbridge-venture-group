import type { ExpertiseContent } from "@/lib/digital/expertise";

type ExpertiseHeroProps = {
  expertise: ExpertiseContent;
};

export function ExpertiseHero({ expertise }: ExpertiseHeroProps) {
  return (
    <section className="max-w-3xl">
      <p className="nb-eyebrow">Expertise · {expertise.name}</p>
      <h1 className="mt-3 nb-h1 text-balance">{expertise.heroTitle}</h1>
      <p className="mt-6 nb-lead">{expertise.heroSubtitle}</p>
    </section>
  );
}
