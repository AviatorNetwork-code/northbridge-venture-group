/** Governance — FRB reports only; no execution or repo writes. */
export const FRB_GOVERNANCE = {
  readOnly: true as const,
  allowsTaskExecution: false as const,
  allowsWorkApproval: false as const,
  allowsProductRepoModification: false as const,
  allowsSecretExposure: false as const,
  allowsCustomerPrivateData: false as const,
  allowsPrivateCodeExposure: false as const,
  requiresFounderApprovalForActions: true as const,
};

const FORBIDDEN = [
  "execute_task",
  "approve_work",
  "modify_repo",
  "write_production",
  "send_secrets",
  "send_customer_pii",
  "send_private_code",
] as const;

export function assertReadOnlyOperation(operation: string): void {
  if ((FORBIDDEN as readonly string[]).includes(operation)) {
    throw new Error(
      `FRB governance violation: "${operation}" is forbidden. The bridge reports only — Founder approval required for all actions.`,
    );
  }
}

const SENSITIVE_PATTERNS = [
  /api[_-]?key/i,
  /secret/i,
  /password/i,
  /token/i,
  /webhook/i,
  /sk-[a-z0-9]{10,}/i,
  /Bearer\s+/i,
  /@[a-z0-9.-]+\.(com|net|org)/i,
];

export function sanitizeReportContent(text: string): string {
  let sanitized = text;
  for (const pattern of SENSITIVE_PATTERNS) {
    sanitized = sanitized.replace(pattern, "[redacted]");
  }
  return sanitized;
}

export function validateNoSensitiveContent(text: string): void {
  if (/sk-[a-z0-9]{10,}/i.test(text)) {
    throw new Error("FRB governance violation: content appears to contain secrets");
  }
  if (/password\s*[:=]\s*\S+/i.test(text)) {
    throw new Error("FRB governance violation: content appears to contain credentials");
  }
}
