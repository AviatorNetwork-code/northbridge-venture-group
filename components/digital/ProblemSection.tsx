type ProblemSectionProps = {
  problemStatement: string[];
  whyStruggle: string[];
};

export function ProblemSection({ problemStatement, whyStruggle }: ProblemSectionProps) {
  return (
    <section className="mt-16 sm:mt-20 max-w-3xl">
      <h2 className="nb-h2">The problem</h2>
      <div className="mt-6 space-y-4">
        {problemStatement.map((paragraph) => (
          <p key={paragraph.slice(0, 48)} className="nb-body">
            {paragraph}
          </p>
        ))}
      </div>

      <h3 className="mt-14 nb-h3">Why businesses struggle</h3>
      <ul className="mt-8 space-y-4">
        {whyStruggle.map((item) => (
          <li key={item} className="nb-list-bullet">
            <span className="nb-list-bullet-dot" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
