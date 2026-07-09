import type { ConflictDetectionInput, ConflictDetector, TeamConflict } from "../types/conflict.js";
export declare class DefaultConflictDetector implements ConflictDetector {
    detect(input: ConflictDetectionInput): TeamConflict[];
}
