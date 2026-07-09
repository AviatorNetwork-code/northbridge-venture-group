export class InMemoryTeamProgressReporter {
    events = [];
    report(event) {
        this.events.push(event);
    }
}
