const GTM_ID_PATTERN = /^GTM-[A-Z0-9]+$/i;

/**
 * Returns a validated GTM container ID from NEXT_PUBLIC_GTM_ID, or undefined when unset/invalid.
 */
export function getPublicGtmId(): string | undefined {
  const id = process.env.NEXT_PUBLIC_GTM_ID?.trim();
  if (!id || !GTM_ID_PATTERN.test(id)) {
    return undefined;
  }
  return id;
}
