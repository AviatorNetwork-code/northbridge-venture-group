import { z } from "zod";
/**
 * Request ownership for customer communication routing.
 * Exactly one owner per customer request at all times.
 * @see docs/northbridge-digital-workforce-communication-protocol-v1.md §4
 */
export declare const requestOwnerTypeSchema: z.ZodEnum<["nordi", "team", "manager", "director", "vice_president"]>;
export type RequestOwnerType = z.infer<typeof requestOwnerTypeSchema>;
export declare const requestOwnerSchema: z.ZodEffects<z.ZodObject<{
    orgId: z.ZodString;
    type: z.ZodEnum<["nordi", "team", "manager", "director", "vice_president"]>;
    /** Entity id for team/manager/director/vp; omitted for nordi. */
    id: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    type: "manager" | "director" | "vice_president" | "team" | "nordi";
    orgId: string;
    id?: string | undefined;
}, {
    type: "manager" | "director" | "vice_president" | "team" | "nordi";
    orgId: string;
    id?: string | undefined;
}>, {
    type: "manager" | "director" | "vice_president" | "team" | "nordi";
    orgId: string;
    id?: string | undefined;
}, {
    type: "manager" | "director" | "vice_president" | "team" | "nordi";
    orgId: string;
    id?: string | undefined;
}>;
export type RequestOwner = z.infer<typeof requestOwnerSchema>;
export declare function formatRequestOwner(owner: RequestOwner): string;
export declare function parseRequestOwner(input: unknown): RequestOwner;
export declare function safeParseRequestOwner(input: unknown): z.SafeParseReturnType<{
    type: "manager" | "director" | "vice_president" | "team" | "nordi";
    orgId: string;
    id?: string | undefined;
}, {
    type: "manager" | "director" | "vice_president" | "team" | "nordi";
    orgId: string;
    id?: string | undefined;
}>;
export declare function createRequestOwner(orgId: string, type: RequestOwnerType, id?: string): RequestOwner;
