type ApproachSectionProps = {
  items: string[];
};

export function ApproachSection({ items }: ApproachSectionProps) {
  return (
    <section className="mt-16 max-w-3xl">
      <h2 className="nb-h2">How Northbridge approaches it</h2>
      <p className="mt-4 nb-body">
        We start by understanding how your business works today, then design a better way to
        operate—with clear ownership and measurable outcomes.
      </p>
      <ol className="mt-8 space-y-4">
        {items.map((item, index) => (
          <li key={item} className="flex gap-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-northbridge-red/40 text-sm font-bold text-northbridge-red">
              {index + 1}
            </span>
            <span className="pt-1 text-white/75 leading-relaxed">{item}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
