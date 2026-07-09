export class InMemoryProgressReporter {
    events = [];
    report(event) {
        this.events.push(event);
    }
}
