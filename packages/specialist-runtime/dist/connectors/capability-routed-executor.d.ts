import type { ConnectorExecutionResult } from "@northbridge/workforce-connectors";
import type { TaskExecutionInput, TaskExecutionOutput, TaskExecutor } from "../types/execution.js";
import type { CapabilityToolRouter } from "./capability-tool-router.js";
export interface CapabilityRoutedExecutorOptions {
    router: CapabilityToolRouter;
    /** Defaults to task.context.capabilityId or policy capability from session. */
    resolveCapabilityId?: (input: TaskExecutionInput) => string;
    resolveInput?: (input: TaskExecutionInput, capabilityId: string) => Record<string, unknown>;
    mapOutput?: (result: ConnectorExecutionResult, input: TaskExecutionInput) => TaskExecutionOutput;
    now?: () => string;
    createRequestId?: () => string;
}
/**
 * TaskExecutor that routes through capability → connector registry → connector.
 * The executor does not know which provider satisfies the capability.
 */
export declare function createCapabilityRoutedTaskExecutor(options: CapabilityRoutedExecutorOptions): TaskExecutor;
