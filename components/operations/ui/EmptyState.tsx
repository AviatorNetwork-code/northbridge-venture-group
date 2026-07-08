export default function EmptyState({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="text-center py-10 px-4 border border-dashed border-white/10">
      <p className="text-sm font-medium text-white">{title}</p>
      {description && (
        <p className="mt-1 text-xs text-silver max-w-sm mx-auto">{description}</p>
      )}
    </div>
  );
}
