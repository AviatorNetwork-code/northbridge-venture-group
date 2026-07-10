export const CUSTOMER_SERVICE_SPECIALIST_IDS = [
  "customer-service-specialist",
  "reception-specialist",
  "appointment-specialist",
  "reminder-specialist",
  "customer-success-specialist",
] as const;

export const CUSTOMER_SERVICE_EMPLOYEE_IDS = [
  "employee-customer-service",
  "employee-reception",
  "employee-appointment",
  "employee-reminder",
  "employee-customer-success",
] as const;

export type CustomerServiceSpecialistId = (typeof CUSTOMER_SERVICE_SPECIALIST_IDS)[number];
