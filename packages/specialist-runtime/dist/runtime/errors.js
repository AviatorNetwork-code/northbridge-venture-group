export class SpecialistRuntimeError extends Error {
    code;
    state;
    detail;
    constructor(code, message, options) {
        super(message, options?.cause ? { cause: options.cause } : undefined);
        this.name = "SpecialistRuntimeError";
        this.code = code;
        this.state = options?.state;
        this.detail = options?.detail;
    }
}
