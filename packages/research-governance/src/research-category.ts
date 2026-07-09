import { z } from "zod";

export const researchCategorySchema = z.enum([
  "architecture",
  "security",
  "orchestration",
  "connectors",
  "observability",
  "mobile",
  "chat_ux",
  "dashboard",
  "external_patterns",
  "governance",
]);

export type ResearchCategory = z.infer<typeof researchCategorySchema>;

export const RESEARCH_CATEGORY_LABELS: Record<ResearchCategory, string> = {
  architecture: "Architecture",
  security: "Security",
  orchestration: "Multi-agent orchestration",
  connectors: "Connectors / MCP",
  observability: "Observability / telemetry",
  mobile: "Mobile / React Native",
  chat_ux: "Chat UX",
  dashboard: "Dashboard / operations",
  external_patterns: "External patterns synthesis",
  governance: "Research governance",
};
