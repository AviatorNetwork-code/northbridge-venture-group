import type {
  AssistantCertificationLevel,
  AssistantId,
  IsoDateTime,
  ProductId,
  ToolId,
} from "./primitives.js";

/** Per-tool NBS-011 certification record. */
export interface ToolSafetyCertification {
  tool_id: ToolId;
  level: AssistantCertificationLevel;
  certified_at: IsoDateTime;
  certified_by: string;
  expires_at?: IsoDateTime;
}

/**
 * Product adapter safety certification envelope (NBS-011).
 * Governs which tools and capabilities an adapter release may expose.
 */
export interface AssistantSafetyCertification {
  certification_id: string;
  product_id: ProductId;
  assistant_id: AssistantId;
  adapter_version: string;
  /** Maximum certification level this adapter release is approved for. */
  max_level: AssistantCertificationLevel;
  tool_certifications: readonly ToolSafetyCertification[];
  certified_at: IsoDateTime;
  certified_by: string;
  /** Mandatory platform safety rules acknowledged at certification time. */
  rules_acknowledged: readonly [
    "no_silent_execution",
    "no_unsupported_claims",
    "no_sensitive_data_leakage",
    "no_hidden_automation",
  ];
}
