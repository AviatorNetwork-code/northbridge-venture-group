import type { ReportSourceInput, FounderReport } from "../types/report.js";
import { classifyPriority } from "./priorityClassifier.js";

export function generateDailyFounderBrief(sources: ReportSourceInput[]): FounderReport {
  const priority = classifyPriority("daily_founder_brief", sources);
  const whatChanged = sources.flatMap((s) => s.highlights).slice(0, 8);
  const recommendations = sources.flatMap((s) => s.recommendations ?? []).slice(0, 3);
  const pending = sources.flatMap((s) => s.pendingDecisions ?? []).slice(0, 5);
  const risks = sources.flatMap((s) => s.risks ?? []).slice(0, 5);
  const catInsights = sources
    .filter((s) => s.sourceId === "cat_website_analytics" || s.sourceId === "customer_experience_intelligence")
    .flatMap((s) => s.highlights)
    .slice(0, 4);
  const engineering = sources
    .filter((s) =>
      ["aviator_network_neo", "quadrix_neo", "northbridge_website_neo", "institutional_memory"].includes(
        s.sourceId,
      ),
    )
    .flatMap((s) => s.highlights)
    .slice(0, 4);

  const topRec = recommendations[0] ?? "Review latest executive intelligence recommendations.";

  return {
    reportId: `daily-${Date.now()}`,
    reportType: "daily_founder_brief",
    priority,
    title: "Daily Founder Brief",
    generatedAt: Date.now(),
    sections: [
      { heading: "What changed today", items: whatChanged.length ? whatChanged : ["No major changes reported."] },
      { heading: "Highest-value recommendation", items: [topRec] },
      { heading: "Pending decisions", items: pending.length ? pending : ["No pending Founder decisions."] },
      {
        heading: "Product health",
        items: sources
          .filter((s) => s.productId)
          .map((s) => `${s.productId}: ${s.summary}`)
          .slice(0, 4),
      },
      { heading: "CAT / customer insights", items: catInsights.length ? catInsights : ["No new CAT insights."] },
      { heading: "Engineering progress", items: engineering.length ? engineering : ["No engineering updates."] },
      { heading: "Risks", items: risks.length ? risks : ["No critical risks flagged."] },
    ],
    nextSuggestedAction: pending[0]
      ? `Review pending decision: ${pending[0]}`
      : "Review highest-value recommendation when convenient.",
    governanceNotice:
      "Read-only NEO report. No tasks executed. No customer private data. Founder approval required for all actions.",
    sources: sources.map((s) => s.sourceId),
  };
}

export function generateWeeklyNorthbridgeReport(sources: ReportSourceInput[]): FounderReport {
  const priority = classifyPriority("weekly_northbridge_report", sources);
  const highlights = sources.flatMap((s) => s.highlights).slice(0, 12);
  const recommendations = sources.flatMap((s) => s.recommendations ?? []).slice(0, 6);

  return {
    reportId: `weekly-${Date.now()}`,
    reportType: "weekly_northbridge_report",
    priority,
    title: "Weekly Northbridge Report",
    generatedAt: Date.now(),
    sections: [
      { heading: "Week in review", items: highlights.length ? highlights : ["Quiet week across connected sources."] },
      { heading: "Strategic recommendations", items: recommendations.length ? recommendations : ["No new recommendations."] },
      {
        heading: "Products covered",
        items: [...new Set(sources.map((s) => s.productId ?? s.sourceId))],
      },
    ],
    nextSuggestedAction: "Schedule Founder review of top weekly recommendations.",
    governanceNotice:
      "Read-only NEO report. No tasks executed. Founder approval required for all actions.",
    sources: sources.map((s) => s.sourceId),
  };
}
