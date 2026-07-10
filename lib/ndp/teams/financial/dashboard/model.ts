import { MOCK_OUTPUTS } from "@/lib/ndp/domain/financial";
import type { FinancialRecommendation } from "../recommendations/engine.js";

export type FinancialDashboardCardId =
  | "revenue_snapshot"
  | "outstanding_invoices"
  | "accounts_receivable"
  | "cash_flow_signals"
  | "billing_activity"
  | "payment_followups"
  | "financial_recommendations"
  | "alerts";

export interface FinancialDashboardCard<T = Record<string, unknown>> {
  id: FinancialDashboardCardId;
  title: string;
  status: "healthy" | "warning" | "critical" | "info";
  data: T;
  updatedAt: string;
}

export interface FinancialDashboardModel {
  teamId: string;
  cards: FinancialDashboardCard[];
  generatedAt: string;
}

export interface BuildFinancialDashboardInput {
  teamId: string;
  recommendations?: FinancialRecommendation[];
  now?: string;
}

export function buildFinancialDashboardModel(input: BuildFinancialDashboardInput): FinancialDashboardModel {
  const now = input.now ?? new Date().toISOString();
  const financeAnalyze = MOCK_OUTPUTS["finance.analyze"];
  const billing = MOCK_OUTPUTS["billing.review"];
  const receivables = MOCK_OUTPUTS["receivables.review"];
  const paymentFollowup = MOCK_OUTPUTS["payment.followup"];
  const report = MOCK_OUTPUTS["financial.report"];

  const cards: FinancialDashboardCard[] = [
    {
      id: "revenue_snapshot",
      title: "Revenue Snapshot",
      status: "healthy",
      data: {
        revenueMtd: financeAnalyze.metrics?.revenueMtd,
        revenueGrowth: financeAnalyze.metrics?.revenueGrowth,
        grossMargin: financeAnalyze.metrics?.grossMargin,
        summary: financeAnalyze.summary,
      },
      updatedAt: now,
    },
    {
      id: "outstanding_invoices",
      title: "Outstanding Invoices",
      status: (billing.metrics?.pendingApproval ?? 0) > 2 ? "warning" : "info",
      data: {
        invoicesIssued: billing.metrics?.invoicesIssued,
        pendingApproval: billing.metrics?.pendingApproval,
        avgInvoiceValue: billing.metrics?.avgInvoiceValue,
      },
      updatedAt: now,
    },
    {
      id: "accounts_receivable",
      title: "Accounts Receivable",
      status: (receivables.metrics?.pastDue30 ?? 0) > 3 ? "warning" : "healthy",
      data: {
        arOutstanding: receivables.metrics?.arOutstanding,
        openAccounts: receivables.metrics?.openAccounts,
        pastDue30: receivables.metrics?.pastDue30,
        summary: receivables.summary,
      },
      updatedAt: now,
    },
    {
      id: "cash_flow_signals",
      title: "Cash Flow Signals",
      status: report.summary.includes("positive") ? "healthy" : "info",
      data: {
        cashFlowPositive: report.metrics?.cashFlowPositive,
        summary: report.summary,
      },
      updatedAt: now,
    },
    {
      id: "billing_activity",
      title: "Billing Activity",
      status: "info",
      data: {
        invoicesIssued: billing.metrics?.invoicesIssued,
        draftsPrepared: MOCK_OUTPUTS["invoice.prepare"].metrics?.draftsPrepared,
        summary: billing.summary,
      },
      updatedAt: now,
    },
    {
      id: "payment_followups",
      title: "Payment Follow-ups",
      status: (paymentFollowup.metrics?.followUpsDue ?? 0) > 5 ? "warning" : "healthy",
      data: {
        followUpsDue: paymentFollowup.metrics?.followUpsDue,
        escalationCandidates: paymentFollowup.metrics?.escalationCandidates,
      },
      updatedAt: now,
    },
    {
      id: "financial_recommendations",
      title: "Financial Recommendations",
      status: "info",
      data: {
        items: (input.recommendations ?? []).map((entry) => ({
          id: entry.id,
          category: entry.category,
          summary: entry.summary,
          priority: entry.priority,
        })),
      },
      updatedAt: now,
    },
    {
      id: "alerts",
      title: "Alerts",
      status: receivables.summary.includes("past") ? "warning" : "healthy",
      data: {
        alerts: [
          ...receivables.evidence.filter((entry) => entry.toLowerCase().includes("overdue")),
          ...financeAnalyze.evidence.filter((entry) => entry.toLowerCase().includes("flagged")),
        ],
      },
      updatedAt: now,
    },
  ];

  return {
    teamId: input.teamId,
    cards,
    generatedAt: now,
  };
}
