import type { ConsultantSessionState } from "./consultantTypes";
import { buildMetricsSnapshot } from "./successMetrics";

export interface NeoExportPayload {
  schemaVersion: "1.0.0";
  exportedAt: number;
  productId: "northbridge-website";
  sessionSummary: {
    turnCount: number;
    stage: string;
    visitorType: string;
    industry?: string;
    recommendedProductId?: string;
    scores: ConsultantSessionState["scores"];
    metrics: ReturnType<typeof buildMetricsSnapshot>;
  };
  intelligence: ConsultantSessionState["intelligence"];
  governance: {
    anonymous: true;
    noPii: true;
    readOnly: true;
  };
}

export function buildNeoExportPayload(session: ConsultantSessionState): NeoExportPayload {
  return {
    schemaVersion: "1.0.0",
    exportedAt: Date.now(),
    productId: "northbridge-website",
    sessionSummary: {
      turnCount: session.turnCount,
      stage: session.stage,
      visitorType: session.profile.visitorType,
      industry: session.profile.industry,
      recommendedProductId: session.recommendedProductId,
      scores: session.scores,
      metrics: buildMetricsSnapshot(session),
    },
    intelligence: session.intelligence,
    governance: {
      anonymous: true,
      noPii: true,
      readOnly: true,
    },
  };
}

export const NEO_EXPORT_TARGETS = [
  "visitor_intent_intelligence",
  "customer_experience_intelligence",
  "adaptive_experience_engine",
  "business_impact_engine",
  "executive_intelligence",
  "founder_decision_learning",
] as const;

export type NeoExportTarget = (typeof NEO_EXPORT_TARGETS)[number];

export function dispatchNeoExport(session: ConsultantSessionState): NeoExportPayload {
  const payload = buildNeoExportPayload(session);

  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("northbridge:cat-neo-export", { detail: payload }),
    );
  }

  return payload;
}
