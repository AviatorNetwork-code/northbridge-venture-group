import { decideConversationTurn } from "@northbridge/conversation-engine";
import type { DiscoveryProfile } from "@/lib/cat/discovery-types";
import { getMissingDiscoveryFields, selectNextNordiQuestion } from "@/lib/cat/fact-memory-bridge";

/**
 * Maps Nordi discovery profile state to shared conversation-engine turn policy.
 * Product orchestration still owns website permission and recommendation flows.
 */
export function resolveDiscoveryTurnPolicy(profile: DiscoveryProfile) {
  const missingFields = getMissingDiscoveryFields(profile);
  const pendingQuestion = selectNextNordiQuestion(profile);

  return decideConversationTurn({
    message: "",
    hasPendingQuestions: missingFields.length > 0 || pendingQuestion != null,
    requiresConfirmation:
      Boolean(profile.websitePermissionAsked) && !profile.websitePermissionGranted,
    toolReady: false,
    asyncInFlight: Boolean(profile.websiteAnalysisPending),
    workflowComplete: profile.discoveryPhase === "recommendations",
    canAnswerDirectly: Boolean(profile.websiteAnalysis || profile.insightDelivered),
  });
}

export function discoveryTurnWantsQuestion(profile: DiscoveryProfile): boolean {
  return resolveDiscoveryTurnPolicy(profile).action === "ask";
}
