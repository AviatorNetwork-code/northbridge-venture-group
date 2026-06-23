import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | Northbridge",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-t border-northbridge-red/20">
      <div className="bg-northbridge-charcoal/50 border-b border-white/10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-northbridge-red">
            Internal — Northbridge Digital
          </p>
        </div>
      </div>
      {children}
    </div>
  );
}
