import { MOCK_OUTPUTS } from "@/lib/ndp/domain/customer-service";
import type { CustomerServiceRecommendation } from "../recommendations/engine.js";

export type CustomerServiceDashboardCardId =
  | "open_inquiries"
  | "response_time"
  | "appointments_requested"
  | "reminders_due"
  | "customer_satisfaction"
  | "escalations"
  | "recommendations"
  | "alerts";

export interface CustomerServiceDashboardCard<T = Record<string, unknown>> {
  id: CustomerServiceDashboardCardId;
  title: string;
  status: "healthy" | "warning" | "critical" | "info";
  data: T;
  updatedAt: string;
}

export interface CustomerServiceDashboardModel {
  teamId: string;
  cards: CustomerServiceDashboardCard[];
  generatedAt: string;
}

export interface BuildCustomerServiceDashboardInput {
  teamId: string;
  recommendations?: CustomerServiceRecommendation[];
  now?: string;
}

export function buildCustomerServiceDashboardModel(
  input: BuildCustomerServiceDashboardInput,
): CustomerServiceDashboardModel {
  const now = input.now ?? new Date().toISOString();
  const customerAnswer = MOCK_OUTPUTS["customer.answer"];
  const reception = MOCK_OUTPUTS["reception.triage"];
  const appointment = MOCK_OUTPUTS["appointment.schedule"];
  const reminder = MOCK_OUTPUTS["reminder.prepare"];
  const success = MOCK_OUTPUTS["customer.success.review"];

  const cards: CustomerServiceDashboardCard[] = [
    {
      id: "open_inquiries",
      title: "Open Inquiries",
      status: (customerAnswer.metrics?.openInquiries ?? 0) > 10 ? "warning" : "healthy",
      data: {
        openInquiries: customerAnswer.metrics?.openInquiries ?? 0,
        highPriority: customerAnswer.metrics?.highPriority ?? 0,
        summary: customerAnswer.summary,
      },
      updatedAt: now,
    },
    {
      id: "response_time",
      title: "Response Time",
      status: (customerAnswer.metrics?.avgResponseTimeHours ?? 0) > 4 ? "warning" : "healthy",
      data: {
        avgResponseTimeHours: customerAnswer.metrics?.avgResponseTimeHours,
        summary: customerAnswer.summary,
      },
      updatedAt: now,
    },
    {
      id: "appointments_requested",
      title: "Appointments Requested",
      status: "info",
      data: {
        appointmentsRequested: appointment.metrics?.appointmentsRequested ?? 0,
        slotsAvailable: appointment.metrics?.slotsAvailable,
      },
      updatedAt: now,
    },
    {
      id: "reminders_due",
      title: "Reminders Due",
      status: (reminder.metrics?.remindersDue ?? 0) > 8 ? "warning" : "healthy",
      data: {
        remindersDue: reminder.metrics?.remindersDue ?? 0,
        smsReminders: reminder.metrics?.smsReminders,
        emailReminders: reminder.metrics?.emailReminders,
      },
      updatedAt: now,
    },
    {
      id: "customer_satisfaction",
      title: "Customer Satisfaction",
      status: (success.metrics?.satisfactionScore ?? 5) < 4 ? "warning" : "healthy",
      data: {
        satisfactionScore: success.metrics?.satisfactionScore,
        atRiskAccounts: success.metrics?.atRiskAccounts,
        summary: success.summary,
      },
      updatedAt: now,
    },
    {
      id: "escalations",
      title: "Escalations",
      status: (reception.metrics?.escalations ?? 0) > 0 ? "warning" : "healthy",
      data: {
        escalations: reception.metrics?.escalations ?? 0,
        summary: reception.summary,
      },
      updatedAt: now,
    },
    {
      id: "recommendations",
      title: "Recommendations",
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
      status: reception.summary.includes("escalated") ? "warning" : "healthy",
      data: {
        alerts: reception.evidence.filter((entry) =>
          entry.toLowerCase().includes("escalat") || entry.toLowerCase().includes("priority"),
        ),
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
