import type { WorkforceEvent, WorkforceEventType } from "./types/event.js";
export interface WorkforceTelemetryEmitter {
    emit(event: WorkforceEvent): void | Promise<void>;
}
export declare class InMemoryWorkforceTelemetryEmitter implements WorkforceTelemetryEmitter {
    readonly events: WorkforceEvent[];
    emit(event: WorkforceEvent): void;
    listByType(eventType: WorkforceEventType): WorkforceEvent[];
    listByCorrelation(correlationId: string): WorkforceEvent[];
}
