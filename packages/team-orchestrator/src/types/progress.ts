export type TeamProgressPhase =
  | "ownership"
  | "planning"
  | "delegation"
  | "execution"
  | "collection"
  | "conflict"
  | "synthesis"
  | "report";

export interface TeamProgressEvent {
  sessionId: string;
  requestId: string;
  teamId: string;
  phase: TeamProgressPhase;
  message: string;
  percent?: number;
  timestamp: string;
}

export interface TeamProgressReporter {
  report(event: TeamProgressEvent): void | Promise<void>;
}

export class InMemoryTeamProgressReporter implements TeamProgressReporter {
  readonly events: TeamProgressEvent[] = [];

  report(event: TeamProgressEvent): void {
    this.events.push(event);
  }
}
