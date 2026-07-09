import { ZodError, type ZodType } from "zod";
export interface ValidationIssue {
    path: string;
    code: string;
    message: string;
}
export interface ValidationResult<T> {
    valid: boolean;
    value?: T;
    issues: ValidationIssue[];
}
export declare function zodErrorToIssues(error: ZodError): ValidationIssue[];
export declare function validateWithSchema<T>(schema: ZodType<T>, input: unknown): ValidationResult<T>;
export declare function assertWithSchema<T>(schema: ZodType<T>, input: unknown, label?: string): T;
