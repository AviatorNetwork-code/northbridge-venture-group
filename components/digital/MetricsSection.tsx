type MetricsSectionProps = {
  items: string[];
};

export function MetricsSection({ items }: MetricsSectionProps) {
  return (
    <section className="mt-16 sm:mt-20">
      <h2 className="nb-h2">How success is measured</h2>
      <p className="mt-4 nb-body max-w-2xl">
        Progress should be visible in day-to-day operations—not only in a slide deck at quarter-end.
      </p>
      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item} className="nb-list-item">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
