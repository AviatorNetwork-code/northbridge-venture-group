import type { AdaptiveCardEnvelope, AdaptiveCardSpec } from "./types.js";

const DEFAULT_MAX_COLLAPSED_ROWS = 4;
const DEFAULT_MAX_COLLAPSED_METRICS = 4;

/**
 * Build a density-aware card envelope. Validation against assistant-cards schema
 * is the product adapter's responsibility at render time.
 */
export function buildAdaptiveCard(spec: AdaptiveCardSpec): AdaptiveCardEnvelope {
  const maxRows = spec.maxCollapsedRows ?? DEFAULT_MAX_COLLAPSED_ROWS;
  const rows = spec.rows ?? [];
  const metrics = spec.metrics ?? [];
  const collapsed = spec.displayState === "collapsed";

  const visibleRows =
    collapsed && rows.length > maxRows ? rows.slice(0, maxRows) : rows;

  const visibleMetrics =
    collapsed && metrics.length > DEFAULT_MAX_COLLAPSED_METRICS
      ? metrics.slice(0, DEFAULT_MAX_COLLAPSED_METRICS)
      : metrics;

  const primaryActions = (spec.actions ?? []).filter((a) => a.primary !== false).slice(0, 3);
  const secondaryActions = (spec.actions ?? []).filter((a) => a.primary === false).slice(0, 2);

  return {
    schemaVersion: "1.0",
    cardId: spec.cardId,
    displayState: spec.displayState,
    title: spec.title.slice(0, 80),
    subtitle: spec.subtitle?.slice(0, 120),
    visibleMetrics,
    visibleRows,
    hiddenRowCount: Math.max(0, rows.length - visibleRows.length),
    actions: [...primaryActions, ...secondaryActions],
    expandable: rows.length > maxRows,
  };
}

export function collapseCard(spec: AdaptiveCardSpec): AdaptiveCardEnvelope {
  return buildAdaptiveCard({ ...spec, displayState: "collapsed" });
}

export function expandCard(spec: AdaptiveCardSpec): AdaptiveCardEnvelope {
  return buildAdaptiveCard({ ...spec, displayState: "expanded" });
}
