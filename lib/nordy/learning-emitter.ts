import type { DeploymentEnvironment, NordyAiGapClass, NordyEntryPath } from "@/lib/nordy/types";
import { isProductionCustomerEvidenceEnv, resolveDeploymentEnvironment } from "@/lib/nordy/environment";

/**
 * CAP-LEARN-001 compatible learning evidence emitter.
 * No raw transcript persistence by default.
 * MODEL TRAINING: DISABLED / NOT AUTHORIZED.
 */

export const TRAINING_AUTHORIZED = false as const;

export type NordyLearningEvidence = {
  schema: "CAP-LEARN-001";
  agent: "nordy";
  project: "northbridge-website";
  environment: DeploymentEnvironment;
  intent?: string;
  route?: string;
  entryPath: NordyEntryPath;
  aiEscalated: boolean;
  gapClass: NordyAiGapClass;
  retrievalPath: "company_knowledge" | "capability_registry" | "neo_retrieval" | "neo_ai" | "none";
  result: "answered" | "escalated" | "handoff" | "refused" | "uncertain";
  correction?: string;
  outcome?: string;
  reusableGap: boolean;
  trainingCandidateEligible: false;
  producedAt: string;
};

export type EmitLearningInput = Omit<
  NordyLearningEvidence,
  "schema" | "agent" | "project" | "environment" | "trainingCandidateEligible" | "producedAt"
> & {
  environment?: DeploymentEnvironment;
};

const memoryStore: NordyLearningEvidence[] = [];

export function emitNordyLearningEvidence(
  input: EmitLearningInput,
): NordyLearningEvidence | null {
  const environment = input.environment ?? resolveDeploymentEnvironment();

  // Test/preview/local interactions must not masquerade as production customer evidence.
  if (!isProductionCustomerEvidenceEnv(environment) && environment === "PRODUCTION") {
    return null;
  }

  const evidence: NordyLearningEvidence = {
    schema: "CAP-LEARN-001",
    agent: "nordy",
    project: "northbridge-website",
    environment,
    intent: input.intent,
    route: input.route,
    entryPath: input.entryPath,
    aiEscalated: input.aiEscalated,
    gapClass: input.gapClass,
    retrievalPath: input.retrievalPath,
    result: input.result,
    correction: input.correction,
    outcome: input.outcome,
    reusableGap: input.reusableGap,
    trainingCandidateEligible: false,
    producedAt: new Date().toISOString(),
  };

  // Local adapter only — no second learning pipeline, no dataset export.
  if (memoryStore.length > 500) memoryStore.shift();
  memoryStore.push(evidence);
  return evidence;
}

export function getLearningEvidenceForTests(): NordyLearningEvidence[] {
  return [...memoryStore];
}

export function clearLearningEvidenceForTests(): void {
  memoryStore.length = 0;
}
