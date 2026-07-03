export type DisclosureLevel =
  | "public"
  | "sales_safe"
  | "partner_safe"
  | "internal_only";

export const DISCLOSURE_LEVEL_ORDER: DisclosureLevel[] = [
  "public",
  "sales_safe",
  "partner_safe",
  "internal_only",
];

export function isDisclosureAllowed(
  itemLevel: DisclosureLevel,
  allowedLevel: DisclosureLevel,
): boolean {
  return (
    DISCLOSURE_LEVEL_ORDER.indexOf(itemLevel) <=
    DISCLOSURE_LEVEL_ORDER.indexOf(allowedLevel)
  );
}
