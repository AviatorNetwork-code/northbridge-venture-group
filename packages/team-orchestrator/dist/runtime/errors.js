export class TeamOrchestratorError extends Error {
    code;
    state;
    detail;
    constructor(code, message, options) {
        super(message, options?.cause ? { cause: options.cause } : undefined);
        this.name = "TeamOrchestratorError";
        this.code = code;
        this.state = options?.state;
        this.detail = options?.detail;
    }
}
