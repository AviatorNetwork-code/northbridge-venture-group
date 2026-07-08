export default function SectionHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
      <div>
        <h2 className="text-lg sm:text-xl font-semibold text-white">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-silver max-w-2xl">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
