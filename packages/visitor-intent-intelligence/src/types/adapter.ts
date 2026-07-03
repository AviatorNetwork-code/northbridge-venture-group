import type { JourneyEvent } from "./journey.js";
import type { IntentDefinition, IntentEvidence } from "./intent.js";
import type { BusinessSignal } from "./business.js";

/** Normalized event shape after adapter transformation. */
export interface VIIEvent extends JourneyEvent {
  productId: string;
  sessionId: string;
  rawType: string;
}

export interface AdapterContext {
  sessionId: string;
  productId: string;
  startedAt: number;
  events: VIIEvent[];
}

export interface AdapterSignals {
  paths: string[];
  catMessages: string[];
  searchQueries: string[];
  formActions: string[];
  metadata: Record<string, string | number | boolean>;
}

/**
 * Product adapter contract — all product-specific logic lives in adapters.
 * Core VII engine must never import product implementations.
 */
export interface VisitorIntentAdapter {
  readonly productId: string;
  readonly displayName: string;

  /** Core intents plus product-specific extensions. */
  getIntentCatalog(): IntentDefinition[];

  /** Transform raw product telemetry into normalized VII events. */
  normalizeEvent(raw: unknown, sessionId: string): VIIEvent | null;

  /** Extract adapter-specific evidence for intent inference. */
  extractSignals(context: AdapterContext): AdapterSignals;

  /** Map adapter signals to weighted intent evidence. */
  mapSignalsToEvidence(
    signals: AdapterSignals,
    catalog: IntentDefinition[],
  ): IntentEvidence[];

  /** Optional business signals from product systems (read-only). */
  extractBusinessSignals?(context: AdapterContext): BusinessSignal[];

  /** Product-specific objective completion rules. */
  detectCompletedObjectives?(context: AdapterContext): string[];

  /** Product-specific friction heuristics. */
  detectFriction?(context: AdapterContext): import("./journey.js").FrictionEvent[];

  /** Product-specific outcome hints. */
  classifyOutcomeHints?(context: AdapterContext): Partial<import("./outcome.js").OutcomeAssessment>;
}

export type { IntentEvidence };
