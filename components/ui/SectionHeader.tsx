type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  className = "",
}: SectionHeaderProps) {
  return (
    <div className={`max-w-2xl nb-animate-in ${className}`}>
      {eyebrow && <p className="nb-eyebrow">{eyebrow}</p>}
      <h2 className={`nb-h2 ${eyebrow ? "mt-3 sm:mt-4" : ""}`}>{title}</h2>
      {description && <p className="mt-4 sm:mt-5 nb-lead">{description}</p>}
    </div>
  );
}
