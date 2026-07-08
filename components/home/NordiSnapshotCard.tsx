"use client";

type NordiSnapshotCardProps = {
  title: string;
  business: string;
  employees: string;
  confidence: string;
};

export default function NordiSnapshotCard({
  title,
  business,
  employees,
  confidence,
}: NordiSnapshotCardProps) {
  return (
    <div className="animate-nordi-card rounded-xl border border-white/10 bg-black/30 p-3">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-red">{title}</p>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <div>
          <dt className="text-[11px] uppercase tracking-wider text-stone">Business</dt>
          <dd className="mt-0.5 font-medium text-white">{business}</dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-wider text-stone">Employees</dt>
          <dd className="mt-0.5 font-medium text-white">{employees}</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-[11px] uppercase tracking-wider text-stone">Confidence</dt>
          <dd className="mt-0.5 font-medium text-white">{confidence}</dd>
        </div>
      </dl>
    </div>
  );
}
