import type { NeoOperationsProvider, NeoProviderFactory } from "../contracts";
import { createMockNeoProvider } from "./mock/mockProvider";

let activeProvider: NeoOperationsProvider | null = null;

export function getNeoProvider(): NeoOperationsProvider {
  if (!activeProvider) {
    activeProvider = createMockNeoProvider();
  }
  return activeProvider;
}

export function setNeoProvider(factory: NeoProviderFactory): NeoOperationsProvider {
  activeProvider?.disconnectTransport?.();
  activeProvider = factory();
  return activeProvider;
}

export function resetNeoProvider(): void {
  activeProvider = null;
}

export { createMockNeoProvider } from "./mock/mockProvider";
