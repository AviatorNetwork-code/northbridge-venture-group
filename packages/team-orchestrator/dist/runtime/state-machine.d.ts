import type { TeamRequestLifecycleState } from "../types/lifecycle.js";
export declare function canTeamTransition(from: TeamRequestLifecycleState, to: TeamRequestLifecycleState): boolean;
export declare function assertTeamTransition(from: TeamRequestLifecycleState, to: TeamRequestLifecycleState): void;
export declare function isTeamTerminalState(state: TeamRequestLifecycleState): boolean;
