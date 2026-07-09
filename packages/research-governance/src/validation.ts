import { ZodError } from "zod";
import { researchDocumentSchema, type ResearchDocument } from "./document-schema.js";
import {
  adrLinkageSchema,
  researchMetadataSchema,
  type AdrLinkage,
  type ResearchMetadata,
} from "./metadata.js";

export interface ValidationIssue {
  path: string;
  message: string;
}

export interface ValidationResult<T> {
  valid: boolean;
  value?: T;
  issues: ValidationIssue[];
}

function toIssues(error: ZodError): ValidationIssue[] {
  return error.issues.map((issue) => ({
    path: issue.path.join(".") || "(root)",
    message: issue.message,
  }));
}

function assertParsed<T>(
  label: string,
  result: { success: true; data: T } | { success: false; error: ZodError },
): T {
  if (result.success) return result.data;
  const detail = toIssues(result.error)
    .map((issue) => `${issue.path}: ${issue.message}`)
    .join("; ");
  throw new Error(`Invalid ${label} — ${detail}`);
}

export function parseResearchMetadata(input: unknown): ResearchMetadata {
  return assertParsed("ResearchMetadata", researchMetadataSchema.safeParse(input));
}

export function safeParseResearchMetadata(
  input: unknown,
): ValidationResult<ResearchMetadata> {
  const result = researchMetadataSchema.safeParse(input);
  if (result.success) {
    return { valid: true, value: result.data, issues: [] };
  }
  return { valid: false, issues: toIssues(result.error) };
}

export function parseResearchDocument(input: unknown): ResearchDocument {
  return assertParsed("ResearchDocument", researchDocumentSchema.safeParse(input));
}

export function parseAdrLinkage(input: unknown): AdrLinkage {
  return assertParsed("AdrLinkage", adrLinkageSchema.safeParse(input));
}

export function linkResearchToAdr(
  metadata: ResearchMetadata,
  adr: AdrLinkage,
): ResearchMetadata {
  const exists = metadata.relatedAdrs.some((entry) => entry.adrId === adr.adrId);
  if (exists) return metadata;
  return {
    ...metadata,
    relatedAdrs: [...metadata.relatedAdrs, adr],
  };
}
