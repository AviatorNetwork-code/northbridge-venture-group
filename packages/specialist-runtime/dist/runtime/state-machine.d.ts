import type { RuntimeLifecycleState } from "../types/lifecycle.js";
export declare function canTransition(from: RuntimeLifecycleState, to: RuntimeLifecycleState): boolean;
export declare function assertTransition(from: RuntimeLifecycleState, to: RuntimeLifecycleState): void;
export declare function isTerminalState(state: RuntimeLifecycleState): boolean;
export declare function assertNonTerminalState(state: RuntimeLifecycleState): void;
