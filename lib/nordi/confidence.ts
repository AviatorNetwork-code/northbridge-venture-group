export type ConfidenceLevel = "Very High" | "High" | "Medium" | "Low";

export type ConfidenceDetail = {
  level: ConfidenceLevel;
  reason: string;
};

export function mapSignalConfidence(value: "high" | "medium" | "low"): ConfidenceLevel {
  if (value === "high") return "High";
  if (value === "medium") return "Medium";
  return "Low";
}

export function websiteOnlyReason(hasConversationContext: boolean): string {
  if (hasConversationContext) {
    return "Based on your website and what you've shared so far. We haven't connected your scheduling system yet.";
  }
  return "Only website evidence is available. We haven't connected your scheduling system yet.";
}

export function buildInsightConfidence(
  signalConfidence: "high" | "medium" | "low",
  hasConversationContext: boolean,
): ConfidenceDetail {
  const level = hasConversationContext && signalConfidence === "high" ? "High" : mapSignalConfidence(signalConfidence);

  return {
    level,
    reason: websiteOnlyReason(hasConversationContext),
  };
}

export function confidenceToneClass(level: ConfidenceLevel): string {
  switch (level) {
    case "Very High":
      return "text-emerald-300";
    case "High":
      return "text-green-300";
    case "Medium":
      return "text-amber-300";
    default:
      return "text-stone";
  }
}
