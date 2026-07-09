export interface TeamLeadPolicy {
    maxConcurrentDelegations: number;
    /** When true, synthesize from successful delegations even if some failed. */
    synthesizeOnPartialFailure: boolean;
    /** Escalate instead of synthesizing when conflicts detected. */
    escalateOnConflict: boolean;
    /** Require every planned delegation to complete before synthesis. */
    requireAllSpecialistsComplete: boolean;
    /** Specialists never customer-facing at launch — synthesis always via Team Lead. */
    customerFacingViaTeamLeadOnly: boolean;
}
export declare const DEFAULT_TEAM_LEAD_POLICY: TeamLeadPolicy;
export interface TeamOrchestratorHooks {
    onBeforeDelegation?(input: {
        sessionId: string;
        delegationId: string;
        specialistId: string;
    }): void | Promise<void>;
    onAfterDelegation?(result: import("./delegation.js").DelegationResult): void | Promise<void>;
    onEscalation?(escalation: import("./escalation.js").TeamEscalation): void | Promise<void>;
}
