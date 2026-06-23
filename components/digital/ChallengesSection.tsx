type ChallengesSectionProps = {
  challenges: string[];
  bottlenecks: string[];
};

export function ChallengesSection({ challenges, bottlenecks }: ChallengesSectionProps) {
  return (
    <section className="mt-16 sm:mt-20">
      <h2 className="nb-h2">Typical business challenges</h2>
      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {challenges.map((item) => (
          <li key={item} className="nb-list-item">
            {item}
          </li>
        ))}
      </ul>

      <h3 className="mt-14 nb-h3">Common operational bottlenecks</h3>
      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {bottlenecks.map((item) => (
          <li key={item} className="nb-list-item">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
