export type ConnectorErrorCode = "capability_not_found" | "connector_not_found" | "connector_disabled" | "permission_denied" | "execution_failed" | "configuration_missing";
export declare class ConnectorError extends Error {
    readonly code: ConnectorErrorCode;
    readonly detail?: Record<string, unknown>;
    constructor(code: ConnectorErrorCode, message: string, detail?: Record<string, unknown>);
}
