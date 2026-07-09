import { z } from "zod";
import { researchCategorySchema } from "./research-category.js";
import { researchTrustLevelSchema } from "./trust-level.js";

export const adrLinkageSchema = z.object({
  adrId: z.string().min(1).max(64),
  title: z.string().min(1).max(256),
  packageScope: z.string().min(1).max(128).optional(),
  status: z.enum(["proposed", "accepted", "superseded", "deprecated"]).optional(),
  path: z.string().min(1).max(512).optional(),
});

export type AdrLinkage = z.infer<typeof adrLinkageSchema>;

export const researchSourceReferenceSchema = z.object({
  label: z.string().min(1).max(256),
  url: z.string().url().optional(),
  repository: z.string().min(1).max(256).optional(),
  version: z.string().min(1).max(64).optional(),
  reviewedAt: z.string().datetime({ offset: true }).optional(),
});

export type ResearchSourceReference = z.infer<
  typeof researchSourceReferenceSchema
>;

export const researchMetadataSchema = z.object({
  id: z.string().min(1).max(128),
  title: z.string().min(1).max(256),
  version: z.string().min(1).max(32),
  summary: z.string().min(1).max(4000),
  trustLevel: researchTrustLevelSchema,
  category: researchCategorySchema,
  sources: z.array(researchSourceReferenceSchema).min(1),
  relatedAdrs: z.array(adrLinkageSchema).default([]),
  author: z.string().min(1).max(128).optional(),
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
  tags: z.array(z.string().min(1).max(64)).default([]),
});

export type ResearchMetadata = z.infer<typeof researchMetadataSchema>;
