import { ZodError } from "zod";
export function zodErrorToIssues(error) {
    return error.issues.map((issue) => ({
        path: issue.path.join(".") || "(root)",
        code: issue.code,
        message: issue.message,
    }));
}
export function validateWithSchema(schema, input) {
    const result = schema.safeParse(input);
    if (result.success) {
        return { valid: true, value: result.data, issues: [] };
    }
    return { valid: false, issues: zodErrorToIssues(result.error) };
}
export function assertWithSchema(schema, input, label = "input") {
    try {
        return schema.parse(input);
    }
    catch (error) {
        if (error instanceof ZodError) {
            const issues = zodErrorToIssues(error);
            const detail = issues.map((i) => `${i.path}: ${i.message}`).join("; ");
            throw new Error(`Invalid ${label} — ${detail}`);
        }
        throw error;
    }
}
