import {
  createEmptyMemory,
  NORDI_MEMORY_VERSION,
  type NordiConversationMemory,
} from "@/lib/nordi/conversation-memory";

const DEFAULT_STORAGE_KEY = "northbridge-nordi-relationship";
const LEGACY_STORAGE_KEY = "northbridge-home-cat";

export interface NordiStorageAdapter {
  load(): NordiConversationMemory | null;
  save(memory: NordiConversationMemory): void;
  clear(): void;
}

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function parseMemory(raw: string): NordiConversationMemory | null {
  try {
    const parsed = JSON.parse(raw) as Partial<NordiConversationMemory> & {
      businessProfile?: NordiConversationMemory["profile"];
    };

    if (!parsed.sessionId) return null;

    const now = new Date().toISOString();

    return {
      version: parsed.version ?? NORDI_MEMORY_VERSION,
      sessionId: parsed.sessionId,
      messages: (parsed.messages ?? []).map((message) => ({
        id: message.id,
        role: message.role,
        content: message.content,
        card: message.card,
        timestamp: message.timestamp ?? now,
        animate: false,
      })),
      profile: parsed.profile ?? parsed.businessProfile ?? { discoveryPhase: "learning", userMessageCount: 0 },
      identity: parsed.identity ?? null,
      saved: Boolean(parsed.saved),
      callRequested: Boolean(parsed.callRequested),
      milestones: parsed.milestones ?? [],
      knownSince: parsed.knownSince ?? now,
      lastUpdated: parsed.lastUpdated ?? now,
      welcomeBackShown: parsed.welcomeBackShown,
    };
  } catch {
    return null;
  }
}

function migrateLegacy(raw: string): NordiConversationMemory | null {
  try {
    const legacy = JSON.parse(raw) as {
      sessionId?: string;
      messages?: NordiConversationMemory["messages"];
      businessProfile?: NordiConversationMemory["profile"];
      identity?: NordiConversationMemory["identity"];
      saved?: boolean;
      callRequested?: boolean;
    };

    if (!legacy.sessionId || !legacy.messages?.length) return null;

    const now = new Date().toISOString();
    const memory = createEmptyMemory(legacy.sessionId);
    memory.messages = legacy.messages.map((message) => ({
      ...message,
      timestamp: message.timestamp ?? now,
      animate: false,
    }));
    memory.profile = legacy.businessProfile ?? memory.profile;
    memory.identity = legacy.identity ?? null;
    memory.saved = Boolean(legacy.saved);
    memory.callRequested = Boolean(legacy.callRequested);
    memory.knownSince = now;
    memory.lastUpdated = now;
    return memory;
  } catch {
    return null;
  }
}

export class LocalNordiStorage implements NordiStorageAdapter {
  constructor(private readonly key: string = DEFAULT_STORAGE_KEY) {}

  load(): NordiConversationMemory | null {
    if (!isBrowser()) return null;

    const current = window.localStorage.getItem(this.key);
    if (current) {
      const memory = parseMemory(current);
      if (memory) return memory;
    }

    const legacy = window.localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacy) {
      const migrated = migrateLegacy(legacy);
      if (migrated) {
        this.save(migrated);
        window.localStorage.removeItem(LEGACY_STORAGE_KEY);
        return migrated;
      }
    }

    return null;
  }

  save(memory: NordiConversationMemory): void {
    if (!isBrowser()) return;
    try {
      window.localStorage.setItem(this.key, JSON.stringify(memory));
    } catch {
      // Ignore quota / private mode failures.
    }
  }

  clear(): void {
    if (!isBrowser()) return;
    window.localStorage.removeItem(this.key);
    window.localStorage.removeItem(LEGACY_STORAGE_KEY);
  }
}

let defaultStorage: NordiStorageAdapter | null = null;

export function getNordiStorage(): NordiStorageAdapter {
  if (!defaultStorage) {
    defaultStorage = new LocalNordiStorage();
  }
  return defaultStorage;
}

/** Allows future NEO-backed storage without changing UI code. */
export function setNordiStorage(adapter: NordiStorageAdapter): void {
  defaultStorage = adapter;
}
