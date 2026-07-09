import { z } from "zod";
import {
  metricIdSchema,
  organizationIdSchema,
  teamIdSchema,
  teamLeadIdSchema,
  teamReportIdSchema,
} from "./primitives.js";

export const operationalMetricSchema = z
  .object({
    id: metricIdSchema,
    orgId: organizationIdSchema,
    teamId: teamIdSchema.optional(),
    name: z.string().min(1).max(128),
    value: z.number(),
    unit: z.string().min(1).max(32).optional(),
    windowStart: z.string().datetime({ offset: true }).optional(),
    windowEnd: z.string().datetime({ offset: true }).optional(),
    collectedAt: z.string().datetime({ offset: true }),
  })
  .strict();

export type OperationalMetric = z.infer<typeof operationalMetricSchema>;

export const teamReportSchema = z
  .object({
    id: teamReportIdSchema,
    orgId: organizationIdSchema,
    teamId: teamIdSchema,
    teamLeadId: teamLeadIdSchema,
    periodStart: z.string().datetime({ offset: true }),
    periodEnd: z.string().datetime({ offset: true }),
    summary: z.string().min(1).max(8192),
    metrics: z.array(operationalMetricSchema).default([]),
    generatedAt: z.string().datetime({ offset: true }),
  })
  .strict();

export type TeamReport = z.infer<typeof teamReportSchema>;

export function parseOperationalMetric(input: unknown): OperationalMetric {
  return operationalMetricSchema.parse(input);
}

export function parseTeamReport(input: unknown): TeamReport {
  return teamReportSchema.parse(input);
}

export function safeParseTeamReport(input: unknown) {
  return teamReportSchema.safeParse(input);
}
