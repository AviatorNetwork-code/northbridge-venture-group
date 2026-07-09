import { type ResearchDocument } from "./document-schema.js";
import { type AdrLinkage, type ResearchMetadata } from "./metadata.js";
export interface ValidationIssue {
    path: string;
    message: string;
}
export interface ValidationResult<T> {
    valid: boolean;
    value?: T;
    issues: ValidationIssue[];
}
export declare function parseResearchMetadata(input: unknown): ResearchMetadata;
export declare function safeParseResearchMetadata(input: unknown): ValidationResult<ResearchMetadata>;
export declare function parseResearchDocument(input: unknown): ResearchDocument;
export declare function parseAdrLinkage(input: unknown): AdrLinkage;
export declare function linkResearchToAdr(metadata: ResearchMetadata, adr: AdrLinkage): ResearchMetadata;
