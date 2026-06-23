import Link from "next/link";

type SolutionsSectionProps = {
  improvements: string[];
  solutions: { label: string; href: string }[];
};

export function SolutionsSection({ improvements, solutions }: SolutionsSectionProps) {
  return (
    <section className="mt-16 sm:mt-20">
      <h2 className="nb-h2">Example improvement opportunities</h2>
      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {improvements.map((item) => (
          <li key={item} className="nb-list-item">
            {item}
          </li>
        ))}
      </ul>

      <h3 className="mt-14 nb-h3">Relevant Northbridge solutions</h3>
      <div className="mt-6 flex flex-wrap gap-3">
        {solutions.map((solution) => (
          <Link
            key={solution.href}
            href={solution.href}
            className="rounded-md border border-white/10 px-4 py-2 text-sm font-medium text-white/75 transition-colors hover:border-northbridge-red/40 hover:text-white"
          >
            {solution.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
