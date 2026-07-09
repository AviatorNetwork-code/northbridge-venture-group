export interface RedactionResult {
  redacted: string | Record<string, unknown>;
  warnings: string[];
  rejected: boolean;
  rejectionReason?: string;
}

export interface RedactionPattern {
  pattern: RegExp;
  label: string;
  reject: boolean;
}
