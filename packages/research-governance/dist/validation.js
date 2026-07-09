import { researchDocumentSchema } from "./document-schema.js";
import { adrLinkageSchema, researchMetadataSchema, } from "./metadata.js";
function toIssues(error) {
    return error.issues.map((issue) => ({
        path: issue.path.join(".") || "(root)",
        message: issue.message,
    }));
}
function assertParsed(label, result) {
    if (result.success)
        return result.data;
    const detail = toIssues(result.error)
        .map((issue) => `${issue.path}: ${issue.message}`)
        .join("; ");
    throw new Error(`Invalid ${label} — ${detail}`);
}
export function parseResearchMetadata(input) {
    return assertParsed("ResearchMetadata", researchMetadataSchema.safeParse(input));
}
export function safeParseResearchMetadata(input) {
    const result = researchMetadataSchema.safeParse(input);
    if (result.success) {
        return { valid: true, value: result.data, issues: [] };
    }
    return { valid: false, issues: toIssues(result.error) };
}
export function parseResearchDocument(input) {
    return assertParsed("ResearchDocument", researchDocumentSchema.safeParse(input));
}
export function parseAdrLinkage(input) {
    return assertParsed("AdrLinkage", adrLinkageSchema.safeParse(input));
}
export function linkResearchToAdr(metadata, adr) {
    const exists = metadata.relatedAdrs.some((entry) => entry.adrId === adr.adrId);
    if (exists)
        return metadata;
    return {
        ...metadata,
        relatedAdrs: [...metadata.relatedAdrs, adr],
    };
}
