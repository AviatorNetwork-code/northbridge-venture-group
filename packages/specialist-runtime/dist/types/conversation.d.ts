/**
 * Adapter boundary for @northbridge/conversation-engine / conversation-state.
 * This runtime does not implement conversation mechanics.
 */
export interface SpecialistConversationAdapter {
    loadThreadContext?(threadRef: string, orgId: string): Promise<Record<string, unknown>>;
}
