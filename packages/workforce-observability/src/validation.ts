import {
  assertWithSchema,
  validateWithSchema,
  type ValidationResult,
} from "@northbridge/workforce-contracts";
import { workforceEventSchema, type WorkforceEvent } from "./types/event.js";

export function parseWorkforceEvent(input: unknown): WorkforceEvent {
  return assertWithSchema(workforceEventSchema, input, "WorkforceEvent");
}

export function safeParseWorkforceEvent(
  input: unknown,
): ValidationResult<WorkforceEvent> {
  return validateWithSchema(workforceEventSchema, input);
}

export function assertWorkforceEvent(input: unknown): WorkforceEvent {
  return parseWorkforceEvent(input);
}
