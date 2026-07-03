import { randomUUID } from "node:crypto";
import { mergeIntentCatalog } from "../adapters/adapterContract.js";
import { assessConfidence } from "../engines/confidenceEngine.js";
import { correlateBusinessSignals } from "../engines/businessCorrelationEngine.js";
import {
  evaluateConversation,
  extractCatInteractions,
} from "../engines/conversationEvaluator.js";
import {
  buildImprovementRecommendations,
  generateExecutiveReport,
} from "../engines/executiveReportingEngine.js";
import { inferIntent, buildEvidenceFromKeywords } from "../engines/intentInferenceEngine.js";
import { buildJourneyUnderstanding } from "../engines/journeyUnderstandingEngine.js";
import { classifyOutcome } from "../engines/outcomeClassifier.js";
import {
  validateRecommendations,
  validateSessionIntelligence,
  wrapRecommendationOutput,
} from "../governance/readOnlyPolicy.js";
import type {
  AdapterContext,
  VisitorIntentAdapter,
  VIIEvent,
} from "../types/adapter.js";
import type { VIIIntegrationInputs, VIIOutputTarget } from "../types/integration.js";
import type { ExecutiveReport, SessionIntelligence } from "../types/reporting.js";

export class VisitorIntentIntelligence {
  private readonly adapter: VisitorIntentAdapter;
  private readonly sessionId: string;
  private readonly events: VIIEvent[] = [];
  private readonly startedAt: number;
  private integrationInputs: VIIIntegrationInputs = {};

  constructor(adapter: VisitorIntentAdapter, sessionId?: string) {
    this.adapter = adapter;
    this.sessionId = sessionId ?? randomUUID();
    this.startedAt = Date.now();
  }

  getSessionId(): string {
    return this.sessionId;
  }

  getProductId(): string {
    return this.adapter.productId;
  }

  /** Ingest raw product telemetry through the adapter boundary. */
  ingestEvent(raw: unknown): VIIEvent | null {
    const normalized = this.adapter.normalizeEvent(raw, this.sessionId);
    if (normalized) {
      this.events.push(normalized);
    }
    return normalized;
  }

  /** Ingest pre-normalized VII events (e.g. from batch replay). */
  ingestNormalizedEvent(event: VIIEvent): void {
    this.events.push(event);
  }

  setIntegrationInputs(inputs: VIIIntegrationInputs): void {
    this.integrationInputs = inputs;
  }

  analyzeSession(): SessionIntelligence {
    const context = this.buildContext();
    const catalog = mergeIntentCatalog(this.adapter.getIntentCatalog());
    const signals = this.adapter.extractSignals(context);

    const adapterEvidence = this.adapter.mapSignalsToEvidence(signals, catalog);
    const keywordEvidence = signals.catMessages.flatMap((message) =>
      buildEvidenceFromKeywords(message, "cat", Date.now(), catalog),
    );

    const evidence = [...adapterEvidence, ...keywordEvidence];
    const timestamps = this.events.map((e) => e.timestamp);

    const intent = inferIntent(catalog, evidence, timestamps);
    const confidence = assessConfidence(this.events, intent.confidence);

    const completedObjectives =
      this.adapter.detectCompletedObjectives?.(context) ?? [];
    const adapterFriction = this.adapter.detectFriction?.(context) ?? [];

    const journey = buildJourneyUnderstanding(
      this.events,
      adapterFriction,
      completedObjectives,
    );

    const catInteractions = extractCatInteractions(this.events);
    const conversation = evaluateConversation(catInteractions, intent, journey);

    const outcome = classifyOutcome(this.events, this.adapter, context, completedObjectives);

    const businessSignals = this.adapter.extractBusinessSignals?.(context) ?? [];
    const business = correlateBusinessSignals(intent, businessSignals, outcome);

    const catImprovementRecommendations = [
      ...(conversation?.improvementRecommendations ?? []),
    ];

    const productImprovementRecommendations = buildProductRecommendations(journey, outcome);

    const session: SessionIntelligence = validateSessionIntelligence({
      schemaVersion: "1.0.0",
      sessionId: this.sessionId,
      productId: this.adapter.productId,
      startedAt: this.startedAt,
      endedAt: this.events.at(-1)?.timestamp ?? Date.now(),
      intent,
      confidence,
      journey,
      conversation,
      outcome,
      business,
      catImprovementRecommendations,
      productImprovementRecommendations,
    });

    return session;
  }

  generateExecutiveReport(sessions?: SessionIntelligence[]): ExecutiveReport {
    const analyzed = sessions ?? [this.analyzeSession()];
    return generateExecutiveReport(analyzed, this.adapter.productId);
  }

  getRecommendations(session?: SessionIntelligence): ReturnType<typeof validateRecommendations> {
    const analyzed = session ?? this.analyzeSession();
    return validateRecommendations(buildImprovementRecommendations(analyzed));
  }

  emitOutput(target: VIIOutputTarget, payload: unknown) {
    return wrapRecommendationOutput(target, payload);
  }

  private buildContext(): AdapterContext {
    return {
      sessionId: this.sessionId,
      productId: this.adapter.productId,
      startedAt: this.startedAt,
      events: [...this.events],
    };
  }
}

function buildProductRecommendations(
  journey: SessionIntelligence["journey"],
  outcome: SessionIntelligence["outcome"],
): string[] {
  const recommendations: string[] = [];

  if (journey.frictionEvents.length > 0) {
    recommendations.push(
      "Reduce navigation friction on high-abandon paths identified in this session.",
    );
  }

  if (journey.unansweredQuestions.length > 0) {
    recommendations.push(
      "Add or surface content addressing frequently unanswered visitor questions.",
    );
  }

  if (outcome.classification === "abandoned") {
    recommendations.push(
      "Introduce clearer next-step guidance on entry pages for this intent profile.",
    );
  }

  if (journey.timeToValueMs && journey.timeToValueMs > 120_000) {
    recommendations.push(
      "Shorten time-to-value by surfacing primary CTAs earlier in the journey.",
    );
  }

  return recommendations;
}

export { mergeIntentCatalog, DEFAULT_INTENT_CATALOG } from "../adapters/adapterContract.js";
