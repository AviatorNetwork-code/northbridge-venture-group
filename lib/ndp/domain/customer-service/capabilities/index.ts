import { getExecutionCapability } from "@/lib/ndp/connectors";
import type { CustomerServiceSpecialistId } from "../constants.js";

export const CUSTOMER_SERVICE_EXECUTION_CAPABILITY_IDS = [
  "customer.answer",
  "reception.triage",
  "appointment.schedule",
  "appointment.reschedule",
  "reminder.prepare",
  "customer.success.review",
] as const;

export const CUSTOMER_SERVICE_EXECUTION_CAPABILITIES =
  CUSTOMER_SERVICE_EXECUTION_CAPABILITY_IDS.map((id) => getExecutionCapability(id)!);

export const CUSTOMER_SERVICE_CAPABILITY_ID_SET = new Set(
  CUSTOMER_SERVICE_EXECUTION_CAPABILITY_IDS,
);

export const SPECIALIST_PRIMARY_CAPABILITY: Record<CustomerServiceSpecialistId, string> = {
  "customer-service-specialist": "customer.answer",
  "reception-specialist": "reception.triage",
  "appointment-specialist": "appointment.schedule",
  "reminder-specialist": "reminder.prepare",
  "customer-success-specialist": "customer.success.review",
};

export function resolveCustomerServiceCapabilityForSpecialist(specialistId: string): string {
  return (
    SPECIALIST_PRIMARY_CAPABILITY[specialistId as CustomerServiceSpecialistId] ??
    "customer.answer"
  );
}
