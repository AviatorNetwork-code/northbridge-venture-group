import { neoEventBus, type NeoEvent } from "@/lib/neo/events";
import {
  createInitialNeoState,
  type NeoPlatformState,
} from "@/lib/neo/state/seed";

type Listener = (state: NeoPlatformState) => void;

class NeoStateStore {
  private state: NeoPlatformState = createInitialNeoState();
  private listeners = new Set<Listener>();
  private version = 0;

  getState(): NeoPlatformState {
    return this.state;
  }

  getVersion(): number {
    return this.version;
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  patch(
    updater: (draft: NeoPlatformState) => void,
    event?: Omit<NeoEvent, "id" | "timestamp">
  ): void {
    const next = structuredClone(this.state);
    updater(next);
    this.state = next;
    this.version += 1;
    this.listeners.forEach((l) => l(this.state));

    if (event) {
      neoEventBus.emit({
        id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        timestamp: new Date().toISOString(),
        ...event,
      });
    }

    neoEventBus.emit({
      id: `snap-${this.version}`,
      type: "state.snapshot",
      timestamp: new Date().toISOString(),
      payload: { version: this.version },
    });
  }

  reset(): void {
    this.state = createInitialNeoState();
    this.version += 1;
    this.listeners.forEach((l) => l(this.state));
  }
}

export const neoStateStore = new NeoStateStore();
