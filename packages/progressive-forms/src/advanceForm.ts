import type {
  FormFieldDefinition,
  ProgressiveFormState,
  ProgressiveFormStep,
} from "./types.js";

export function createProgressiveForm(
  formId: string,
  fields: readonly FormFieldDefinition[],
): ProgressiveFormState {
  const ordered = [...fields].sort((a, b) => {
    if (a.required !== b.required) return a.required ? -1 : 1;
    return 0;
  });
  return {
    formId,
    fields: ordered,
    answers: {},
    currentFieldIndex: 0,
    complete: ordered.length === 0,
  };
}

function nextIncompleteIndex(state: ProgressiveFormState): number {
  return state.fields.findIndex(
    (f, i) => i >= state.currentFieldIndex && state.answers[f.fieldId] === undefined,
  );
}

export function getCurrentField(
  state: ProgressiveFormState,
): FormFieldDefinition | null {
  if (state.complete) return null;
  const idx = nextIncompleteIndex(state);
  if (idx < 0) return null;
  return state.fields[idx] ?? null;
}

export function advanceProgressiveForm(
  state: ProgressiveFormState,
  answer?: unknown,
): { state: ProgressiveFormState; step: ProgressiveFormStep } {
  const field = getCurrentField(state);
  if (!field) {
    return {
      state: { ...state, complete: true },
      step: {
        done: true,
        field: null,
        prompt: null,
        validationError: null,
        answers: state.answers,
      },
    };
  }

  if (answer !== undefined) {
    const error = field.validate?.(answer) ?? validateRequired(field, answer);
    if (error) {
      return {
        state,
        step: {
          done: false,
          field,
          prompt: field.prompt,
          validationError: error,
          answers: state.answers,
        },
      };
    }

    const answers = { ...state.answers, [field.fieldId]: answer };
    const idx = state.fields.indexOf(field);
    const nextIndex = idx + 1;
    const complete = state.fields.every(
      (f) => !f.required || answers[f.fieldId] !== undefined,
    );

    const nextState: ProgressiveFormState = {
      ...state,
      answers,
      currentFieldIndex: nextIndex,
      complete,
    };

    const nextField = getCurrentField(nextState);
    return {
      state: nextState,
      step: {
        done: complete,
        field: nextField,
        prompt: nextField?.prompt ?? null,
        validationError: null,
        answers,
      },
    };
  }

  return {
    state,
    step: {
      done: false,
      field,
      prompt: field.prompt,
      validationError: null,
      answers: state.answers,
    },
  };
}

function validateRequired(
  field: FormFieldDefinition,
  value: unknown,
): string | null {
  if (!field.required) return null;
  if (value === undefined || value === null || value === "") {
    return `${field.label} is required`;
  }
  return null;
}
