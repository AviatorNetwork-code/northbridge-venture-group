import { z } from "zod";
export declare const researchCategorySchema: z.ZodEnum<["architecture", "security", "orchestration", "connectors", "observability", "mobile", "chat_ux", "dashboard", "external_patterns", "governance"]>;
export type ResearchCategory = z.infer<typeof researchCategorySchema>;
export declare const RESEARCH_CATEGORY_LABELS: Record<ResearchCategory, string>;
