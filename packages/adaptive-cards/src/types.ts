export const CARD_DISPLAY_STATES = [
  "collapsed",
  "expanded",
  "interactive",
  "editable",
] as const;

export type CardDisplayState = (typeof CARD_DISPLAY_STATES)[number];

export type AdaptiveCardMetric = {
  label: string;
  value: string;
};

export type AdaptiveCardRow = {
  label: string;
  value: string;
};

export type AdaptiveCardAction = {
  actionId: string;
  label: string;
  primary?: boolean;
};

export type AdaptiveCardSpec = {
  cardId: string;
  title: string;
  subtitle?: string;
  metrics?: readonly AdaptiveCardMetric[];
  rows?: readonly AdaptiveCardRow[];
  actions?: readonly AdaptiveCardAction[];
  displayState: CardDisplayState;
  maxCollapsedRows?: number;
};

export type AdaptiveCardEnvelope = {
  schemaVersion: "1.0";
  cardId: string;
  displayState: CardDisplayState;
  title: string;
  subtitle?: string;
  visibleMetrics: readonly AdaptiveCardMetric[];
  visibleRows: readonly AdaptiveCardRow[];
  hiddenRowCount: number;
  actions: readonly AdaptiveCardAction[];
  expandable: boolean;
};
