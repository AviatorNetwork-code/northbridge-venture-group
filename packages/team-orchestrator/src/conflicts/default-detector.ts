import type {
  ConflictDetectionInput,
  ConflictDetector,
  TeamConflict,
} from "../types/conflict.js";

export class DefaultConflictDetector implements ConflictDetector {
  detect(input: ConflictDetectionInput): TeamConflict[] {
    const now = input.now ?? new Date().toISOString();
    const byTopic = new Map<
      string,
      Array<{
        specialistId: string;
        summary: string;
        polarity: "support" | "oppose" | "neutral";
      }>
    >();

    for (const result of input.results) {
      if (result.outcome !== "complete" || !result.result) continue;
      const topicKey =
        (result.result as { topicKey?: string }).topicKey ??
        extractTopicKey(result.result.summary);
      const polarity = extractPolarity(result.result.summary);
      const bucket = byTopic.get(topicKey) ?? [];
      bucket.push({
        specialistId: result.specialistId,
        summary: result.result.summary,
        polarity,
      });
      byTopic.set(topicKey, bucket);
    }

    const conflicts: TeamConflict[] = [];
    for (const [topicKey, positions] of byTopic.entries()) {
      const hasSupport = positions.some((p) => p.polarity === "support");
      const hasOppose = positions.some((p) => p.polarity === "oppose");
      if (hasSupport && hasOppose) {
        conflicts.push({
          conflictId: `conflict-${topicKey}`,
          topic: topicKey,
          topicKey,
          positions: positions.map((position) => ({
            ...position,
            topicKey,
          })),
          detectedAt: now,
        });
      }
    }

    return conflicts;
  }
}

function extractTopicKey(summary: string): string {
  const match = summary.match(/topic:([a-z0-9_-]+)/i);
  return match?.[1] ?? "general";
}

function extractPolarity(
  summary: string,
): "support" | "oppose" | "neutral" {
  if (/\b(increase|expand|approve|support)\b/i.test(summary)) return "support";
  if (/\b(decrease|reduce|deny|oppose|delay)\b/i.test(summary)) return "oppose";
  return "neutral";
}
