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

export function zodErrorToIssues(error: ZodError): ValidationIssue[] {
  return error.issues.map((issue) => ({
    path: issue.path.join(".") || "(root)",
    code: issue.code,
    message: issue.message,
  }));
}

export function validateWithSchema<T>(
  schema: ZodType<T>,
  input: unknown,
): ValidationResult<T> {
  const result = schema.safeParse(input);
  if (result.success) {
    return { valid: true, value: result.data, issues: [] };
  }
  return { valid: false, issues: zodErrorToIssues(result.error) };
}

export function assertWithSchema<T>(
  schema: ZodType<T>,
  input: unknown,
  label = "input",
): T {
  try {
    return schema.parse(input);
  } catch (error) {
    if (error instanceof ZodError) {
      const issues = zodErrorToIssues(error);
      const detail = issues.map((i) => `${i.path}: ${i.message}`).join("; ");
      throw new Error(`Invalid ${label} — ${detail}`);
    }
    throw error;
  }
}
