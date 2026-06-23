type EvaluationSectionProps = {
  items: string[];
};

export function EvaluationSection({ items }: EvaluationSectionProps) {
  return (
    <section className="mt-16 sm:mt-20 max-w-3xl">
      <h2 className="nb-h2">What Northbridge evaluates</h2>
      <p className="mt-4 nb-body">
        The Business Diagnostic and discovery conversations focus on how work actually flows—not
        abstract technology goals.
      </p>
      <ul className="mt-8 space-y-4">
        {items.map((item) => (
          <li key={item} className="nb-list-bullet">
            <span className="nb-list-bullet-dot" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
