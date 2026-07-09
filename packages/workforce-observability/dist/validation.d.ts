import { type ValidationResult } from "@northbridge/workforce-contracts";
import { type WorkforceEvent } from "./types/event.js";
export declare function parseWorkforceEvent(input: unknown): WorkforceEvent;
export declare function safeParseWorkforceEvent(input: unknown): ValidationResult<WorkforceEvent>;
export declare function assertWorkforceEvent(input: unknown): WorkforceEvent;
