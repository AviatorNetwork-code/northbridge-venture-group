import type { FounderReport, ReportSourceInput } from "../types/report.js";

export type CriticalAlertKind =
  | "broken_build"
  | "failed_deployment"
  | "customer_friction"
  | "missing_conversion_path"
  | "ai_cost_spike"
  | "security_governance"
  | "blocked_mission"
  | "general";

const ALERT_KIND_PATTERNS: Array<{ kind: CriticalAlertKind; patterns: RegExp[] }> = [
  { kind: "broken_build", patterns: [/broken build|build failed/i] },
  { kind: "failed_deployment", patterns: [/failed deployment|deploy failed/i] },
  { kind: "customer_friction", patterns: [/customer friction|high-impact friction/i] },
  { kind: "missing_conversion_path", patterns: [/missing conversion|no primary cta/i] },
  { kind: "ai_cost_spike", patterns: [/ai cost spike|cost spike/i] },
  { kind: "security_governance", patterns: [/security|governance concern/i] },
  { kind: "blocked_mission", patterns: [/blocked.*mission|blocked high-priority/i] },
];

export function detectCriticalAlertKind(message: string): CriticalAlertKind {
  for (const entry of ALERT_KIND_PATTERNS) {
    if (entry.patterns.some((p) => p.test(message))) return entry.kind;
  }
  return "general";
}

export function generateCriticalAlert(
  message: string,
  sources: ReportSourceInput[] = [],
  productId?: string,
): FounderReport {
  const kind = detectCriticalAlertKind(message);

  return {
    reportId: `critical-${Date.now()}`,
    reportType: "critical_alert",
    priority: "critical",
    title: `Critical Alert: ${formatKindTitle(kind)}`,
    generatedAt: Date.now(),
    sections: [
      { heading: "Alert", items: [message] },
      {
        heading: "Context",
        items: sources.length
          ? sources.map((s) => `${s.sourceId}: ${s.summary}`)
          : ["Manual critical alert — verify in connected repositories."],
      },
      {
        heading: "Suggested Founder action",
        items: [suggestedActionForKind(kind)],
      },
    ],
    nextSuggestedAction: suggestedActionForKind(kind),
    governanceNotice:
      "Critical alert — read-only report. NEO did not execute fixes. Founder approval required before any action.",
    sources: sources.map((s) => s.sourceId),
  };
}

function formatKindTitle(kind: CriticalAlertKind): string {
  return kind.replace(/_/g, " ");
}

function suggestedActionForKind(kind: CriticalAlertKind): string {
  switch (kind) {
    case "broken_build":
      return "Review build logs and assign engineering triage — do not auto-merge fixes.";
    case "failed_deployment":
      return "Verify deployment status and rollback plan — Founder approval before redeploy.";
    case "customer_friction":
      return "Review Customer Experience Intelligence report and prioritize UX fix recommendation.";
    case "missing_conversion_path":
      return "Review Visual Product Review findings for affected product.";
    case "ai_cost_spike":
      return "Review AI usage metrics and throttle non-essential workloads.";
    case "security_governance":
      return "Review governance report immediately — no automated remediation.";
    case "blocked_mission":
      return "Unblock or reprioritize mission — Founder decision required.";
    default:
      return "Review alert context and approve next steps manually.";
  }
}

export function generatePendingDecisionsReport(sources: ReportSourceInput[]): FounderReport {
  const pending = sources.flatMap((s) => s.pendingDecisions ?? []);

  return {
    reportId: `pending-${Date.now()}`,
    reportType: "pending_founder_decisions",
    priority: pending.length > 0 ? "high" : "normal",
    title: "Pending Founder Decisions",
    generatedAt: Date.now(),
    sections: [
      {
        heading: "Decisions awaiting approval",
        items: pending.length ? pending : ["No pending decisions at this time."],
      },
    ],
    nextSuggestedAction: pending[0] ?? "No action required.",
    governanceNotice: "Read-only decision queue — NEO cannot approve on Founder's behalf.",
    sources: sources.map((s) => s.sourceId),
  };
}
