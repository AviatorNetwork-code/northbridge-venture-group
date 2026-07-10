import type {
  CrossTeamDependency,
  CrossTeamOpportunity,
  CrossTeamSignal,
  NormalizedTeamReport,
  RecommendationConflict,
} from "./types.js";

const SPEND_INCREASE_CATEGORIES = new Set([
  "budget_reallocation",
  "campaign_optimization",
  "content_opportunity",
  "posting_frequency",
  "seasonal_campaign",
]);

const COST_REDUCTION_CATEGORIES = new Set([
  "expense_control",
  "reduce_activity",
  "cash_flow_management",
]);

export function detectCrossTeamSignals(
  reports: NormalizedTeamReport[],
): CrossTeamSignal[] {
  const signals: CrossTeamSignal[] = [];
  const byTeam = new Map(reports.map((entry) => [entry.teamId, entry]));

  const marketing = byTeam.get("team-marketing");
  const sales = byTeam.get("team-sales");
  const customerService = byTeam.get("team-customer-service");
  const financial = byTeam.get("team-financial");

  if (marketing && sales) {
    const marketingLeadSignal = marketing.operationalSummary.toLowerCase().includes("lead");
    const salesCapacitySignal =
      sales.pendingWork.length >= 2 ||
      sales.operationalSummary.toLowerCase().includes("bottleneck") ||
      sales.operationalSummary.toLowerCase().includes("follow-up");

    if (marketingLeadSignal && salesCapacitySignal) {
      signals.push({
        id: "signal-leads-exceed-sales",
        type: "lead_volume_exceeds_sales_capacity",
        severity: "warning",
        summary:
          "Marketing may be generating more demand than Sales can process with current follow-up capacity.",
        involvedTeamIds: ["team-marketing", "team-sales"],
        evidence: [marketing.operationalSummary, sales.operationalSummary],
        requiresCustomerReview: true,
      });
    }
  }

  if (sales && customerService) {
    const salesMomentum =
      sales.operationalSummary.toLowerCase().includes("convert") ||
      sales.operationalSummary.toLowerCase().includes("pipeline");
    const serviceLoad =
      customerService.pendingWork.length >= 2 ||
      customerService.operationalSummary.toLowerCase().includes("inquir");

    if (salesMomentum && serviceLoad) {
      signals.push({
        id: "signal-sales-outpaces-service",
        type: "sales_outpaces_customer_service",
        severity: "warning",
        summary:
          "Sales momentum may be outpacing Customer Service onboarding and inquiry capacity.",
        involvedTeamIds: ["team-sales", "team-customer-service"],
        evidence: [sales.operationalSummary, customerService.operationalSummary],
        requiresCustomerReview: true,
      });
    }
  }

  if (customerService && financial) {
    const serviceDemand =
      customerService.operationalSummary.toLowerCase().includes("inquir") ||
      customerService.pendingWork.length > 0;
    const paymentDelay =
      financial.operationalSummary.toLowerCase().includes("overdue") ||
      financial.operationalSummary.toLowerCase().includes("receivable") ||
      financial.pendingWork.length > 0;

    if (serviceDemand && paymentDelay) {
      signals.push({
        id: "signal-service-vs-payments",
        type: "service_demand_with_payment_delays",
        severity: "warning",
        summary:
          "Customer Service demand is rising while Financial reports delayed or overdue payments.",
        involvedTeamIds: ["team-customer-service", "team-financial"],
        evidence: [customerService.operationalSummary, financial.operationalSummary],
        requiresCustomerReview: true,
      });
    }
  }

  if (marketing && financial) {
    const marketingSpend = marketing.recommendations.some((entry) =>
      SPEND_INCREASE_CATEGORIES.has(entry.category),
    );
    const financialReduce = financial.recommendations.some((entry) =>
      COST_REDUCTION_CATEGORIES.has(entry.category),
    );

    if (marketingSpend && financialReduce) {
      signals.push({
        id: "signal-spend-vs-cost",
        type: "spend_increase_vs_cost_reduction",
        severity: "critical",
        summary:
          "Marketing recommends higher activity or spend while Financial recommends cost reduction.",
        involvedTeamIds: ["team-marketing", "team-financial"],
        evidence: [
          ...marketing.recommendations.map((entry) => entry.summary),
          ...financial.recommendations.map((entry) => entry.summary),
        ],
        requiresCustomerReview: true,
      });
    }
  }

  const missingContextTeams = reports.filter(
    (entry) => !entry.organizationContextRef || !entry.operationsContextVersion,
  );
  if (missingContextTeams.length >= 2) {
    signals.push({
      id: "signal-missing-org-facts",
      type: "missing_shared_organizational_fact",
      severity: "info",
      summary:
        "Multiple teams lack complete Operations Intelligence context references.",
      involvedTeamIds: missingContextTeams.map((entry) => entry.teamId),
      evidence: missingContextTeams.map(
        (entry) => `${entry.teamId}: missing organization context reference`,
      ),
      requiresCustomerReview: true,
    });
  }

  return signals;
}

export function detectRecommendationConflicts(
  reports: NormalizedTeamReport[],
): RecommendationConflict[] {
  const conflicts: RecommendationConflict[] = [];
  const all = reports.flatMap((report) => report.recommendations);

  const spendRecs = all.filter((entry) => SPEND_INCREASE_CATEGORIES.has(entry.category));
  const reduceRecs = all.filter((entry) => COST_REDUCTION_CATEGORIES.has(entry.category));

  if (spendRecs.length > 0 && reduceRecs.length > 0) {
    conflicts.push({
      id: "conflict-spend-vs-reduce",
      summary:
        "Conflicting recommendations detected between spend-increase and cost-reduction guidance.",
      involvedTeamIds: [
        ...new Set([
          ...spendRecs.map((entry) => entry.sourceTeamId),
          ...reduceRecs.map((entry) => entry.sourceTeamId),
        ]),
      ],
      recommendationIds: [...spendRecs, ...reduceRecs].map((entry) => entry.id),
      evidence: [...spendRecs, ...reduceRecs].map((entry) => entry.summary),
      requiresCustomerReview: true,
    });
  }

  const growthRecs = all.filter((entry) =>
    entry.summary.toLowerCase().includes("volume") ||
    entry.summary.toLowerCase().includes("more leads") ||
    entry.category.includes("campaign"),
  );
  const waitRecs = all.filter((entry) => entry.category === "wait" || entry.category === "reduce_activity");

  if (growthRecs.length > 0 && waitRecs.length > 0) {
    conflicts.push({
      id: "conflict-growth-vs-wait",
      summary: "Some teams recommend increasing activity while others recommend pausing or waiting.",
      involvedTeamIds: [
        ...new Set([
          ...growthRecs.map((entry) => entry.sourceTeamId),
          ...waitRecs.map((entry) => entry.sourceTeamId),
        ]),
      ],
      recommendationIds: [...growthRecs, ...waitRecs].map((entry) => entry.id),
      evidence: [...growthRecs, ...waitRecs].map((entry) => entry.summary),
      requiresCustomerReview: true,
    });
  }

  return conflicts;
}

export function detectCrossTeamDependencies(
  reports: NormalizedTeamReport[],
): CrossTeamDependency[] {
  const dependencies: CrossTeamDependency[] = [];

  const marketing = reports.find((entry) => entry.teamId === "team-marketing");
  const sales = reports.find((entry) => entry.teamId === "team-sales");

  if (marketing && sales) {
    dependencies.push({
      id: "dep-marketing-to-sales",
      summary: "Sales pipeline depends on Marketing lead generation quality and volume.",
      fromTeamId: "team-marketing",
      toTeamId: "team-sales",
      evidence: [marketing.operationalSummary, sales.operationalSummary],
    });
  }

  const customerService = reports.find((entry) => entry.teamId === "team-customer-service");
  if (sales && customerService) {
    dependencies.push({
      id: "dep-sales-to-service",
      summary: "Customer Service workload depends on Sales conversion and onboarding volume.",
      fromTeamId: "team-sales",
      toTeamId: "team-customer-service",
      evidence: [sales.operationalSummary, customerService.operationalSummary],
    });
  }

  const financial = reports.find((entry) => entry.teamId === "team-financial");
  if (customerService && financial) {
    dependencies.push({
      id: "dep-service-to-financial",
      summary: "Financial receivables health depends on Customer Service satisfaction and billing clarity.",
      fromTeamId: "team-customer-service",
      toTeamId: "team-financial",
      evidence: [customerService.operationalSummary, financial.operationalSummary],
    });
  }

  return dependencies;
}

export function detectCrossTeamOpportunities(
  reports: NormalizedTeamReport[],
): CrossTeamOpportunity[] {
  const opportunities: CrossTeamOpportunity[] = [];

  if (reports.length >= 2) {
    const aligned = reports.filter((entry) =>
      entry.recommendations.some((rec) => rec.category === "strategy_change"),
    );
    if (aligned.length >= 2) {
      opportunities.push({
        id: "opp-aligned-strategy-review",
        summary:
          "Multiple teams suggest coordinated strategy review — opportunity for unified customer decision.",
        involvedTeamIds: aligned.map((entry) => entry.teamId),
        evidence: aligned.flatMap((entry) =>
          entry.recommendations.map((rec) => rec.summary),
        ),
      });
    }
  }

  return opportunities;
}

export function mapSignalsToIncompatibleActions(
  signals: CrossTeamSignal[],
): CrossTeamSignal[] {
  return signals
    .filter((entry) => entry.type === "spend_increase_vs_cost_reduction")
    .map((entry) => ({
      ...entry,
      id: `${entry.id}-incompatible`,
      type: "incompatible_team_actions" as const,
      summary: "Teams recommend incompatible actions that require customer review.",
    }));
}
