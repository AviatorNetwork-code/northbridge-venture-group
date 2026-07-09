import type { WorkforceTelemetryEmitter } from "@northbridge/workforce-observability";
import type { ExecutionHooks } from "../types/policy.js";
export interface ObservabilityExecutionHooksOptions {
    emitter: WorkforceTelemetryEmitter;
    correlationId: string;
    now?: () => string;
}
export declare function createObservabilityExecutionHooks(options: ObservabilityExecutionHooksOptions): ExecutionHooks;
