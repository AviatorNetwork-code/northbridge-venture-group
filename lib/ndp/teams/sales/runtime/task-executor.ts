import {
  createCapabilityRoutedTaskExecutor,
  createCapabilityToolRouter,
  type TaskExecutionInput,
  type TaskExecutor,
} from "@northbridge/specialist-runtime";
import {
  createSalesConnectorRouter,
  resolveSalesCapabilityForSpecialist,
} from "@/lib/ndp/domain/sales";
import { getSalesManifestForSpecialist } from "./roster.js";
import { renderEmployeeRuntimePrompt } from "./employee-runtime.js";

export interface SalesTaskExecutorOptions {
  now?: () => string;
}

export function createSalesTaskExecutor(
  options: SalesTaskExecutorOptions = {},
): TaskExecutor {
  const now = options.now ?? (() => new Date().toISOString());
  const connectorRouter = createSalesConnectorRouter(now);
  const capabilityRouter = createCapabilityToolRouter(connectorRouter);
  const routedExecutor = createCapabilityRoutedTaskExecutor({
    router: capabilityRouter,
    now,
    resolveCapabilityId: (input: TaskExecutionInput) => {
      const fromPayload =
        typeof input.context.payload.capabilityId === "string"
          ? input.context.payload.capabilityId
          : undefined;
      const fromTask =
        typeof input.context.task.context?.capabilityId === "string"
          ? input.context.task.context.capabilityId
          : undefined;
      return (
        fromPayload ??
        fromTask ??
        resolveSalesCapabilityForSpecialist(input.session.specialist.id)
      );
    },
  });

  return {
    execute: async (input: TaskExecutionInput) => {
      const manifest = getSalesManifestForSpecialist(input.session.specialist.id);
      const runtimePrompt = manifest ? renderEmployeeRuntimePrompt(manifest) : "";
      const capabilityId = resolveSalesCapabilityForSpecialist(input.session.specialist.id);

      const routed = await routedExecutor.execute({
        ...input,
        context: {
          ...input.context,
          payload: {
            ...input.context.payload,
            runtimePromptRef: runtimePrompt ? "assembled" : undefined,
            capabilityId:
              typeof input.context.payload.capabilityId === "string"
                ? input.context.payload.capabilityId
                : capabilityId,
          },
          task: {
            ...input.context.task,
            context: {
              ...input.context.task.context,
              capabilityId:
                typeof input.context.task.context?.capabilityId === "string"
                  ? input.context.task.context.capabilityId
                  : capabilityId,
            },
          },
        },
      });

      return {
        ...routed,
        evidence: [
          ...(routed.evidence ?? []),
          ...(runtimePrompt
            ? ["Runtime prompt assembled from manifest, knowledge, and production templates"]
            : []),
        ],
      };
    },
  };
}
