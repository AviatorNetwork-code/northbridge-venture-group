export class InMemoryWorkforceTelemetryEmitter {
    events = [];
    emit(event) {
        this.events.push(event);
    }
    listByType(eventType) {
        return this.events.filter((event) => event.eventType === eventType);
    }
    listByCorrelation(correlationId) {
        return this.events.filter((event) => event.correlationId === correlationId);
    }
}
