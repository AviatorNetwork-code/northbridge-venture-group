type IndustryOverviewProps = {
  paragraphs: string[];
};

export function IndustryOverview({ paragraphs }: IndustryOverviewProps) {
  return (
    <section className="mt-16 max-w-3xl">
      <h2 className="nb-h2">Industry overview</h2>
      <div className="mt-6 space-y-4">
        {paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 48)} className="nb-body">
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}
