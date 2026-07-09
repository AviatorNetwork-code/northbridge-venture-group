import { z } from "zod";
import { researchMetadataSchema } from "./metadata.js";
export const researchDocumentSectionSchema = z.object({
    heading: z.string().min(1).max(256),
    body: z.string().min(1),
});
/**
 * Platform schema for research documents stored under docs/.
 * Frontmatter is validated; markdown body is opaque at platform layer.
 */
export const researchDocumentSchema = z.object({
    metadata: researchMetadataSchema,
    sections: z.array(researchDocumentSectionSchema).default([]),
    dispositionNotes: z.string().max(8000).optional(),
});
export const researchDocumentFrontmatterSchema = researchMetadataSchema;
