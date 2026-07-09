export function scoreToConfidence(value) {
    if (value >= 0.85)
        return "high";
    if (value >= 0.5)
        return "medium";
    return "low";
}
export function createRouteScore(value, strategy) {
    const normalized = Math.max(0, Math.min(1, value));
    return {
        value: normalized,
        confidence: scoreToConfidence(normalized),
        strategy,
    };
}
