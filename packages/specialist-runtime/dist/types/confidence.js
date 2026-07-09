export function meetsMinimumConfidence(score, minimum) {
    const order = ["low", "medium", "high"];
    return order.indexOf(score.level) >= order.indexOf(minimum);
}
