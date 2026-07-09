import type { ConversationLearningStore } from "@/lib/cat/conversation-learning/types";

export const CAT_LEARNING_STORE_KEY = "northbridge-cat-learning-store";

export function createEmptyLearningStore(): ConversationLearningStore {
  return {
    rawConversations: [],
    analyzedRecords: [],
    approvedLessons: [],
    auditLog: [],
    engineeringTasks: [],
  };
}

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

let memoryStore: ConversationLearningStore | null = null;
let memoryStoreHydrated = false;

function readStoreFromStorage(): ConversationLearningStore {
  if (!isBrowser()) return createEmptyLearningStore();
  try {
    const raw = window.localStorage.getItem(CAT_LEARNING_STORE_KEY);
    if (!raw) return createEmptyLearningStore();
    const parsed = JSON.parse(raw) as Partial<ConversationLearningStore>;
    return {
      rawConversations: parsed.rawConversations ?? [],
      analyzedRecords: parsed.analyzedRecords ?? [],
      approvedLessons: parsed.approvedLessons ?? [],
      auditLog: parsed.auditLog ?? [],
      engineeringTasks: parsed.engineeringTasks ?? [],
    };
  } catch {
    return createEmptyLearningStore();
  }
}

function hydrateStore(): void {
  if (memoryStoreHydrated) return;
  memoryStoreHydrated = true;
  memoryStore = readStoreFromStorage();
}

export function readLearningStore(): ConversationLearningStore {
  hydrateStore();
  return memoryStore ?? createEmptyLearningStore();
}

export function writeLearningStore(store: ConversationLearningStore): ConversationLearningStore {
  memoryStore = store;
  memoryStoreHydrated = true;
  if (isBrowser()) {
    try {
      window.localStorage.setItem(CAT_LEARNING_STORE_KEY, JSON.stringify(store));
    } catch {
      // Ignore quota failures.
    }
  }
  return store;
}

export function updateLearningStore(
  updater: (store: ConversationLearningStore) => ConversationLearningStore,
): ConversationLearningStore {
  const next = updater(readLearningStore());
  return writeLearningStore(next);
}

export function resetLearningStoreForTests(): void {
  memoryStore = createEmptyLearningStore();
  memoryStoreHydrated = true;
  if (isBrowser()) {
    window.localStorage.removeItem(CAT_LEARNING_STORE_KEY);
  }
}

export function setLearningStoreForTests(store: ConversationLearningStore): void {
  writeLearningStore(store);
}
