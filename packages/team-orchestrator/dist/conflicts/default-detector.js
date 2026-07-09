export class DefaultConflictDetector {
    detect(input) {
        const now = input.now ?? new Date().toISOString();
        const byTopic = new Map();
        for (const result of input.results) {
            if (result.outcome !== "complete" || !result.result)
                continue;
            const topicKey = result.result.topicKey ??
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
        const conflicts = [];
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
function extractTopicKey(summary) {
    const match = summary.match(/topic:([a-z0-9_-]+)/i);
    return match?.[1] ?? "general";
}
function extractPolarity(summary) {
    if (/\b(increase|expand|approve|support)\b/i.test(summary))
        return "support";
    if (/\b(decrease|reduce|deny|oppose|delay)\b/i.test(summary))
        return "oppose";
    return "neutral";
}
