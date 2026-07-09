import { assertWithSchema, validateWithSchema, } from "@northbridge/workforce-contracts";
import { workforceEventSchema } from "./types/event.js";
export function parseWorkforceEvent(input) {
    return assertWithSchema(workforceEventSchema, input, "WorkforceEvent");
}
export function safeParseWorkforceEvent(input) {
    return validateWithSchema(workforceEventSchema, input);
}
export function assertWorkforceEvent(input) {
    return parseWorkforceEvent(input);
}
