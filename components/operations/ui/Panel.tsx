export default function Panel({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`border border-white/10 bg-charcoal/80 ${className}`}
    >
      {title && (
        <header className="px-4 sm:px-5 py-3 border-b border-white/10">
          <h3 className="text-sm font-semibold text-white">{title}</h3>
        </header>
      )}
      <div className="p-4 sm:p-5">{children}</div>
    </section>
  );
}
