export class WorkforceRouterError extends Error {
    code;
    detail;
    constructor(code, message, options) {
        super(message, options?.cause ? { cause: options.cause } : undefined);
        this.name = "WorkforceRouterError";
        this.code = code;
        this.detail = options?.detail;
    }
}
