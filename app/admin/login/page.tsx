import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export const metadata: Metadata = {
  title: "Admin Login | Northbridge",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="nb-page">
      <Suspense fallback={<div className="nb-card max-w-md mx-auto p-8">Loading…</div>}>
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}
