const CLARITY_ID_PATTERN = /^[a-z0-9]+$/i;

/**
 * Returns a validated Microsoft Clarity project ID from NEXT_PUBLIC_CLARITY_ID,
 * or undefined when unset or invalid.
 */
export function getPublicClarityId(): string | undefined {
  const id = process.env.NEXT_PUBLIC_CLARITY_ID?.trim();
  if (!id || !CLARITY_ID_PATTERN.test(id)) {
    return undefined;
  }
  return id;
}
