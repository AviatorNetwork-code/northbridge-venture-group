/**
 * Type-only product adapter extension examples (NB-ASSIST-002).
 * Not imported at runtime — illustrates how products extend platform contracts.
 */

import type {
  AssistantContext,
  AssistantRichCard,
  AssistantToolMetadata,
  AssistantToolResult,
  OperationalDraft,
} from "../index.js";

// --- Example A: workspace snapshot extension ---

interface ExampleWorkspaceSnapshot extends Record<string, unknown> {
  active_role: "member" | "manager";
  organization_id: string;
  active_entity_id: string;
}

type ExampleAssistantContext = AssistantContext<ExampleWorkspaceSnapshot>;

const _exampleContext: ExampleAssistantContext = {
  snapshot_id: "snap_001",
  product_id: "example-product",
  assistant_id: "example-assistant",
  workspace: {
    active_role: "member",
    organization_id: "org_42",
    active_entity_id: "entity_7",
  },
  session: {
    user_id: "user_1",
    roles: ["member"],
    permissions: ["read:entities", "draft:actions"],
  },
  features: {
    enabled: ["assistant", "draft_actions"],
    disabled_reasons: {},
  },
  memory: {
    short_term: [{ last_topic: "overview" }],
    long_term_refs: ["NKB-artifact-001"],
  },
  loaded_at: "2026-06-29T12:00:00.000Z",
  completeness: { missing_fields: [] },
};

void _exampleContext;

// --- Example B: typed tool result ---

interface LookupResultData {
  entity_name: string;
  status: string;
}

type ExampleToolResult = AssistantToolResult<LookupResultData>;

const _exampleToolResult: ExampleToolResult = {
  tool_id: "lookup_entity",
  status: "success",
  data: { entity_name: "Example Entity", status: "active" },
};

void _exampleToolResult;

// --- Example C: product tool registration metadata ---

const _exampleTool: AssistantToolMetadata = {
  tool_id: "lookup_entity",
  domain: "example-product",
  description: "Read-only lookup of an entity in the active workspace.",
  certification_level: "L0",
  required_scopes: ["read:entities"],
  classification: "read",
  safety_boundaries: {
    allows_pii: false,
    requires_confirmation: false,
  },
  handler_ref: "example-product.handlers.lookupEntity",
};

void _exampleTool;

// --- Example D: gated operational draft ---

interface ScheduleChangeParameters extends Record<string, unknown> {
  entity_id: string;
  action: "assign" | "release";
  target_slot_id: string;
}

type ExampleOperationalDraft = OperationalDraft<ScheduleChangeParameters>;

const _exampleDraft: ExampleOperationalDraft = {
  draft_id: "OPD-example-001",
  source: {
    assistant_id: "example-assistant",
    product_id: "example-product",
    user_confirmation: false,
  },
  workflow: {
    type: "entity_slot_change",
    parameters: {
      entity_id: "entity_7",
      action: "assign",
      target_slot_id: "slot_99",
    },
  },
  originating_tool_id: "draft_slot_change",
  approval: {
    status: "pending",
    neo_gate_ids: [],
  },
  risk_class: "medium",
  created_at: "2026-06-29T12:05:00.000Z",
};

void _exampleDraft;

// --- Example E: product-specific rich card (uses platform schema) ---

const _exampleCard: AssistantRichCard = {
  schema_version: "1.0",
  card_id: "card_example_001",
  status: "success",
  title: "Entity overview",
  subtitle: "Active workspace entity",
  metrics: [{ label: "Open items", value: "3", tone: "neutral" }],
  badges: [{ label: "Active", status: "success" }],
  rows: [{ label: "Entity", value: "Example Entity" }],
  actions: [
    {
      action_id: "propose_change",
      label: "Propose change",
      draft_id: "OPD-example-001",
    },
  ],
};

void _exampleCard;
