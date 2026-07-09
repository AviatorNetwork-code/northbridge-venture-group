import { z } from "zod";
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
export const auditFieldsSchema = z.object({
    createdAt: isoDateTimeSchema,
    updatedAt: isoDateTimeSchema,
});
export const workforceTierSchema = z.enum(["essential", "pro", "elite"]);
export const entityStatusSchema = z.enum([
    "provisioned",
    "active",
    "suspended",
    "deprovisioned",
]);
