/**
 * Cross-team collaboration boundary — not implemented in Phase 3.
 * @see docs/northbridge-digital-workforce-communication-protocol-v1.md §8
 */
export interface CrossTeamCollaborationAdapter {
    openSession?(input: {
        topic: string;
        ownerTeamId: string;
        participantTeamIds: string[];
        customerThreadRef?: string;
    }): Promise<{
        sessionId: string;
    }>;
}
