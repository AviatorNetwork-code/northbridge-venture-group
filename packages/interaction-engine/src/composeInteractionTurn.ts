import { buildAdaptiveCard } from "@northbridge/adaptive-cards";
import type { AdaptiveCardEnvelope, AdaptiveCardSpec } from "@northbridge/adaptive-cards";
import {
  generateContextActions,
  generateFieldActions,
} from "@northbridge/context-actions";
import type { ActionCatalogEntry, ContextActionSet } from "@northbridge/context-actions";
import { decideConversationTurn } from "@northbridge/conversation-engine";
import type {
  ConversationTurnDecision,
  ConversationTurnInput,
} from "@northbridge/conversation-engine";
import {
  applyStatePatch,
  dequeuePendingQuestion,
  enqueuePendingQuestion,
} from "@northbridge/conversation-state";
import type {
  ConversationState,
  ConversationStatePatch,
  PendingQuestion,
} from "@northbridge/conversation-state";
import { validateInteractionDensity } from "@northbridge/interaction-standards";
import { resolvePresentationPolicy } from "@northbridge/presentation-policy";
import type {
  PresentationDecision,
  PresentationPolicyInput,
} from "@northbridge/presentation-policy";
import {
  advanceProgressiveForm,
  getCurrentField,
} from "@northbridge/progressive-forms";
import type {
  FormFieldDefinition,
  ProgressiveFormState,
  ProgressiveFormStep,
} from "@northbridge/progressive-forms";

import { resolveInteractionModality } from "./resolveModality.js";
import type { InteractionModalityDecision } from "./types.js";

export type InteractionEnvelope = {
  schemaVersion: "1.0";
  turn: ConversationTurnDecision;
  presentation: PresentationDecision;
  modality: InteractionModalityDecision;
  actions?: ContextActionSet;
  card?: AdaptiveCardEnvelope;
  formStep?: ProgressiveFormStep;
  state: ConversationState;
  densityOk: boolean;
  reasoning: readonly string[];
};

export type ComposeInteractionTurnInput = {
  conversation: ConversationTurnInput;
  state: ConversationState;
  presentation: PresentationPolicyInput;
  actionCatalog?: readonly ActionCatalogEntry[];
  intentTags?: readonly string[];
  cardSpec?: AdaptiveCardSpec;
  formState?: ProgressiveFormState;
  formAnswer?: unknown;
  severity?: "info" | "warning" | "error";
  hasTimeSeries?: boolean;
  hasMetrics?: boolean;
};

function buildStatePatch(
  turn: ConversationTurnDecision,
  state: ConversationState,
  formStep?: ProgressiveFormStep,
): ConversationStatePatch | undefined {
  if (turn.action === "ask" && formStep?.field && !formStep.done) {
    const question: PendingQuestion = {
      fieldId: formStep.field.fieldId,
      prompt: formStep.prompt ?? formStep.field.prompt,
      required: formStep.field.required,
    };
    return {
      pendingQuestions: enqueuePendingQuestion(state, question).pendingQuestions,
    };
  }

  if (formStep?.field && formStep.validationError === null && formStep.done) {
    return {
      pendingQuestions: dequeuePendingQuestion(state, formStep.field.fieldId)
        .pendingQuestions,
    };
  }

  if (turn.action === "finish_workflow") {
    return {
      workflow: null,
      pendingQuestions: [],
    };
  }

  return undefined;
}

/**
 * Compose a full InteractionEnvelope by orchestrating CIP v2 engines.
 * Products render the envelope — they do not assemble presentation manually.
 */
export function composeInteractionTurn(
  input: ComposeInteractionTurnInput,
): InteractionEnvelope {
  const reasoning: string[] = [];

  const turn = decideConversationTurn(input.conversation);
  reasoning.push(`turn:${turn.action} — ${turn.reasoning}`);

  let formState = input.formState;
  let formStep: ProgressiveFormStep | undefined;

  if (formState && (turn.action === "ask" || input.formAnswer !== undefined)) {
    const advanced = advanceProgressiveForm(formState, input.formAnswer);
    formState = advanced.state;
    formStep = advanced.step;
    reasoning.push(
      formStep.done
        ? "progressive-form:complete"
        : `progressive-form:field:${formStep.field?.fieldId ?? "none"}`,
    );
  }

  const presentation = resolvePresentationPolicy(input.presentation);
  reasoning.push(`presentation:${presentation.format} — ${presentation.reasoning}`);

  const hasFormFields =
    Boolean(formState && !formState.complete) ||
    input.state.pendingQuestions.length > 0;

  const modality = resolveInteractionModality({
    turnAction: turn.action,
    presentationFormat: presentation.format,
    hasFormFields,
    hasTimeSeries: input.hasTimeSeries ?? false,
    hasMetrics: input.hasMetrics ?? false,
    severity: input.severity,
  });
  reasoning.push(`modality:${modality.modality} — ${modality.reasoning}`);

  let actions: ContextActionSet | undefined;
  if (turn.action === "ask" && formState) {
    const field = getCurrentField(formState);
    if (field) {
      actions = generateFieldActions([{ fieldId: field.fieldId, label: field.label }]);
      reasoning.push(actions.reasoning);
    }
  } else if (
    input.actionCatalog &&
    input.actionCatalog.length > 0 &&
    (turn.action === "finish_workflow" || turn.action === "answer")
  ) {
    actions = generateContextActions({
      message: input.conversation.message,
      intentTags: input.intentTags ?? [],
      catalog: input.actionCatalog,
      maxActions: 4,
    });
    reasoning.push(actions.reasoning);
  }

  let card: AdaptiveCardEnvelope | undefined;
  if (
    input.cardSpec &&
    (modality.modality === "card" ||
      modality.modality === "chart" ||
      modality.modality === "confirmation")
  ) {
    const displayState = presentation.collapsedByDefault ? "collapsed" : "expanded";
    card = buildAdaptiveCard({
      ...input.cardSpec,
      displayState,
      maxCollapsedRows: presentation.maxVisibleRows || undefined,
    });
    reasoning.push(`card:${card.cardId} expandable=${card.expandable}`);
  }

  const statePatch = buildStatePatch(turn, input.state, formStep);
  const state = statePatch
    ? applyStatePatch(input.state, statePatch)
    : input.state;

  const density = validateInteractionDensity({
    titleLength: card?.title.length,
    subtitleLength: card?.subtitle?.length,
    metricCount: card?.visibleMetrics.length,
    rowCount: input.cardSpec?.rows?.length,
    primaryActionCount: card?.actions.filter((a) => a.primary !== false).length,
    secondaryActionCount: card?.actions.filter((a) => a.primary === false).length,
    followUpChipCount: actions?.actions.length,
  });

  if (!density.ok) {
    reasoning.push(
      `density:violations:${density.violations.map((v) => v.field).join(",")}`,
    );
  }

  return {
    schemaVersion: "1.0",
    turn,
    presentation,
    modality,
    actions,
    card,
    formStep,
    state,
    densityOk: density.ok,
    reasoning,
  };
}
