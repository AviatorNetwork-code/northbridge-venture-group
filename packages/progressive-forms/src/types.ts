export type FormFieldType = "text" | "number" | "date" | "select" | "boolean";

export type FormFieldDefinition = {
  fieldId: string;
  label: string;
  prompt: string;
  type: FormFieldType;
  required: boolean;
  options?: readonly string[];
  validate?: (value: unknown) => string | null;
};

export type ProgressiveFormState = {
  formId: string;
  fields: readonly FormFieldDefinition[];
  answers: Record<string, unknown>;
  currentFieldIndex: number;
  complete: boolean;
};

export type ProgressiveFormStep = {
  done: boolean;
  field: FormFieldDefinition | null;
  prompt: string | null;
  validationError: string | null;
  answers: Record<string, unknown>;
};
