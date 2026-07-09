import { z } from "zod";

/** ISO-8601 timestamp string. */
export type IsoDateTime = string;

export const isoDateTimeSchema = z
  .string()
  .datetime({ offset: true, message: "Must be an ISO-8601 datetime string" });

export const organizationIdSchema = z.string().min(1).max(128);
export const teamIdSchema = z.string().min(1).max(128);
export const teamLeadIdSchema = z.string().min(1).max(128);
export const specialistIdSchema = z.string().min(1).max(128);
export const managerIdSchema = z.string().min(1).max(128);
export const directorIdSchema = z.string().min(1).max(128);
export const vicePresidentIdSchema = z.string().min(1).max(128);
export const teamProductIdSchema = z.string().min(1).max(128);
export const specialistDefinitionIdSchema = z.string().min(1).max(128);
export const assignmentIdSchema = z.string().min(1).max(128);
export const taskIdSchema = z.string().min(1).max(128);
export const recommendationIdSchema = z.string().min(1).max(128);
export const escalationIdSchema = z.string().min(1).max(128);
export const metricIdSchema = z.string().min(1).max(128);
export const teamReportIdSchema = z.string().min(1).max(128);

export type OrganizationId = z.infer<typeof organizationIdSchema>;
export type TeamId = z.infer<typeof teamIdSchema>;
export type TeamLeadId = z.infer<typeof teamLeadIdSchema>;
export type SpecialistId = z.infer<typeof specialistIdSchema>;
export type ManagerId = z.infer<typeof managerIdSchema>;
export type DirectorId = z.infer<typeof directorIdSchema>;
export type VicePresidentId = z.infer<typeof vicePresidentIdSchema>;
export type TeamProductId = z.infer<typeof teamProductIdSchema>;
export type SpecialistDefinitionId = z.infer<typeof specialistDefinitionIdSchema>;
export type AssignmentId = z.infer<typeof assignmentIdSchema>;
export type TaskId = z.infer<typeof taskIdSchema>;
export type RecommendationId = z.infer<typeof recommendationIdSchema>;
export type EscalationId = z.infer<typeof escalationIdSchema>;
export type MetricId = z.infer<typeof metricIdSchema>;
export type TeamReportId = z.infer<typeof teamReportIdSchema>;

export const auditFieldsSchema = z.object({
  createdAt: isoDateTimeSchema,
  updatedAt: isoDateTimeSchema,
});

export type AuditFields = z.infer<typeof auditFieldsSchema>;

export const workforceTierSchema = z.enum(["essential", "pro", "elite"]);

export type WorkforceTier = z.infer<typeof workforceTierSchema>;

export const entityStatusSchema = z.enum([
  "provisioned",
  "active",
  "suspended",
  "deprovisioned",
]);

export type EntityStatus = z.infer<typeof entityStatusSchema>;
