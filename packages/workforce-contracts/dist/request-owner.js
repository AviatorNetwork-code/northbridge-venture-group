import { z } from "zod";
import { organizationIdSchema } from "./primitives.js";
/**
 * Request ownership for customer communication routing.
 * Exactly one owner per customer request at all times.
 * @see docs/northbridge-digital-workforce-communication-protocol-v1.md §4
 */
export const requestOwnerTypeSchema = z.enum([
    "nordi",
    "team",
    "manager",
    "director",
    "vice_president",
]);
export const requestOwnerSchema = z
    .object({
    orgId: organizationIdSchema,
    type: requestOwnerTypeSchema,
    /** Entity id for team/manager/director/vp; omitted for nordi. */
    id: z.string().min(1).max(128).optional(),
})
    .strict()
    .superRefine((value, ctx) => {
    if (value.type === "nordi" && value.id !== undefined) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Nordi request owner must not include an entity id",
            path: ["id"],
        });
    }
    if (value.type !== "nordi" && !value.id) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Request owner type '${value.type}' requires an entity id`,
            path: ["id"],
        });
    }
});
export function formatRequestOwner(owner) {
    if (owner.type === "nordi") {
        return "nordi";
    }
    return `${owner.type}:${owner.id}`;
}
export function parseRequestOwner(input) {
    return requestOwnerSchema.parse(input);
}
export function safeParseRequestOwner(input) {
    return requestOwnerSchema.safeParse(input);
}
export function createRequestOwner(orgId, type, id) {
    return parseRequestOwner({ orgId, type, id });
}
