import type { NeoEvent, NeoEventHandler, NeoEventType } from "../types";

type HandlerEntry = {
  type: NeoEventType | "*";
  handler: NeoEventHandler;
};

export class NeoEventBus {
  private handlers: HandlerEntry[] = [];

  subscribe<T extends NeoEventType>(
    type: T | "*",
    handler: NeoEventHandler<T>,
  ): () => void {
    const entry: HandlerEntry = {
      type,
      handler: handler as NeoEventHandler,
    };
    this.handlers.push(entry);
    return () => {
      this.handlers = this.handlers.filter((h) => h !== entry);
    };
  }

  emit<T extends NeoEventType>(event: NeoEvent<T>): void {
    for (const entry of this.handlers) {
      if (entry.type === "*" || entry.type === event.type) {
        entry.handler(event);
      }
    }
  }

  clear(): void {
    this.handlers = [];
  }
}

export function createEventBus(): NeoEventBus {
  return new NeoEventBus();
}
