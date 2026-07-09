import type {
  ActionCatalogEntry,
  ContextAction,
  ContextActionsInput,
  ContextActionSet,
} from "./types.js";

const CANCEL_ACTION: ContextAction = {
  actionId: "__cancel__",
  label: "Cancel",
  kind: "cancel",
};

function scoreEntry(entry: ActionCatalogEntry, intentTags: readonly string[]): number {
  const overlap = entry.tags.filter((t) => intentTags.includes(t)).length;
  return entry.priority + overlap * 10;
}

/**
 * Generate context-aware actions from product-supplied catalog.
 * Platform filters and ranks; products never emit static button bars.
 */
export function generateContextActions(input: ContextActionsInput): ContextActionSet {
  const max = input.maxActions ?? 5;
  const ranked = [...input.catalog]
    .map((entry) => ({ entry, score: scoreEntry(entry, input.intentTags) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);

  const primary: ContextAction[] = ranked.slice(0, max - 1).map((r) => ({
    actionId: r.entry.actionId,
    label: r.entry.label,
    kind: "primary",
  }));

  const recentIds = new Set(input.recentActionIds ?? []);
  const recent: ContextAction[] = [...input.catalog]
    .filter((e) => recentIds.has(e.actionId))
    .slice(0, 2)
    .map((e) => ({
      actionId: e.actionId,
      label: e.label,
      kind: "recent" as const,
    }));

  const actions = [...primary, ...recent, CANCEL_ACTION].slice(0, max + 1);

  return {
    actions,
    reasoning:
      primary.length > 0
        ? `Ranked ${primary.length} context actions from catalog tags.`
        : "No catalog match — cancel only.",
  };
}

export function generateFieldActions(
  fieldIds: readonly { fieldId: string; label: string }[],
): ContextActionSet {
  const actions: ContextAction[] = [
    ...fieldIds.map((f) => ({
      actionId: `field:${f.fieldId}`,
      label: f.label,
      kind: "field" as const,
    })),
    CANCEL_ACTION,
  ];
  return {
    actions,
    reasoning: "Pending field collection — field shortcuts offered.",
  };
}
