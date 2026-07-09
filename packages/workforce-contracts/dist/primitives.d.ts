import { z } from "zod";
/** ISO-8601 timestamp string. */
export type IsoDateTime = string;
export declare const isoDateTimeSchema: z.ZodString;
export declare const organizationIdSchema: z.ZodString;
export declare const teamIdSchema: z.ZodString;
export declare const teamLeadIdSchema: z.ZodString;
export declare const specialistIdSchema: z.ZodString;
export declare const managerIdSchema: z.ZodString;
export declare const directorIdSchema: z.ZodString;
export declare const vicePresidentIdSchema: z.ZodString;
export declare const teamProductIdSchema: z.ZodString;
export declare const specialistDefinitionIdSchema: z.ZodString;
export declare const assignmentIdSchema: z.ZodString;
export declare const taskIdSchema: z.ZodString;
export declare const recommendationIdSchema: z.ZodString;
export declare const escalationIdSchema: z.ZodString;
export declare const metricIdSchema: z.ZodString;
export declare const teamReportIdSchema: z.ZodString;
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
export declare const auditFieldsSchema: z.ZodObject<{
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    createdAt: string;
    updatedAt: string;
}, {
    createdAt: string;
    updatedAt: string;
}>;
export type AuditFields = z.infer<typeof auditFieldsSchema>;
export declare const workforceTierSchema: z.ZodEnum<["essential", "pro", "elite"]>;
export type WorkforceTier = z.infer<typeof workforceTierSchema>;
export declare const entityStatusSchema: z.ZodEnum<["provisioned", "active", "suspended", "deprovisioned"]>;
export type EntityStatus = z.infer<typeof entityStatusSchema>;
