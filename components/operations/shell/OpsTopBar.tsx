export default function OpsTopBar({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="border-b border-white/10 bg-black/80 backdrop-blur-sm px-4 sm:px-6 py-4 lg:py-5">
      <p className="text-xs uppercase tracking-widest text-red mb-1">
        Command Center
      </p>
      <h1 className="text-xl sm:text-2xl font-semibold text-white">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-silver">{subtitle}</p>}
    </header>
  );
}
