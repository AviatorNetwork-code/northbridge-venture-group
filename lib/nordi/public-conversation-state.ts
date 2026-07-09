import type { NordiConversationMemory } from "@/lib/nordi/conversation-memory";
import { hasRelationship } from "@/lib/nordi/conversation-memory";
import { getNordiStorage } from "@/lib/nordi/storage";

export function readStoredNordiConversation(): NordiConversationMemory | null {
  return getNordiStorage().load();
}

export function canResumeNordiConversation(memory: NordiConversationMemory | null): boolean {
  if (!memory) return false;
  if ((memory.profile.userMessageCount ?? 0) > 0) return true;
  return hasRelationship(memory);
}

export function getNordiPublicCtaLabel(memory: NordiConversationMemory | null): string {
  return canResumeNordiConversation(memory) ? "Resume Nordi" : "Talk to Nordi";
}
