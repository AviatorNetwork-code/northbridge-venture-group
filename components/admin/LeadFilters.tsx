"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  LEAD_CATEGORY_VALUES,
  LEAD_STATUS_LABELS,
  LEAD_STATUS_VALUES,
  RECOMMENDED_SOLUTION_VALUES,
  sanitizeSearchQuery,
} from "@/lib/admin-lead-filters";

export function LeadFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const status = searchParams.get("status") ?? "";
  const leadCategory = searchParams.get("lead_category") ?? "";
  const recommendedSolution = searchParams.get("recommended_solution") ?? "";

  function applyFilters(next: {
    q?: string;
    status?: string;
    lead_category?: string;
    recommended_solution?: string;
  }) {
    const params = new URLSearchParams();
    const values = {
      q: next.q ?? q,
      status: next.status ?? status,
      lead_category: next.lead_category ?? leadCategory,
      recommended_solution: next.recommended_solution ?? recommendedSolution,
    };

    if (values.q.trim()) params.set("q", sanitizeSearchQuery(values.q));
    if (values.status) params.set("status", values.status);
    if (values.lead_category) params.set("lead_category", values.lead_category);
    if (values.recommended_solution) params.set("recommended_solution", values.recommended_solution);

    const query = params.toString();
    router.push(query ? `/admin/digital-leads?${query}` : "/admin/digital-leads");
  }

  function clearFilters() {
    setQ("");
    router.push("/admin/digital-leads");
  }

  return (
    <div className="nb-card p-4 sm:p-6 space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label htmlFor="filter-status" className="nb-label">
            Status
          </label>
          <select
            id="filter-status"
            value={status}
            onChange={(e) => applyFilters({ status: e.target.value })}
            className="nb-input"
          >
            <option value="">All statuses</option>
            {LEAD_STATUS_VALUES.map((value) => (
              <option key={value} value={value}>
                {LEAD_STATUS_LABELS[value]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="filter-category" className="nb-label">
            Lead category
          </label>
          <select
            id="filter-category"
            value={leadCategory}
            onChange={(e) => applyFilters({ lead_category: e.target.value })}
            className="nb-input"
          >
            <option value="">All categories</option>
            {LEAD_CATEGORY_VALUES.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="filter-solution" className="nb-label">
            Recommendation
          </label>
          <select
            id="filter-solution"
            value={recommendedSolution}
            onChange={(e) => applyFilters({ recommended_solution: e.target.value })}
            className="nb-input"
          >
            <option value="">All recommendations</option>
            {RECOMMENDED_SOLUTION_VALUES.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="filter-search" className="nb-label">
            Search
          </label>
          <input
            id="filter-search"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") applyFilters({ q });
            }}
            placeholder="Name, company, email"
            className="nb-input"
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={() => applyFilters({ q })} className="btn-primary text-sm px-4 py-2">
          Apply filters
        </button>
        <button type="button" onClick={clearFilters} className="btn-secondary text-sm px-4 py-2">
          Clear
        </button>
      </div>
    </div>
  );
}
