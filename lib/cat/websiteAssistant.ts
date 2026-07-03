import {
  getConsultantGreeting,
  runConsultantTurn,
} from "./consultantStrategy";
import type {
  CatAssistantResponse,
  CatConversationContext,
  CatRuntimeAdapter,
} from "./websiteAssistantTypes";

/** Consultant-mode response engine (v2). */
export function respondToVisitorInput(
  input: string,
  context?: CatConversationContext,
): CatAssistantResponse {
  return runConsultantTurn(input, context);
}

export function getGreetingResponse(): CatAssistantResponse {
  return getConsultantGreeting();
}

export const consultantCatAdapter: CatRuntimeAdapter = {
  mode: "consultant",
  respond: async (input, context) => runConsultantTurn(input, context),
};

let activeAdapter: CatRuntimeAdapter = consultantCatAdapter;

export function setCatRuntimeAdapter(adapter: CatRuntimeAdapter): void {
  activeAdapter = adapter;
}

export function getCatRuntimeAdapter(): CatRuntimeAdapter {
  return activeAdapter;
}

export async function askCatAssistant(
  input: string,
  context?: CatConversationContext,
): Promise<CatAssistantResponse> {
  return activeAdapter.respond(input, context);
}

export { runConsultantTurn, getConsultantGreeting } from "./consultantStrategy";
