export interface BusinessSignal {
  type:
    | "lead_generated"
    | "activation"
    | "subscription"
    | "marketplace_activity"
    | "support_request"
    | "conversion"
    | "retention_signal";
  timestamp: number;
  value?: number;
  metadata?: Record<string, string | number | boolean>;
}

export interface BusinessCorrelation {
  intentId: string;
  signals: BusinessSignal[];
  estimatedValueScore: number;
  leadGenerated: boolean;
  activated: boolean;
  converted: boolean;
  retentionIndicator?: "positive" | "neutral" | "negative";
  summary: string;
}

export interface BusinessCorrelationSummary {
  byIntent: Record<
    string,
    {
      sessionCount: number;
      leadCount: number;
      conversionCount: number;
      averageValueScore: number;
    }
  >;
  highestValueIntentId?: string;
}
