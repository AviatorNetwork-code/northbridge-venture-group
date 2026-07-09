export type ContextActionKind = "field" | "primary" | "secondary" | "cancel" | "recent";

export type ContextAction = {
  actionId: string;
  label: string;
  kind: ContextActionKind;
  disabled?: boolean;
};

export type ActionCatalogEntry = {
  actionId: string;
  label: string;
  tags: readonly string[];
  priority: number;
};

export type ContextActionsInput = {
  message: string;
  intentTags: readonly string[];
  catalog: readonly ActionCatalogEntry[];
  recentActionIds?: readonly string[];
  maxActions?: number;
};

export type ContextActionSet = {
  actions: readonly ContextAction[];
  reasoning: string;
};
