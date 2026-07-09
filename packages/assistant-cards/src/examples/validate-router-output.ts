/**
 * Example: validate @northbridge/assistant-router response planner output.
 * Reference only — not production runtime.
 */

import {
  createExampleContext,
  createInMemoryToolExecutor,
  createSimpleResponsePlanner,
  EXAMPLE_READ_TOOL,
} from "@northbridge/assistant-router";
import { validateNormalizedPlannerCards } from "../normalize-router-output.js";

export async function runValidateRouterOutputExample() {
  const executor = createInMemoryToolExecutor({
    handlers: {
      [EXAMPLE_READ_TOOL.tool_id]: () => ({
        tool_id: EXAMPLE_READ_TOOL.tool_id,
        status: "success",
        data: { entity_name: "Example Entity" },
      }),
    },
  });

  const planner = createSimpleResponsePlanner();
  const result = await executor.execute(
    EXAMPLE_READ_TOOL.tool_id,
    {},
    createExampleContext(),
  );

  const contractCards = await planner.plan({
    routePlan: {
      intent: {
        intent_type: "inform",
        domain: "example-product",
        required_tool_ids: [],
        confirmation_requirement: "none",
        missing_data_fields: [],
        classification_confidence: "high",
      },
      selected_tool_ids: [EXAMPLE_READ_TOOL.tool_id],
      requires_confirmation: false,
    },
    toolResults: [result],
  });

  return validateNormalizedPlannerCards(contractCards);
}

void runValidateRouterOutputExample();
