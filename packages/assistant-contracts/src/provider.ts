import type { AssistantId, IsoDateTime, ProductId, ToolId } from "./primitives.js";
import type { AssistantToolMetadata } from "./tools.js";

/** Single message in a provider-agnostic conversation turn. */
export interface AssistantProviderMessage {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  /** Tool result correlation id when role is `tool`. */
  tool_call_id?: string;
}

/** Abstract tool call requested by the provider (not vendor-specific). */
export interface AssistantProviderToolCall {
  call_id: string;
  tool_id: ToolId;
  /** JSON-serializable arguments; validated by adapter before execution. */
  arguments: Record<string, unknown>;
}

/** Model routing hints — infrastructure policy, not product business logic. */
export interface AssistantProviderModelPreference {
  /** Ordered provider capability tags (e.g. `fast`, `reasoning`, `local`). */
  capability_tags?: readonly string[];
  max_tokens?: number;
  temperature?: number;
}

/**
 * Vendor-neutral provider request.
 * Context must be redacted at the adapter boundary before submission.
 */
export interface AssistantProviderRequest {
  request_id: string;
  product_id: ProductId;
  assistant_id: AssistantId;
  created_at: IsoDateTime;
  messages: readonly AssistantProviderMessage[];
  /** Tool metadata exposed to the model — not executable handlers. */
  available_tools: readonly AssistantToolMetadata[];
  model_preference?: AssistantProviderModelPreference;
  /** Must be true when request includes redacted/safe context only. */
  pii_redacted: boolean;
}

/** Token usage telemetry — no raw PII in logs. */
export interface AssistantProviderUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

/**
 * Vendor-neutral provider response.
 * Products and routers normalize this into Rich Cards and Explanations.
 */
export interface AssistantProviderResponse {
  request_id: string;
  /** Plain-text or markdown assistant content for Shell rendering. */
  content: string;
  tool_calls: readonly AssistantProviderToolCall[];
  finish_reason: "stop" | "tool_calls" | "length" | "error";
  usage?: AssistantProviderUsage;
  /** Opaque provider model identifier for telemetry. */
  model_id?: string;
  error_message?: string;
}
