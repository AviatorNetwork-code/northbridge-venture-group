import { type RequestOwner } from "@northbridge/workforce-contracts";
export declare function assignTeamRequestOwner(orgId: string, teamId: string): RequestOwner;
export declare function assertSingleOwner(current: RequestOwner | null, next: RequestOwner): void;
export declare function formatOwner(owner: RequestOwner): string;
