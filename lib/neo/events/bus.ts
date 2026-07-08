import type { OpsNotification } from "@/lib/neo/types";

export type NeoEventType =
  | "workforce.status_changed"
  | "workforce.assignment_changed"
  | "workflow.updated"
  | "workflow.event"
  | "connector.sync"
  | "connector.status_changed"
  | "conversation.received"
  | "conversation.updated"
  | "activity.new"
  | "kpi.updated"
  | "health.updated"
  | "onboarding.progress"
  | "notification"
  | "state.snapshot";

export interface NeoEvent<T = unknown> {
  id: string;
  type: NeoEventType;
  timestamp: string;
  payload: T;
  message?: string;
  notification?: OpsNotification;
}

export type NeoEventHandler = (event: NeoEvent) => void;

/** Transport-agnostic event bus — swap emitter for WebSocket/SSE later. */
export class NeoEventBus {
  private handlers = new Set<NeoEventHandler>();

  subscribe(handler: NeoEventHandler): () => void {
    this.handlers.add(handler);
    return () => this.handlers.delete(handler);
  }

  emit(event: NeoEvent): void {
    this.handlers.forEach((handler) => handler(event));
  }

  /** Future: connectWebSocket(url), connectSSE(url) */
}

export const neoEventBus = new NeoEventBus();
