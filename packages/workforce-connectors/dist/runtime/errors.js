export class ConnectorError extends Error {
    code;
    detail;
    constructor(code, message, detail) {
        super(message);
        this.name = "ConnectorError";
        this.code = code;
        this.detail = detail;
    }
}
