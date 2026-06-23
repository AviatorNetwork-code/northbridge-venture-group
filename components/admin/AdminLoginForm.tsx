"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/admin/digital-leads";
  const configError = searchParams.get("error") === "not_configured";

  const [token, setToken] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Login failed.");
        setSubmitting(false);
        return;
      }

      router.push(nextPath);
      router.refresh();
    } catch {
      setError("Login failed.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="nb-card max-w-md mx-auto p-8 space-y-6">
      <div>
        <p className="nb-eyebrow">Internal</p>
        <h1 className="mt-2 text-2xl font-bold text-white">Admin access</h1>
        <p className="mt-2 text-sm text-white/60">
          Northbridge Digital lead review. Not for public use.
        </p>
      </div>

      {configError && (
        <p className="text-sm text-northbridge-red" role="alert">
          Admin access is not configured. Set <code className="text-white/80">ADMIN_ACCESS_TOKEN</code>{" "}
          in the environment.
        </p>
      )}

      <div>
        <label htmlFor="admin-token" className="nb-label">
          Access token
        </label>
        <input
          id="admin-token"
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="nb-input"
          autoComplete="current-password"
          required
        />
      </div>

      {error && (
        <p className="text-sm text-northbridge-red" role="alert">
          {error}
        </p>
      )}

      <button type="submit" disabled={submitting} className="btn-primary w-full">
        {submitting ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
