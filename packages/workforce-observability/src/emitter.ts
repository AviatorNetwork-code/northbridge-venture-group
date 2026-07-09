import type { WorkforceEvent, WorkforceEventType } from "./types/event.js";

export interface WorkforceTelemetryEmitter {
  emit(event: WorkforceEvent): void | Promise<void>;
}

export class InMemoryWorkforceTelemetryEmitter implements WorkforceTelemetryEmitter {
  readonly events: WorkforceEvent[] = [];

  emit(event: WorkforceEvent): void {
    this.events.push(event);
  }

  listByType(eventType: WorkforceEventType): WorkforceEvent[] {
    return this.events.filter((event) => event.eventType === eventType);
  }

  listByCorrelation(correlationId: string): WorkforceEvent[] {
    return this.events.filter((event) => event.correlationId === correlationId);
  }
}

export class NoOpWorkforceTelemetryEmitter implements WorkforceTelemetryEmitter {
  emit(_event: WorkforceEvent): void {
    // intentionally empty
  }
}
