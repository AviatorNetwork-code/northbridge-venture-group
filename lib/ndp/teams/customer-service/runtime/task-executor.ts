import {
  createCapabilityRoutedTaskExecutor,
  createCapabilityToolRouter,
  type TaskExecutionInput,
  type TaskExecutor,
} from "@northbridge/specialist-runtime";
import {
  createCustomerServiceConnectorRouter,
  resolveCustomerServiceCapabilityForSpecialist,
} from "@/lib/ndp/domain/customer-service";
import { getCustomerServiceManifestForSpecialist } from "./roster.js";
import { renderEmployeeRuntimePrompt } from "./employee-runtime.js";

export interface CustomerServiceTaskExecutorOptions {
  now?: () => string;
}

export function createCustomerServiceTaskExecutor(
  options: CustomerServiceTaskExecutorOptions = {},
): TaskExecutor {
  const now = options.now ?? (() => new Date().toISOString());
  const connectorRouter = createCustomerServiceConnectorRouter(now);
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
        resolveCustomerServiceCapabilityForSpecialist(input.session.specialist.id)
      );
    },
  });

  return {
    execute: async (input: TaskExecutionInput) => {
      const manifest = getCustomerServiceManifestForSpecialist(input.session.specialist.id);
      const runtimePrompt = manifest ? renderEmployeeRuntimePrompt(manifest) : "";
      const capabilityId = resolveCustomerServiceCapabilityForSpecialist(
        input.session.specialist.id,
      );

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
